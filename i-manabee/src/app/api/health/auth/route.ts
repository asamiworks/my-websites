// Firebase認証 ヘルスチェック
import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const auth = admin.auth();

    if (!auth) {
      return NextResponse.json({
        status: 'unhealthy',
        error: 'Firebase Auth not initialized',
        timestamp: Date.now()
      }, { status: 503 });
    }

    const startTime = Date.now();

    // テストユーザーでのヘルスチェック
    // 存在しないユーザーIDで getUserを呼び出して接続性を確認
    const testUid = 'health-check-test-uid-' + Date.now();

    try {
      await auth.getUser(testUid);
      // このユーザーは存在しないはずなので、ここに到達したら予期しない状況
      return NextResponse.json({
        status: 'degraded',
        warning: 'Unexpected user found during health check',
        responseTime: Date.now() - startTime,
        timestamp: Date.now()
      });
    } catch (authError: any) {
      // 'auth/user-not-found' エラーが期待される正常な応答
      if (authError.code === 'auth/user-not-found') {
        const responseTime = Date.now() - startTime;

        // 追加の接続チェック: カスタムトークンの生成をテスト
        try {
          const testToken = await auth.createCustomToken('health-check-test');

          // トークンが生成できればFirebase Authは正常
          return NextResponse.json({
            status: 'healthy',
            responseTime,
            capabilities: {
              userManagement: true,
              customTokens: true,
              tokenGeneration: !!testToken
            },
            timestamp: Date.now()
          });
        } catch (tokenError) {
          // カスタムトークン生成に失敗した場合でも、基本機能は動作している
          return NextResponse.json({
            status: 'degraded',
            responseTime,
            warning: 'Custom token generation failed',
            capabilities: {
              userManagement: true,
              customTokens: false
            },
            error: tokenError instanceof Error ? tokenError.message : 'Unknown token error',
            timestamp: Date.now()
          });
        }
      } else {
        // 予期しないエラー
        throw authError;
      }
    }

  } catch (error) {
    console.error('Firebase Auth health check failed:', error);

    let errorMessage = 'Unknown error';
    let statusCode = 503;

    if (error instanceof Error) {
      errorMessage = error.message;

      // Firebase Admin SDKのエラータイプによる分類
      if (error.message.includes('credential') || error.message.includes('authentication')) {
        errorMessage = 'Firebase Admin credential error';
        statusCode = 401;
      } else if (error.message.includes('project') || error.message.includes('PROJECT_ID')) {
        errorMessage = 'Firebase project configuration error';
        statusCode = 500;
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = 'Network error connecting to Firebase';
        statusCode = 503;
      } else if (error.message.includes('permission') || error.message.includes('PERMISSION')) {
        errorMessage = 'Insufficient permissions for Firebase Auth operations';
        statusCode = 403;
      }
    }

    return NextResponse.json({
      status: 'unhealthy',
      error: errorMessage,
      timestamp: Date.now()
    }, { status: statusCode });
  }
}