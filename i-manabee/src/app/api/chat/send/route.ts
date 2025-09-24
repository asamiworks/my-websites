// チャットメッセージ送信API
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { generateAIResponse, getModelConfig } from '@/lib/ai/openai';
import {
  checkUsageLimit,
  calculateCost,
  validateMessageLength,
  generateLimitWarning,
  PLAN_LIMITS
} from '@/lib/ai/tokenCounter';
import { countTokensAccurate } from '@/lib/ai/serverTokenCounter';
import { authenticateWithRateLimit, createAuthErrorResponse } from '@/lib/auth/middleware';
import { z } from 'zod';

// リクエストデータのバリデーションスキーマ
const sendMessageSchema = z.object({
  childId: z.string().min(1, '子どもIDが必要です'),
  message: z.string().min(1, 'メッセージが必要です').max(5000, 'メッセージが長すぎます'),
  sessionId: z.string().min(1, 'セッションIDが必要です')
});

export async function POST(request: NextRequest) {
  try {
    // レート制限付き認証チェック
    const authResult = await authenticateWithRateLimit(request, 'chat');

    if (!authResult.success) {
      return createAuthErrorResponse(authResult);
    }

    const userId = authResult.user!.uid;

    // リクエストボディのバリデーション
    const body = await request.json();
    const validationResult = sendMessageSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'バリデーションエラー',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { childId, message, sessionId } = validationResult.data;

    // セッション検証
    const sessionDoc = await adminDb.collection('child_sessions').doc(sessionId).get();
    if (!sessionDoc.exists) {
      return NextResponse.json(
        { error: 'セッションが見つかりません' },
        { status: 404 }
      );
    }

    const sessionData = sessionDoc.data();
    if (sessionData?.userId !== userId || sessionData?.childId !== childId) {
      return NextResponse.json(
        { error: '不正なセッションです' },
        { status: 403 }
      );
    }

    // セッション有効期限チェック
    if (new Date() > sessionData.expiresAt.toDate()) {
      return NextResponse.json(
        { error: 'セッションが期限切れです' },
        { status: 401 }
      );
    }

    // 子どもプロファイル取得
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

    // メッセージ長さチェック
    const lengthCheck = validateMessageLength(message, plan);
    if (!lengthCheck.valid) {
      return NextResponse.json(
        { error: lengthCheck.error },
        { status: 400 }
      );
    }

    // 現在の使用状況を取得
    const usageStats = await getCurrentUsageStats(userId);

    // 使用制限チェック（サーバーサイドで正確にカウント）
    const inputTokens = countTokensAccurate(message, 'gpt-3.5-turbo');
    const estimatedTokens = inputTokens * 2; // レスポンス分も考慮
    const limitCheck = checkUsageLimit(usageStats, plan, estimatedTokens);

    if (!limitCheck.canProceed) {
      const warningMessage = generateLimitWarning(
        limitCheck.limitType || 'daily_tokens',
        plan,
        childData.ageGroup
      );

      return NextResponse.json(
        {
          error: warningMessage,
          limitType: limitCheck.limitType,
          remaining: limitCheck.remaining,
          resetTime: limitCheck.resetTime
        },
        { status: 429 }
      );
    }

    // チャット履歴を取得
    const chatHistoryQuery = await adminDb
      .collection('chat_messages')
      .where('childId', '==', childId)
      .orderBy('timestamp', 'desc')
      .limit(20); // 直近20メッセージ

    const chatHistorySnapshot = await chatHistoryQuery.get();
    const recentMessages = chatHistorySnapshot.docs
      .map(doc => doc.data())
      .reverse(); // 古い順に並び替え

    // AI設定の構築
    const modelConfig = getModelConfig(childData.ageGroup, plan);
    const aiConfig = {
      model: modelConfig.model || 'gpt-3.5-turbo',
      maxTokens: modelConfig.maxTokens || 500,
      temperature: modelConfig.temperature || 0.7,
      ageGroup: childData.ageGroup,
      childAge: childData.age || 10,
      interests: childData.interests || [],
      learningGoals: childData.learningGoals || [],
      safetyLevel: childData.settings?.safetyLevel || 'moderate'
    };

    // メッセージ履歴の構築
    const messages = [
      ...recentMessages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toDate()
      })),
      {
        role: 'user' as const,
        content: message,
        timestamp: new Date()
      }
    ];

    // AI応答の生成
    const aiResponse = await generateAIResponse(messages, aiConfig);

    // トークン使用量とコストの計算
    const promptTokens = aiResponse.tokens.prompt;
    const completionTokens = aiResponse.tokens.completion;
    const totalTokens = aiResponse.tokens.total;
    const cost = calculateCost(promptTokens, completionTokens, aiResponse.model);

    // データベースに保存
    const timestamp = new Date();
    const batch = adminDb.batch();

    // ユーザーメッセージを保存
    const userMessageRef = adminDb.collection('chat_messages').doc();
    batch.set(userMessageRef, {
      id: userMessageRef.id,
      userId,
      childId,
      sessionId,
      role: 'user',
      content: message,
      timestamp,
      tokens: lengthCheck.tokensUsed,
      metadata: {
        ageGroup: childData.ageGroup,
        safetyLevel: childData.settings?.safetyLevel
      }
    });

    // AIメッセージを保存
    const aiMessageRef = adminDb.collection('chat_messages').doc();
    batch.set(aiMessageRef, {
      id: aiMessageRef.id,
      userId,
      childId,
      sessionId,
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date(timestamp.getTime() + 1000), // 1秒後
      tokens: totalTokens,
      metadata: {
        model: aiResponse.model,
        safetyScore: aiResponse.safetyScore,
        reasoning: aiResponse.reasoning,
        ageGroup: childData.ageGroup,
        promptTokens,
        completionTokens,
        cost
      }
    });

    // 使用状況の更新
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const month = new Date(today.getFullYear(), today.getMonth(), 1);

    // 日次使用状況
    const dailyUsageRef = adminDb.collection('usage_daily').doc(`${userId}_${today.toISOString().split('T')[0]}`);
    batch.set(dailyUsageRef, {
      userId,
      date: today,
      tokens: (usageStats.todayTokens || 0) + totalTokens,
      messages: (usageStats.todayMessages || 0) + 1,
      cost: (usageStats.costToday || 0) + cost
    }, { merge: true });

    // 月次使用状況
    const monthlyUsageRef = adminDb.collection('usage_monthly').doc(`${userId}_${month.toISOString().split('T')[0]}`);
    batch.set(monthlyUsageRef, {
      userId,
      month,
      tokens: (usageStats.monthlyTokens || 0) + totalTokens,
      messages: (usageStats.monthlyMessages || 0) + 1,
      cost: (usageStats.costMonthly || 0) + cost
    }, { merge: true });

    // 子どもプロファイルの統計更新
    batch.update(adminDb.collection('child_profiles').doc(childId), {
      'profile.lastActiveAt': timestamp,
      'profile.totalMessages': (childData.profile?.totalMessages || 0) + 1
    });

    // セッションの最終活動時刻更新
    batch.update(adminDb.collection('child_sessions').doc(sessionId), {
      lastActivity: timestamp,
      messageCount: (sessionData.messageCount || 0) + 1
    });

    // 一括保存
    await batch.commit();

    // COPPA対応ログ（13歳未満の場合）
    if (childData.privacy?.isUnder13) {
      await adminDb.collection('coppa_logs').add({
        parentId: userId,
        childId,
        action: 'chat_interaction',
        timestamp,
        sessionId,
        metadata: {
          messageLength: message.length,
          tokensUsed: totalTokens,
          safetyScore: aiResponse.safetyScore,
          model: aiResponse.model
        }
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
      action: 'chat_message_sent',
      status: 'success',
      timestamp,
      metadata: {
        ip: clientIP,
        tokensUsed: totalTokens,
        safetyScore: aiResponse.safetyScore,
        ageGroup: childData.ageGroup
      }
    });

    // レスポンス
    return NextResponse.json({
      response: aiResponse.content,
      tokens: {
        prompt: promptTokens,
        completion: completionTokens,
        total: totalTokens
      },
      model: aiResponse.model,
      safetyScore: aiResponse.safetyScore,
      suggestions: aiResponse.suggestions || [],
      usage: {
        todayTokens: (usageStats.todayTokens || 0) + totalTokens,
        todayMessages: (usageStats.todayMessages || 0) + 1,
        monthlyTokens: (usageStats.monthlyTokens || 0) + totalTokens,
        monthlyMessages: (usageStats.monthlyMessages || 0) + 1
      },
      cost: {
        thisMessage: cost,
        today: (usageStats.costToday || 0) + cost,
        monthly: (usageStats.costMonthly || 0) + cost
      }
    });

  } catch (error: any) {
    console.error('チャットメッセージ送信エラー:', error);

    // エラーログ
    try {
      let requestBody: any = {};
      try {
        requestBody = await request.json();
      } catch {
        // リクエストボディが既に消費されている場合
      }

      await adminDb.collection('error_logs').add({
        action: 'chat_message_send',
        error: error.message,
        timestamp: new Date(),
        metadata: {
          stack: error.stack,
          body: JSON.stringify(requestBody)
        }
      });
    } catch (logError) {
      console.error('エラーログ記録失敗:', logError);
    }

    // エラー種別に応じたレスポンス
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'セッションが期限切れです。再度ログインしてください' },
        { status: 401 }
      );
    }

    if (error.message?.includes('Rate limit')) {
      return NextResponse.json(
        { error: 'AI APIの利用制限に達しました。しばらく時間をおいてからお試しください' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'メッセージの送信に失敗しました' },
      { status: 500 }
    );
  }
}

// 現在の使用状況を取得する関数
async function getCurrentUsageStats(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const month = new Date(today.getFullYear(), today.getMonth(), 1);

  // 日次使用状況
  const dailyUsageDoc = await adminDb.collection('usage_daily')
    .doc(`${userId}_${today.toISOString().split('T')[0]}`)
    .get();

  // 月次使用状況
  const monthlyUsageDoc = await adminDb.collection('usage_monthly')
    .doc(`${userId}_${month.toISOString().split('T')[0]}`)
    .get();

  const dailyData = dailyUsageDoc.data() || {};
  const monthlyData = monthlyUsageDoc.data() || {};

  return {
    todayTokens: dailyData.tokens || 0,
    monthlyTokens: monthlyData.tokens || 0,
    todayMessages: dailyData.messages || 0,
    monthlyMessages: monthlyData.messages || 0,
    remainingTokens: 0, // 計算は呼び出し側で
    remainingMessages: 0, // 計算は呼び出し側で
    costToday: dailyData.cost || 0,
    costMonthly: monthlyData.cost || 0
  };
}