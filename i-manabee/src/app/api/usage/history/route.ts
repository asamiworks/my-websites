// 使用履歴取得API
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { getUsageTracker } from '@/lib/usage/tracker';
import { z } from 'zod';

// クエリパラメータのバリデーションスキーマ
const historyQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付はYYYY-MM-DD形式で指定してください'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付はYYYY-MM-DD形式で指定してください'),
  childId: z.string().optional(),
});

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

    // クエリパラメータのバリデーション
    const url = new URL(request.url);
    const queryParams = {
      startDate: url.searchParams.get('startDate'),
      endDate: url.searchParams.get('endDate'),
      childId: url.searchParams.get('childId') || undefined,
    };

    const validationResult = historyQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'パラメータエラー',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { startDate, endDate, childId } = validationResult.data;

    // 日付範囲の妥当性チェック
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return NextResponse.json(
        { error: '開始日は終了日より前である必要があります' },
        { status: 400 }
      );
    }

    if (diffDays > 90) {
      return NextResponse.json(
        { error: '取得期間は90日以内で指定してください' },
        { status: 400 }
      );
    }

    // 子どもIDが指定されている場合は権限チェック
    if (childId) {
      // TODO: 子どもプロファイルの権限チェックを実装
      // 現在は簡易チェックのみ
    }

    // 使用履歴を取得
    const tracker = getUsageTracker();
    const usageHistory = await tracker.getUsageHistory(userId, startDate, endDate);

    return NextResponse.json(usageHistory);

  } catch (error: any) {
    console.error('使用履歴取得エラー:', error);

    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'セッションが期限切れです。再度ログインしてください' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: '使用履歴の取得に失敗しました' },
      { status: 500 }
    );
  }
}