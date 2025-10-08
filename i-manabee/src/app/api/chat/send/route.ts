// チャットメッセージ送信API
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { generateAIResponse, getModelConfig } from '@/lib/ai/openai';
import { checkUsageLimits } from '@/lib/usage/limiter';
import { recordUsage } from '@/lib/usage/tracker';
import { countMessageTokens } from '@/lib/usage/tokenCounter';
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

    // AIモデル選択（プランベース）
    const modelConfig = getModelConfig(childData.ageGroup, plan);
    const aiModel = modelConfig.model || 'gpt-4o-mini';

    // 使用制限チェック（新しいシステム）
    const limitCheck = await checkUsageLimits(
      userId,
      message,
      aiModel,
      plan
    );

    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: limitCheck.reason,
          remainingMessages: limitCheck.remainingMessages,
          remainingTokens: limitCheck.remainingTokens,
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
    const aiConfig = {
      model: aiModel,
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

    // トークン使用量の計算
    const promptTokens = aiResponse.tokens.prompt;
    const completionTokens = aiResponse.tokens.completion;
    const totalTokens = aiResponse.tokens.total;

    // コスト計算（簡易版）
    const cost = totalTokens * 0.001; // 仮の計算式

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
      tokens: countMessageTokens(message, aiModel),
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

    // 新しい使用量記録システムで記録
    const subject = 'general'; // TODO: 教科判定ロジックを追加
    await recordUsage(userId, message, aiModel, subject, cost);

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
        remainingMessages: limitCheck.remainingMessages,
        remainingTokens: limitCheck.remainingTokens,
        resetTime: limitCheck.resetTime
      },
      cost: {
        thisMessage: cost
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

