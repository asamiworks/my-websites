// PIN認証API
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';

// リクエストデータのバリデーションスキーマ
const pinVerifySchema = z.object({
  pin: z.string().regex(/^\d{4}$/, 'PINは4桁の数字で入力してください')
});

export async function POST(
  request: NextRequest,
  { params }: { params: { childId: string } }
) {
  try {
    const childId = params.childId;

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
    const validationResult = pinVerifySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'バリデーションエラー',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { pin } = validationResult.data;

    // 子どもプロファイルの取得
    const childDoc = await adminDb.collection('child_profiles').doc(childId).get();

    if (!childDoc.exists) {
      return NextResponse.json(
        { error: '子どもプロファイルが見つかりません' },
        { status: 404 }
      );
    }

    const childData = childDoc.data();

    // 親子関係の確認
    if (childData?.parentId !== userId) {
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 403 }
      );
    }

    // PIN認証の試行回数制限チェック
    const attemptKey = `pin_attempts_${childId}_${userId}`;
    const attemptDoc = await adminDb.collection('security_attempts').doc(attemptKey).get();
    const attemptData = attemptDoc.data();

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // 5分以内の失敗回数をカウント
    const recentFailures = attemptData?.failures?.filter(
      (failure: any) => new Date(failure.timestamp.toDate()) > fiveMinutesAgo
    ) || [];

    if (recentFailures.length >= 5) {
      return NextResponse.json(
        { error: 'PIN認証の試行回数が上限に達しました。しばらく時間をおいてからお試しください' },
        { status: 429 }
      );
    }

    // PIN検証
    const isValidPin = await bcrypt.compare(pin, childData.pinHash);

    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';

    if (!isValidPin) {
      // 失敗記録
      const newFailure = {
        timestamp: now,
        ip: clientIP,
        userAgent: request.headers.get('user-agent') || 'unknown'
      };

      await adminDb.collection('security_attempts').doc(attemptKey).set({
        childId,
        parentId: userId,
        failures: [...(attemptData?.failures || []), newFailure],
        lastFailure: now
      }, { merge: true });

      // セキュリティログ
      await adminDb.collection('security_logs').add({
        userId,
        childId,
        action: 'pin_verification_failed',
        status: 'failed',
        timestamp: now,
        metadata: {
          ip: clientIP,
          attemptCount: recentFailures.length + 1
        }
      });

      return NextResponse.json(
        { error: 'PINが正しくありません' },
        { status: 401 }
      );
    }

    // 成功時：試行回数リセット
    if (attemptData) {
      await adminDb.collection('security_attempts').doc(attemptKey).delete();
    }

    // セッション情報の生成
    const sessionData = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      childId,
      childName: childData.name,
      ageGroup: childData.ageGroup,
      safetyLevel: childData.settings?.safetyLevel || 'moderate',
      sessionTimeout: childData.settings?.sessionTimeout || 120,
      startedAt: now,
      expiresAt: new Date(now.getTime() + (childData.settings?.sessionTimeout || 120) * 60 * 1000),
      permissions: {
        allowVoiceInput: childData.settings?.allowVoiceInput || false,
        allowImageUploads: childData.settings?.allowImageUploads || false,
        parentalNotifications: childData.settings?.parentalNotifications || false
      }
    };

    // セッション記録
    await adminDb.collection('child_sessions').doc(sessionData.sessionId).set(sessionData);

    // 子どもプロファイルの最終アクティビティ更新
    await adminDb.collection('child_profiles').doc(childId).update({
      'profile.lastActiveAt': now,
      'profile.totalSessions': (childData.profile?.totalSessions || 0) + 1
    });

    // 親のユーザーデータも更新
    await adminDb.collection('users').doc(userId).update({
      'profile.lastChildSessionAt': now
    });

    // セキュリティログ（成功）
    await adminDb.collection('security_logs').add({
      userId,
      childId,
      action: 'pin_verification_success',
      status: 'success',
      timestamp: now,
      sessionId: sessionData.sessionId,
      metadata: {
        ip: clientIP,
        ageGroup: childData.ageGroup
      }
    });

    // COPPA対応ログ（13歳未満の場合）
    if (childData.privacy?.isUnder13) {
      await adminDb.collection('coppa_logs').add({
        parentId: userId,
        childId,
        action: 'session_started',
        timestamp: now,
        sessionId: sessionData.sessionId,
        metadata: {
          safetyLevel: childData.settings?.safetyLevel,
          dataMinimization: true
        }
      });
    }

    // レスポンス
    return NextResponse.json({
      sessionId: sessionData.sessionId,
      child: {
        id: childData.id,
        name: childData.name,
        ageGroup: childData.ageGroup,
        safetyLevel: childData.settings?.safetyLevel
      },
      session: {
        expiresAt: sessionData.expiresAt,
        timeoutMinutes: childData.settings?.sessionTimeout || 120,
        permissions: sessionData.permissions
      },
      message: 'PIN認証が成功しました'
    }, { status: 200 });

  } catch (error: any) {
    console.error('PIN認証エラー:', error);

    // エラーログ
    try {
      await adminDb.collection('error_logs').add({
        action: 'pin_verification',
        childId: params.childId,
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
      { error: 'PIN認証でエラーが発生しました' },
      { status: 500 }
    );
  }
}