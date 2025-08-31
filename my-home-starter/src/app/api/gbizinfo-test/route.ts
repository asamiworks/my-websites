// src/app/api/gbizinfo-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GBizINFOService } from '../../../services/gbizinfo.service';

// テスト用の法人番号（有名企業）
const TEST_CORPORATE_NUMBERS = {
  '経済産業省': '4000012090001',
  'トヨタ自動車': '1180301018771',
  '積水ハウス': '8120001059652',
  '大和ハウス工業': '8120001059917',
  '住友林業': '1010001008896',
  'パナソニックホームズ': '7120001117310',
  '三井ホーム': '8010401029720',
  'ミサワホーム': '4010001008848',
};

// 結果の型定義
interface TestResults {
  corporateNumber?: string;
  basic?: unknown;
  subsidy?: unknown;
  procurement?: unknown;
  patent?: unknown;
  finance?: unknown;
  workplace?: unknown;
  search?: unknown;
  testType?: string;
  companies?: Record<string, {
    corporateNumber: string;
    basic?: unknown;
    error?: string;
  }>;
  metadata?: {
    timestamp: string;
    apiVersion: string;
    endpoint: string;
  };
}

export async function GET(request: NextRequest) {  // _request を request に修正
  try {
    // 環境変数からAPIトークンを取得
    const apiToken = process.env.GBIZINFO_API_TOKEN;
    
    if (!apiToken) {
      return NextResponse.json(
        { error: 'gBizINFO APIトークンが設定されていません' },
        { status: 500 }
      );
    }

    // クエリパラメータから法人番号またはテストタイプを取得
    const searchParams = request.nextUrl.searchParams;
    const corporateNumber = searchParams.get('corporate_number');
    const testType = searchParams.get('test_type') || 'basic';
    const companyName = searchParams.get('company_name');

    const service = new GBizINFOService(apiToken);
    const results: TestResults = {};  // any を TestResults に変更

    // 特定の法人番号が指定された場合
    if (corporateNumber) {
      results.corporateNumber = corporateNumber;
      
      switch (testType) {
        case 'all':
          results.basic = await service.getBasicInfo(corporateNumber);
          results.subsidy = await service.getSubsidyInfo(corporateNumber);
          results.procurement = await service.getProcurementInfo(corporateNumber);
          results.patent = await service.getPatentInfo(corporateNumber);
          results.finance = await service.getFinanceInfo(corporateNumber);
          results.workplace = await service.getWorkplaceInfo(corporateNumber);
          break;
        case 'subsidy':
          results.subsidy = await service.getSubsidyInfo(corporateNumber);
          break;
        case 'procurement':
          results.procurement = await service.getProcurementInfo(corporateNumber);
          break;
        case 'patent':
          results.patent = await service.getPatentInfo(corporateNumber);
          break;
        case 'finance':
          results.finance = await service.getFinanceInfo(corporateNumber);
          break;
        case 'workplace':
          results.workplace = await service.getWorkplaceInfo(corporateNumber);
          break;
        default:
          results.basic = await service.getBasicInfo(corporateNumber);
      }
    }
    // 会社名で検索
    else if (companyName) {
      const searchResults = await service.searchCorporations({
        name: companyName,
        limit: '10',
      });
      results.search = searchResults;
    }
    // デフォルトは住宅関連企業のテスト
    else {
      results.testType = 'housing_companies';
      results.companies = {};

      // 住宅関連企業の基本情報を取得
      for (const [name, number] of Object.entries(TEST_CORPORATE_NUMBERS).slice(2, 5)) {
        try {
          const basicInfo = await service.getBasicInfo(number);
          results.companies[name] = {
            corporateNumber: number,
            basic: basicInfo,
          };
          
          // API制限を考慮して少し待機
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          results.companies[name] = {
            corporateNumber: number,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      }
    }

    // テスト結果にメタデータを追加
    results.metadata = {
      timestamp: new Date().toISOString(),
      apiVersion: 'v1',
      endpoint: 'https://info.gbiz.go.jp/hojin/v1/hojin',
    };

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('gBizINFO APIテストエラー:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// POST メソッド - 複雑な検索条件でのテスト
export async function POST(request: NextRequest) {  // _request を request に修正
  try {
    const apiToken = process.env.GBIZINFO_API_TOKEN;
    
    if (!apiToken) {
      return NextResponse.json(
        { error: 'gBizINFO APIトークンが設定されていません' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const service = new GBizINFOService(apiToken);

    // 検索パラメータを使用して企業を検索
    const searchResults = await service.searchCorporations(body);

    return NextResponse.json({
      results: searchResults,
      searchParams: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('gBizINFO API検索エラー:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}