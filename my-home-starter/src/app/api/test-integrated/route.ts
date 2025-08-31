// app/api/test-integrated/route.ts
import { NextResponse } from 'next/server';
import { IntegratedAreaService } from '@/services/integratedAreaService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prefecture = searchParams.get('prefecture') || '東京都';
  const city = searchParams.get('city') || '千代田区';
  
  try {
    // 統合データの取得
    const data = await IntegratedAreaService.getAreaData(prefecture, city);
    
    return NextResponse.json({
      success: true,
      data,
      availableAreas: IntegratedAreaService.getAvailableAreas()
    });
  } catch (error) {
    console.error('Error fetching integrated data:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null
    }, { status: 500 });
  }
}