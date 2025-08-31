import { NextResponse } from 'next/server';
import { IntegratedAreaService } from '@/services/integratedAreaService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prefecture = searchParams.get('prefecture') || '東京都';
  const city = searchParams.get('city') || '千代田区';
  
  try {
    console.log(`Testing simplified integrated service for ${prefecture} ${city}`);
    
    // 統合データの取得（静的データのみ）
    const areaData = await IntegratedAreaService.getAreaData(
      prefecture,
      city,
      { includeLandPriceHistory: true }
    );
    
    // レスポンスの整形
    const response = {
      success: true,
      query: { prefecture, city },
      data: {
        statistics: areaData.statistics,
        landPrice: {
          hasData: areaData.landPrice.hasData,
          current: areaData.landPrice.current,
          historyCount: areaData.landPrice.history.length,
          // 最近5年分のみ返す
          recentHistory: areaData.landPrice.history.slice(-5)
        }
      },
      availableAreas: IntegratedAreaService.getAvailableAreas()
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Simplified API test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      query: { prefecture, city }
    }, { status: 500 });
  }
}