// 統合ヘルスチェックエンドポイント
import { NextRequest, NextResponse } from 'next/server';
import { healthChecker } from '@/lib/monitoring/healthCheck';
import { checkAPIRateLimit } from '@/lib/security/rateLimit';

export async function GET(request: NextRequest) {
  try {
    // レート制限チェック（ヘルスチェックは緩い制限）
    const rateLimitResult = await checkAPIRateLimit(request, 'general');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // 包括的なヘルスチェックを実行
    const healthStatus = await healthChecker.performFullHealthCheck();

    // レスポンスのステータスコードを決定
    let statusCode = 200;
    if (healthStatus.overall === 'degraded') statusCode = 200; // 注意が必要だが稼働中
    if (healthStatus.overall === 'unhealthy') statusCode = 503; // サービス利用不可

    // 簡略化されたレスポンス（外部監視ツール用）
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    if (format === 'simple') {
      return NextResponse.json({
        status: healthStatus.overall,
        timestamp: healthStatus.timestamp
      }, { status: statusCode });
    }

    // 詳細なレスポンス
    return NextResponse.json({
      status: healthStatus.overall,
      timestamp: healthStatus.timestamp,
      services: healthStatus.services.map(service => ({
        name: service.service,
        status: service.status,
        responseTime: service.responseTime,
        error: service.error
      })),
      summary: {
        total: healthStatus.services.length,
        healthy: healthStatus.services.filter(s => s.status === 'healthy').length,
        degraded: healthStatus.services.filter(s => s.status === 'degraded').length,
        unhealthy: healthStatus.services.filter(s => s.status === 'unhealthy').length
      }
    }, { status: statusCode });

  } catch (error) {
    console.error('Health check endpoint error:', error);

    return NextResponse.json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: Date.now()
    }, { status: 503 });
  }
}

// 特定サービスのヘルスチェック
export async function POST(request: NextRequest) {
  try {
    // レート制限チェック
    const rateLimitResult = await checkAPIRateLimit(request, 'general');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { service } = await request.json();

    if (!service || typeof service !== 'string') {
      return NextResponse.json(
        { error: 'Service name required' },
        { status: 400 }
      );
    }

    const result = await healthChecker.checkServiceHealth(service);

    let statusCode = 200;
    if (result.status === 'degraded') statusCode = 200;
    if (result.status === 'unhealthy') statusCode = 503;

    return NextResponse.json(result, { status: statusCode });

  } catch (error) {
    console.error(`Service health check failed for ${request.body}:`, error);

    return NextResponse.json({
      service: 'unknown',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }, { status: 503 });
  }
}