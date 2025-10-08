// 使用制限チェックAPI
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { checkUsageLimits } from '@/lib/usage/limiter';
import { z } from 'zod';

// リクエストデータのバリデーションスキーマ
const checkUsageSchema = z.object({
  content: z.string().min(1, 'メッセージ内容が必要です'),
  model: z.enum(['gpt-4o-mini', 'gemini-2.5-flash-lite', 'claude-sonnet-4.5']).optional().default('gpt-4o-mini'),
  plan: z.string()
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

    const { content, model, plan } = validationResult.data;

    // 新しい使用量制限システムでチェック
    const limitCheck = await checkUsageLimits(userId, content, model, plan);

    return NextResponse.json({
      allowed: limitCheck.allowed,
      reason: limitCheck.reason,
      remainingMessages: limitCheck.remainingMessages,
      remainingTokens: limitCheck.remainingTokens,
      resetTime: limitCheck.resetTime
    });

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