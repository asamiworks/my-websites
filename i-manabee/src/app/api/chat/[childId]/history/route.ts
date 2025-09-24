// チャット履歴取得API
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function GET(
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

    // クエリパラメータの取得
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const beforeTimestamp = url.searchParams.get('before');
    const sessionId = url.searchParams.get('session');

    // チャット履歴クエリの構築
    let query = adminDb
      .collection('chat_messages')
      .where('childId', '==', childId)
      .orderBy('timestamp', 'desc');

    // セッション指定がある場合
    if (sessionId) {
      query = query.where('sessionId', '==', sessionId);
    }

    // 特定の時刻より前のメッセージを取得（ページネーション用）
    if (beforeTimestamp) {
      const beforeDate = new Date(beforeTimestamp);
      query = query.where('timestamp', '<', beforeDate);
    }

    // 制限を適用
    query = query.limit(Math.min(limit, 100)); // 最大100件まで

    // クエリ実行
    const messagesSnapshot = await query.get();

    // メッセージデータを構築
    const messages = messagesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        role: data.role,
        content: data.content,
        timestamp: data.timestamp.toDate(),
        tokens: data.tokens,
        metadata: {
          model: data.metadata?.model,
          safetyScore: data.metadata?.safetyScore,
          ageGroup: data.metadata?.ageGroup,
          cost: data.metadata?.cost
        }
      };
    }).reverse(); // 古い順に並び替え

    // 統計情報の取得
    const statsQuery = await adminDb
      .collection('chat_messages')
      .where('childId', '==', childId)
      .where('role', '==', 'user')
      .get();

    const totalMessages = statsQuery.size;
    const totalTokens = messagesSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().tokens || 0),
      0
    );

    // セッション情報の取得（最新のセッション）
    const activeSessionQuery = await adminDb
      .collection('child_sessions')
      .where('childId', '==', childId)
      .where('status', '==', 'active')
      .orderBy('startedAt', 'desc')
      .limit(1);

    const activeSessionSnapshot = await activeSessionQuery.get();
    const activeSession = activeSessionSnapshot.docs[0]?.data() || null;

    // レスポンス
    return NextResponse.json({
      messages,
      pagination: {
        hasMore: messages.length === limit,
        nextCursor: messages.length > 0 ? messages[messages.length - 1].timestamp.toISOString() : null
      },
      stats: {
        totalMessages,
        totalTokens,
        childName: childData.name,
        ageGroup: childData.ageGroup
      },
      activeSession: activeSession ? {
        sessionId: activeSession.sessionId,
        startedAt: activeSession.startedAt.toDate(),
        expiresAt: activeSession.expiresAt.toDate(),
        messageCount: activeSession.messageCount || 0
      } : null
    });

  } catch (error: any) {
    console.error('チャット履歴取得エラー:', error);

    // エラーログ
    try {
      await adminDb.collection('error_logs').add({
        action: 'chat_history_fetch',
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
      { error: 'チャット履歴の取得に失敗しました' },
      { status: 500 }
    );
  }
}