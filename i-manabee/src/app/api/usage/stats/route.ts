// 使用状況統計API
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { getUserUsageStats } from '@/lib/usage/limiter';

export async function GET(request: NextRequest) {
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
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // ユーザーデータ取得
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'ユーザーデータが見つかりません' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const plan = userData?.plan || 'free';

    // 新しい使用量システムから統計取得
    const stats = await getUserUsageStats(userId, plan);

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('使用状況取得エラー:', error);

    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'セッションが期限切れです。再度ログインしてください' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: '使用状況の取得に失敗しました' },
      { status: 500 }
    );
  }
}