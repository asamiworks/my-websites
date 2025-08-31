// scripts/testZEHAddressesGBiz.ts

import { PrismaClient } from '@prisma/client';
import { GBizINFOService } from '../src/services/gbizinfo.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env.localを読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function testGBizAPI() {
  console.log('=== gBizINFO API テスト（最初の10社）===\n');
  
  const apiToken = process.env.GBIZ_API_TOKEN;
  if (!apiToken) {
    throw new Error('GBIZ_API_TOKEN is not set in .env.local');
  }
  
  console.log('APIトークン: 設定済み');
  const gbizService = new GBizINFOService(apiToken);

  try {
    // ZEHビルダーを10社取得（住所情報の有無に関わらず）
    const companies = await prisma.company.findMany({
      where: {
        gBizData: {
          path: ['source'],
          equals: 'ZEH_BUILDER'
        }
      },
      select: {
        id: true,
        name: true,
        corporateNumber: true,
        gBizData: true
      },
      take: 10 // テスト用に10社のみ
    });

    console.log(`テスト対象: ${companies.length}社\n`);

    // 住所情報がない企業をフィルタリング
    const companiesWithoutAddress = companies.filter(company => {
      const address = company.gBizData?.address;
      return !address || !address.prefecture;
    });

    console.log(`住所情報なし: ${companiesWithoutAddress.length}社\n`);

    // 1社ずつ処理
    for (let i = 0; i < companiesWithoutAddress.length; i++) {
      const company = companiesWithoutAddress[i];
      console.log(`\n${i + 1}. ${company.name}`);
      
      try {
        // gBizINFOで検索
        const searchResult = await gbizService.searchCorporations({
          name: company.name,
          limit: '1'
        });

        if (searchResult && searchResult['hojin-infos'] && searchResult['hojin-infos'].length > 0) {
          const corpInfo = searchResult['hojin-infos'][0];
          console.log(`  ✓ 見つかりました`);
          console.log(`  法人番号: ${corpInfo.corporate_number}`);
          console.log(`  住所: ${corpInfo.location || '住所情報なし'}`);
        } else {
          console.log(`  ✗ 見つかりませんでした`);
        }
      } catch (error) {
        console.log(`  ✗ エラー: ${error}`);
      }

      // API制限対策（1秒待機）
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

  } catch (error) {
    console.error('エラー:', error);
  }
}

// 実行
testGBizAPI()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
