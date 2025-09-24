// 使用制限チェックAPI
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { checkUsageLimit, generateLimitWarning, generateUpgradeMessage, PLAN_LIMITS } from '@/lib/ai/tokenCounter';
import { z } from 'zod';

// リクエストデータのバリデーションスキーマ
const checkUsageSchema = z.object({
  plan: z.string(),
  estimatedTokens: z.number().min(0).max(10000).optional().default(500)
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
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // リクエストボディのバリデーション
    const body = await request.json();
    const validationResult = checkUsageSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'バリデーションエラー',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { plan, estimatedTokens } = validationResult.data;

    // 子どもプロファイルの取得（年齢グループ判定のため）
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'ユーザーデータが見つかりません' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const children = userData?.children || [];
    const ageGroup = children[0]?.ageGroup || 'middle'; // デフォルト

    // 今日と今月の日付を計算
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const month = new Date(today.getFullYear(), today.getMonth(), 1);

    // 現在の使用状況を取得
    const dailyUsageDoc = await adminDb.collection('usage_daily')
      .doc(`${userId}_${today.toISOString().split('T')[0]}`)
      .get();

    const monthlyUsageDoc = await adminDb.collection('usage_monthly')
      .doc(`${userId}_${month.toISOString().split('T')[0]}`)
      .get();

    const dailyData = dailyUsageDoc.data() || {};
    const monthlyData = monthlyUsageDoc.data() || {};

    // 使用状況統計を構築
    const usageStats = {
      todayTokens: dailyData.tokens || 0,
      monthlyTokens: monthlyData.tokens || 0,
      todayMessages: dailyData.messages || 0,
      monthlyMessages: monthlyData.messages || 0,
      remainingTokens: 0, // checkUsageLimitで計算
      remainingMessages: 0, // checkUsageLimitで計算
      costToday: dailyData.cost || 0,
      costMonthly: monthlyData.cost || 0
    };

    // 使用制限をチェック
    const limitCheck = checkUsageLimit(usageStats, plan, estimatedTokens);

    // レスポンスデータを構築
    const responseData = {
      canProceed: limitCheck.canProceed,
      limitType: limitCheck.limitType,
      remaining: limitCheck.remaining,
      resetTime: limitCheck.resetTime,
      currentUsage: usageStats,
      limits: PLAN_LIMITS[plan],
      warnings: [] as string[],
      recommendations: [] as string[]
    };

    // 制限に達している場合の警告メッセージ
    if (!limitCheck.canProceed && limitCheck.limitType) {
      const warningMessage = generateLimitWarning(limitCheck.limitType, plan, ageGroup);
      responseData.warnings.push(warningMessage);

      const upgradeMessage = generateUpgradeMessage(plan, limitCheck.limitType, ageGroup);
      if (upgradeMessage) {
        responseData.recommendations.push(upgradeMessage);
      }
    }

    // 使用量が多い場合の警告（80%以上）
    const dailyPercentage = (usageStats.todayTokens / PLAN_LIMITS[plan].dailyTokens) * 100;
    const monthlyPercentage = (usageStats.monthlyTokens / PLAN_LIMITS[plan].monthlyTokens) * 100;

    if (dailyPercentage >= 80) {
      const message = ageGroup === 'junior'
        ? 'きょうはたくさんべんきょうしたね！もうすこしでおしまいだよ🐝'
        : '今日の利用量が制限に近づいています。';
      responseData.warnings.push(message);
    }

    if (monthlyPercentage >= 80) {
      const message = ageGroup === 'junior'
        ? 'こんげつもたくさんがんばってるね！もうすぐせいげんだよ🐝'
        : '月間の利用量が制限に近づいています。';
      responseData.warnings.push(message);
    }

    // プラン別の推奨事項
    if (plan === 'free' && monthlyPercentage >= 50) {
      const message = ageGroup === 'junior'
        ? 'おうちのひとにもっとべんきょうできるプランをきいてみてね！'
        : 'より多くの学習を続けるために、プランのアップグレードをご検討ください。';
      responseData.recommendations.push(message);
    }

    // 使用パターンに基づく推奨事項
    if (usageStats.todayMessages > usageStats.monthlyMessages / 30 * 2) {
      // 今日のメッセージ数が月平均の2倍以上
      const message = ageGroup === 'junior'
        ? 'きょうはとってもがんばってるね！やすけいもたいせつだよ🐝'
        : '今日は特に活発に学習していますね。適度な休憩も大切です。';
      responseData.recommendations.push(message);
    }

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('使用制限チェックエラー:', error);

    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'セッションが期限切れです。再度ログインしてください' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: '使用制限チェックに失敗しました' },
      { status: 500 }
    );
  }
}