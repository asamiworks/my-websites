// scripts/updateZEHAddressesGBiz.ts

import { PrismaClient } from '@prisma/client';
import { GBizINFOService } from '../src/services/gbizinfo.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env.localを読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

interface AddressInfo {
  prefecture: string;
  city: string;
  street?: string;
  lat?: number;
  lng?: number;
}

class ZEHAddressUpdater {
  private gbizService: GBizINFOService;
  private stats = {
    total: 0,
    updated: 0,
    skipped: 0,
    errors: 0
  };
  private startTime: number = 0;

  constructor() {
    const apiToken = process.env.GBIZ_API_TOKEN;
    if (!apiToken) {
      throw new Error('GBIZ_API_TOKEN is not set in .env.local');
    }
    this.gbizService = new GBizINFOService(apiToken);
  }

  async updateAll() {
    console.log('=== ZEHビルダー住所取得開始（gBizINFO API使用）===\n');
    this.startTime = Date.now();

    try {
      // ZEHビルダーで住所情報がないものを取得
      const companies = await prisma.company.findMany({
        where: {
          AND: [
            {
              gBizData: {
                path: ['source'],
                equals: 'ZEH_BUILDER'
              }
            },
            {
              NOT: {
                gBizData: {
                  path: ['address', 'prefecture'],
                  not: undefined
                }
              }
            }
          ]
        },
        select: {
          id: true,
          name: true,
          corporateNumber: true,
          gBizData: true
        }
      });

      console.log(`対象企業数: ${companies.length}社\n`);
      this.stats.total = companies.length;

      // バッチ処理
      const batchSize = 10; // API制限を考慮
      for (let i = 0; i < companies.length; i += batchSize) {
        const batch = companies.slice(i, i + batchSize);
        
        // 並列処理
        await Promise.all(
          batch.map(company => this.updateCompanyAddress(company))
        );
        
        // 進捗表示
        const progress = Math.min(i + batchSize, companies.length);
        const elapsed = (Date.now() - this.startTime) / 1000;
        const rate = progress / elapsed;
        const remaining = (companies.length - progress) / rate;
        
        console.log(`\n進捗: ${progress}/${companies.length} (${Math.round(progress / companies.length * 100)}%)`);
        console.log(`経過時間: ${Math.round(elapsed)}秒, 残り予想時間: ${Math.round(remaining)}秒`);
        console.log(`更新: ${this.stats.updated}, スキップ: ${this.stats.skipped}, エラー: ${this.stats.errors}`);
        
        // API制限対策（1秒待機）
        if (i + batchSize < companies.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      this.printSummary();

    } catch (error) {
      console.error('エラー:', error);
    }
  }

  private async updateCompanyAddress(company: any) {
    try {
      const companyName = company.name;
      
      // gBizINFOで検索
      const searchResult = await this.gbizService.searchCorporations({
        name: companyName,
        limit: '1'
      });

      if (!searchResult || !searchResult['hojin-infos'] || searchResult['hojin-infos'].length === 0) {
        console.log(`✗ 見つからず: ${companyName}`);
        this.stats.skipped++;
        return;
      }

      const corpInfo = searchResult['hojin-infos'][0];
      
      // 住所情報を抽出
      if (corpInfo.location) {
        // location文字列をパース（例: "東京都千代田区丸の内１－１－１"）
        const addressMatch = corpInfo.location.match(/^(.+?[都道府県])(.+?[市区町村村])(.*)$/);
        
        if (addressMatch) {
          const addressInfo: AddressInfo = {
            prefecture: addressMatch[1],
            city: addressMatch[2],
            street: addressMatch[3] || undefined
          };

          // gBizDataを更新
          const updatedGBizData = {
            ...company.gBizData,
            address: addressInfo,
            corporateNumber: corpInfo.corporate_number || company.corporateNumber
          };

          await prisma.company.update({
            where: { id: company.id },
            data: {
              corporateNumber: corpInfo.corporate_number || company.corporateNumber,
              gBizData: updatedGBizData,
              gBizLastUpdated: new Date()
            }
          });

          console.log(`✓ 更新: ${companyName} - ${addressInfo.prefecture}${addressInfo.city}`);
          this.stats.updated++;
        } else {
          console.log(`✗ 住所パース失敗: ${companyName} - ${corpInfo.location}`);
          this.stats.skipped++;
        }
      } else {
        console.log(`✗ 住所情報なし: ${companyName}`);
        this.stats.skipped++;
      }

    } catch (error) {
      console.error(`エラー: ${company.name}`, error);
      this.stats.errors++;
    }
  }

  private printSummary() {
    const totalTime = (Date.now() - this.startTime) / 1000;
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 住所取得完了:');
    console.log(`  - 総企業数: ${this.stats.total}`);
    console.log(`  - 更新成功: ${this.stats.updated} (${Math.round(this.stats.updated / this.stats.total * 100)}%)`);
    console.log(`  - スキップ: ${this.stats.skipped}`);
    console.log(`  - エラー: ${this.stats.errors}`);
    console.log(`  - 総処理時間: ${Math.round(totalTime)}秒 (${Math.round(totalTime / 60)}分)`);
    console.log(`  - 平均処理速度: ${Math.round(this.stats.total / totalTime * 60)}社/分`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

// 実行
async function main() {
  const updater = new ZEHAddressUpdater();
  await updater.updateAll();
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });