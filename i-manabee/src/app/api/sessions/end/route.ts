// セッション終了API
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// リクエストデータのバリデーションスキーマ
const endSessionSchema = z.object({
  sessionId: z.string().min(1, 'セッションIDが必要です'),
  reason: z.enum(['timeout', 'manual', 'parent_override']).optional()
});

export async function POST(request: NextRequest) {
  try {
    // 認証ヘッダーからIDトークンを取得
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];

    // IDトークンの検証
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // リクエストボディのバリデーション
    const body = await request.json();
    const validationResult = endSessionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'バリデーションエラー',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { sessionId, reason = 'manual' } = validationResult.data;

    // セッション情報の取得
    const sessionDoc = await adminDb.collection('child_sessions').doc(sessionId).get();

    if (!sessionDoc.exists) {
      return NextResponse.json(
        { error: 'セッションが見つかりません' },
        { status: 404 }
      );
    }

    const sessionData = sessionDoc.data();

    // セッションの所有者確認
    if (sessionData?.userId !== userId) {
      return NextResponse.json(
        { error: 'セッション終了の権限がありません' },
        { status: 403 }
      );
    }

    const endTime = new Date();
    const sessionDuration = endTime.getTime() - new Date(sessionData.startedAt.toDate()).getTime();

    // セッション終了データの更新
    await adminDb.collection('child_sessions').doc(sessionId).update({
      endedAt: endTime,
      duration: sessionDuration,
      endReason: reason,
      status: 'ended'
    });

    // セッション統計の更新
    const childId = sessionData.childId;
    const sessionDurationMinutes = Math.round(sessionDuration / (1000 * 60));

    // 子どもプロファイルの統計更新
    const childDoc = await adminDb.collection('child_profiles').doc(childId).get();
    if (childDoc.exists) {
      const childData = childDoc.data();
      const currentStats = childData?.stats || {};

      await adminDb.collection('child_profiles').doc(childId).update({
        'stats.totalSessionTime': (currentStats.totalSessionTime || 0) + sessionDurationMinutes,
        'stats.averageSessionTime': Math.round(
          ((currentStats.totalSessionTime || 0) + sessionDurationMinutes) /
          ((childData?.profile?.totalSessions || 0) + 1)
        ),
        'profile.lastSessionDuration': sessionDurationMinutes
      });
    }

    // 親の統計更新
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const currentUsage = userData?.usage || {};

      await adminDb.collection('users').doc(userId).update({
        'usage.totalChildSessionTime': (currentUsage.totalChildSessionTime || 0) + sessionDurationMinutes,
        'usage.totalChildSessions': (currentUsage.totalChildSessions || 0) + 1,
        'profile.lastChildSessionEndedAt': endTime
      });
    }

    // セキュリティログ
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';

    await adminDb.collection('security_logs').add({
      userId,
      childId,
      sessionId,
      action: 'session_ended',
      status: 'success',
      timestamp: endTime,
      metadata: {
        ip: clientIP,
        reason,
        durationMinutes: sessionDurationMinutes
      }
    });

    // COPPA対応ログ（13歳未満の場合）
    if (sessionData.isUnder13) {
      await adminDb.collection('coppa_logs').add({
        parentId: userId,
        childId,
        action: 'session_ended',
        timestamp: endTime,
        sessionId,
        metadata: {
          durationMinutes: sessionDurationMinutes,
          endReason: reason
        }
      });
    }

    // 使用時間警告チェック（1日の制限など）
    let warning = null;
    if (sessionDurationMinutes > 120) { // 2時間以上
      warning = 'long_session';
    }

    // 日次使用時間の計算（オプション）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessionsQuery = await adminDb.collection('child_sessions')
      .where('childId', '==', childId)
      .where('startedAt', '>=', today)
      .where('startedAt', '<', tomorrow)
      .where('status', '==', 'ended')
      .get();

    const todayTotalMinutes = todaySessionsQuery.docs.reduce((total, doc) => {
      return total + (doc.data().duration ? Math.round(doc.data().duration / (1000 * 60)) : 0);
    }, 0);

    if (todayTotalMinutes > 180) { // 3時間以上
      warning = 'daily_limit_exceeded';
    }

    // レスポンス
    return NextResponse.json({
      sessionId,
      endedAt: endTime,
      duration: {
        milliseconds: sessionDuration,
        minutes: sessionDurationMinutes
      },
      stats: {
        todayTotalMinutes,
        sessionCount: todaySessionsQuery.docs.length
      },
      warning,
      message: 'セッションが終了しました'
    }, { status: 200 });

  } catch (error: any) {
    console.error('セッション終了エラー:', error);

    // エラーログ
    try {
      await adminDb.collection('error_logs').add({
        action: 'session_end',
        error: error.message,
        timestamp: new Date(),
        metadata: {
          stack: error.stack
        }
      });
    } catch (logError) {
      console.error('エラーログ記録失敗:', logError);
    }

    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'セッションが期限切れです。再度ログインしてください' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'セッション終了でエラーが発生しました' },
      { status: 500 }
    );
  }
}