// scripts/updateZEHBuildersWithBranches.ts

import { PrismaClient } from '@prisma/client';
import { CorporateNumberService } from '../src/services/corporateNumberService';
import { GBizINFOService } from '../src/services/gbizinfo.service';

const prisma = new PrismaClient();

interface BranchInfo {
  name: string;
  type: '本社' | '支店' | '営業所' | 'ショールーム';
  prefecture: string;
  city: string;
  street?: string;
  phoneNumber?: string;
  lat?: number;
  lng?: number;
}

class ZEHCompanyDataEnricher {
  private corporateNumberService: CorporateNumberService;
  private gbizService: GBizINFOService;
  private stats = {
    total: 0,
    withMainOffice: 0,
    withBranches: 0,
    errors: 0
  };

  constructor() {
    this.corporateNumberService = new CorporateNumberService();
    const apiToken = process.env.GBIZINFO_API_TOKEN;
    if (!apiToken) throw new Error('GBIZINFO_API_TOKEN is required');
    this.gbizService = new GBizINFOService(apiToken);
  }

  async enrichAll() {
    console.log('=== ZEHビルダー本社・支店情報取得開始 ===\n');
    const startTime = Date.now();

    try {
      // ZEHビルダーを取得
      const companies = await prisma.company.findMany({
        where: {
          gBizData: {
            path: ['source'],
            equals: 'ZEH_BUILDER'
          }
        },
        include: {
          serviceAreas: true
        }
      });

      console.log(`対象企業数: ${companies.length}社\n`);
      this.stats.total = companies.length;

      // バッチ処理
      const batchSize = 5; // API制限を考慮
      for (let i = 0; i < companies.length; i += batchSize) {
        const batch = companies.slice(i, i + batchSize);
        await Promise.all(batch.map(company => this.enrichCompanyData(company)));
        
        // 進捗表示
        const progress = Math.min(i + batchSize, companies.length);
        console.log(`\n進捗: ${progress}/${companies.length} (${Math.round(progress / companies.length * 100)}%)`);
        console.log(`本社情報取得: ${this.stats.withMainOffice}社, 支店情報あり: ${this.stats.withBranches}社`);
        
        // API制限対策
        if (i + batchSize < companies.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      const endTime = Date.now();
      this.printSummary(endTime - startTime);

    } catch (error) {
      console.error('エラー:', error);
    }
  }

  private async enrichCompanyData(company: any) {
    try {
      let corporateNumber = company.corporateNumber;
      let branches: BranchInfo[] = [];

      // Step 1: 法人番号を取得（必要な場合）
      if (corporateNumber.startsWith('ZEH_')) {
        const searchResults = await this.corporateNumberService.searchByName(
          company.name,
          company.serviceAreas[0]?.prefecture || ''
        );

        if (searchResults.length > 0) {
          corporateNumber = searchResults[0].corporateNumber;
        } else {
          console.log(`✗ 法人番号見つからず: ${company.name}`);
          return;
        }
      }

      // Step 2: 法人番号APIから本社情報を取得
      const corpDetail = await this.corporateNumberService.getDetail(corporateNumber);
      if (!corpDetail) {
        console.log(`✗ 詳細情報取得失敗: ${company.name}`);
        return;
      }

      // 本社情報を追加
      branches.push({
        name: '本社',
        type: '本社',
        prefecture: corpDetail.prefecture,
        city: corpDetail.city,
        street: corpDetail.street,
        phoneNumber: company.gBizData?.zehRegistration?.phoneNumber,
        lat: corpDetail.lat,
        lng: corpDetail.lng
      });

      this.stats.withMainOffice++;

      // Step 3: gBizINFOから追加情報を取得（可能な場合）
      try {
        const gbizInfo = await this.gbizService.getCorporation(corporateNumber);
        
        // 事業所情報があれば追加
        if (gbizInfo && gbizInfo.establishments && Array.isArray(gbizInfo.establishments)) {
          for (const est of gbizInfo.establishments) {
            if (est.location && est.location !== corpDetail.prefecture + corpDetail.city) {
              branches.push({
                name: est.name || '支店',
                type: '支店',
                prefecture: est.prefecture || '',
                city: est.city || '',
                street: est.street || '',
                phoneNumber: est.phone || undefined
              });
            }
          }
        }
      } catch (gbizError) {
        // gBizINFOエラーは無視（全企業にデータがあるわけではない）
      }

      // Step 4: 対応可能エリアから営業エリアを推定
      const targetAreas = company.gBizData?.zehRegistration?.targetAreas || [];
      const phoneNumber = company.gBizData?.zehRegistration?.phoneNumber || '';
      
      // 電話番号から推定される拠点とは別の都道府県も営業エリアとして記録
      for (const area of targetAreas) {
        if (area !== corpDetail.prefecture) {
          // 主要都市に仮想的な営業エリアを設定
          const majorCity = this.getMajorCity(area);
          if (majorCity) {
            branches.push({
              name: `${area}営業エリア`,
              type: '営業所',
              prefecture: area,
              city: majorCity.city,
              lat: majorCity.lat,
              lng: majorCity.lng
            });
          }
        }
      }

      if (branches.length > 1) {
        this.stats.withBranches++;
      }

      // Step 5: データベースを更新
      const updatedGBizData = {
        ...company.gBizData,
        corporateInfo: {
          corporateNumber: corporateNumber,
          name: corpDetail.name,
          updateDate: new Date().toISOString()
        },
        locations: branches.map(branch => ({
          ...branch,
          source: branch.type === '本社' ? '法人番号API' : 
                  branch.type === '支店' ? 'gBizINFO' : '推定'
        }))
      };

      await prisma.company.update({
        where: { id: company.id },
        data: {
          corporateNumber: corporateNumber,
          gBizData: updatedGBizData,
          gBizLastUpdated: new Date()
        }
      });

      // 支店情報をBranchOfficeテーブルに保存（テーブルがある場合）
      // for (const branch of branches) {
      //   await prisma.branchOffice.create({
      //     data: {
      //       companyId: company.id,
      //       ...branch
      //     }
      //   });
      // }

      console.log(`✓ 更新完了: ${company.name} (本社+${branches.length - 1}拠点)`);

    } catch (error) {
      console.error(`エラー: ${company.name}`, error);
      this.stats.errors++;
    }
  }

  // 都道府県の主要都市を返す
  private getMajorCity(prefecture: string): { city: string; lat: number; lng: number } | null {
    const majorCities: Record<string, { city: string; lat: number; lng: number }> = {
      '北海道': { city: '札幌市', lat: 43.0642, lng: 141.3469 },
      '青森県': { city: '青森市', lat: 40.8246, lng: 140.7406 },
      '岩手県': { city: '盛岡市', lat: 39.7036, lng: 141.1527 },
      '宮城県': { city: '仙台市', lat: 38.2682, lng: 140.8694 },
      '秋田県': { city: '秋田市', lat: 39.7186, lng: 140.1024 },
      '山形県': { city: '山形市', lat: 38.2405, lng: 140.3634 },
      '福島県': { city: '福島市', lat: 37.7503, lng: 140.4676 },
      '茨城県': { city: '水戸市', lat: 36.3665, lng: 140.4713 },
      '栃木県': { city: '宇都宮市', lat: 36.5657, lng: 139.8836 },
      '群馬県': { city: '前橋市', lat: 36.3906, lng: 139.0604 },
      '埼玉県': { city: 'さいたま市', lat: 35.8570, lng: 139.6489 },
      '千葉県': { city: '千葉市', lat: 35.6074, lng: 140.1063 },
      '東京都': { city: '新宿区', lat: 35.6896, lng: 139.6922 },
      '神奈川県': { city: '横浜市', lat: 35.4478, lng: 139.6425 },
      // ... 他の都道府県も追加
    };
    
    return majorCities[prefecture] || null;
  }

  private printSummary(elapsedTime: number) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 データ収集結果:');
    console.log(`  - 総企業数: ${this.stats.total}`);
    console.log(`  - 本社情報取得: ${this.stats.withMainOffice}`);
    console.log(`  - 支店情報あり: ${this.stats.withBranches}`);
    console.log(`  - エラー: ${this.stats.errors}`);
    console.log(`  - 処理時間: ${Math.round(elapsedTime / 1000)}秒`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

// 実行
async function main() {
  const enricher = new ZEHCompanyDataEnricher();
  await enricher.enrichAll();
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });