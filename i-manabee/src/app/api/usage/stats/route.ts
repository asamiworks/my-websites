// 使用状況統計API
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { PLAN_LIMITS } from '@/lib/ai/tokenCounter';

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
    const limits = PLAN_LIMITS[plan];

    // 今日と今月の日付を計算
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const month = new Date(today.getFullYear(), today.getMonth(), 1);

    // 日次使用状況を取得
    const dailyUsageDoc = await adminDb.collection('usage_daily')
      .doc(`${userId}_${today.toISOString().split('T')[0]}`)
      .get();

    // 月次使用状況を取得
    const monthlyUsageDoc = await adminDb.collection('usage_monthly')
      .doc(`${userId}_${month.toISOString().split('T')[0]}`)
      .get();

    const dailyData = dailyUsageDoc.data() || {};
    const monthlyData = monthlyUsageDoc.data() || {};

    // 使用状況統計を構築
    const stats = {
      todayTokens: dailyData.tokens || 0,
      monthlyTokens: monthlyData.tokens || 0,
      todayMessages: dailyData.messages || 0,
      monthlyMessages: monthlyData.messages || 0,
      remainingTokens: Math.max(0, limits.dailyTokens - (dailyData.tokens || 0)),
      remainingMessages: Math.max(0, limits.dailyMessages - (dailyData.messages || 0)),
      costToday: dailyData.cost || 0,
      costMonthly: monthlyData.cost || 0,
      limits: {
        dailyTokens: limits.dailyTokens,
        monthlyTokens: limits.monthlyTokens,
        dailyMessages: limits.dailyMessages,
        monthlyMessages: limits.monthlyMessages
      },
      plan,
      percentages: {
        dailyTokens: Math.round(((dailyData.tokens || 0) / limits.dailyTokens) * 100),
        monthlyTokens: Math.round(((monthlyData.tokens || 0) / limits.monthlyTokens) * 100),
        dailyMessages: Math.round(((dailyData.messages || 0) / limits.dailyMessages) * 100),
        monthlyMessages: Math.round(((monthlyData.messages || 0) / limits.monthlyMessages) * 100)
      }
    };

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