// チャット履歴クリアAPI
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function DELETE(
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
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 子どもプロファイルの存在確認と親子関係の確認
    const childDoc = await adminDb.collection('child_profiles').doc(childId).get();
    if (!childDoc.exists) {
      return NextResponse.json(
        { error: '子どもプロファイルが見つかりません' },
        { status: 404 }
      );
    }

    const childData = childDoc.data();
    if (childData?.parentId !== userId) {
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 403 }
      );
    }

    // クエリパラメータで削除範囲を指定
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session'); // 特定のセッションのみ削除
    const days = url.searchParams.get('days'); // 指定日数以前のメッセージを削除

    // 削除対象のメッセージを取得
    let query = adminDb
      .collection('chat_messages')
      .where('childId', '==', childId);

    // セッション指定がある場合
    if (sessionId) {
      query = query.where('sessionId', '==', sessionId);
    }

    // 日数指定がある場合
    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
      query = query.where('timestamp', '<', cutoffDate);
    }

    const messagesToDelete = await query.get();

    if (messagesToDelete.empty) {
      return NextResponse.json({
        message: '削除対象のメッセージが見つかりませんでした',
        deletedCount: 0
      });
    }

    // バッチでメッセージを削除
    const batch = adminDb.batch();
    let deletedCount = 0;

    messagesToDelete.docs.forEach(doc => {
      batch.delete(doc.ref);
      deletedCount++;
    });

    // 削除実行
    await batch.commit();

    // セキュリティログ
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';

    await adminDb.collection('security_logs').add({
      userId,
      childId,
      action: 'chat_history_cleared',
      status: 'success',
      timestamp: new Date(),
      metadata: {
        ip: clientIP,
        deletedCount,
        sessionId: sessionId || 'all',
        daysCutoff: days || null
      }
    });

    // COPPA対応ログ（13歳未満の場合）
    if (childData.privacy?.isUnder13) {
      await adminDb.collection('coppa_logs').add({
        parentId: userId,
        childId,
        action: 'chat_history_deleted',
        timestamp: new Date(),
        metadata: {
          deletedCount,
          deletionType: sessionId ? 'session' : days ? 'time_range' : 'all'
        }
      });
    }

    return NextResponse.json({
      message: 'チャット履歴を削除しました',
      deletedCount
    });

  } catch (error: any) {
    console.error('チャット履歴削除エラー:', error);

    // エラーログ
    try {
      await adminDb.collection('error_logs').add({
        action: 'chat_history_clear',
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
      { error: 'チャット履歴の削除に失敗しました' },
      { status: 500 }
    );
  }
}