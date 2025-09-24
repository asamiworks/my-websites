// OpenAI API ヘルスチェック
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        status: 'unhealthy',
        error: 'OpenAI API key not configured',
        timestamp: Date.now()
      }, { status: 503 });
    }

    const openai = new OpenAI({
      apiKey: apiKey
    });

    const startTime = Date.now();

    // 軽量なAPI呼び出しでヘルスチェック
    // models.listを使用して接続性を確認
    const response = await openai.models.list();

    const responseTime = Date.now() - startTime;

    // レスポンスの妥当性チェック
    if (!response || !response.data || !Array.isArray(response.data)) {
      return NextResponse.json({
        status: 'unhealthy',
        error: 'Invalid response format from OpenAI API',
        responseTime,
        timestamp: Date.now()
      }, { status: 503 });
    }

    // 利用可能なGPTモデルをチェック
    const availableModels = response.data.map(model => model.id);
    const requiredModels = ['gpt-3.5-turbo', 'gpt-4'];
    const hasRequiredModels = requiredModels.some(model =>
      availableModels.some(available => available.includes(model))
    );

    return NextResponse.json({
      status: hasRequiredModels ? 'healthy' : 'degraded',
      responseTime,
      availableModels: availableModels.filter(model =>
        model.includes('gpt') || model.includes('text-embedding')
      ).slice(0, 10), // 最初の10個のみ
      hasRequiredModels,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('OpenAI health check failed:', error);

    let errorMessage = 'Unknown error';
    let statusCode = 503;

    if (error instanceof Error) {
      errorMessage = error.message;

      // OpenAI APIのエラータイプによる分類
      if (error.message.includes('401') || error.message.includes('authentication')) {
        errorMessage = 'Authentication failed - invalid API key';
        statusCode = 401;
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded';
        statusCode = 429;
      } else if (error.message.includes('timeout') || error.message.includes('TIMEOUT')) {
        errorMessage = 'Request timeout';
        statusCode = 504;
      } else if (error.message.includes('network') || error.message.includes('NETWORK')) {
        errorMessage = 'Network error';
        statusCode = 503;
      }
    }

    return NextResponse.json({
      status: 'unhealthy',
      error: errorMessage,
      timestamp: Date.now()
    }, { status: statusCode });
  }
}