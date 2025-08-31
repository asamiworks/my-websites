// scripts/testImportIbarakiZEH.ts

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface ZEHBuilderRecord {
  '登録名称（屋号）': string;
  '電話番号': string;
  'ホームページ': string;
  '対応可能エリア': string;
  'ZEHビルダー/プランナーZEH普及対象': string;
  'ZEH普及実績[2020年度]（新築戸建住宅）': string;
  'ZEH普及実績[2021年度]（新築戸建住宅）': string;
  'ZEH普及実績[2022年度]（新築戸建住宅）': string;
  'ZEH普及実績[2023年度]（新築戸建住宅）': string;
  'ZEH普及実績[2024年度]（新築戸建住宅）': string;
  [key: string]: string;
}

async function testImportIbaraki() {
  console.log('=== 茨城県ZEHビルダーデータ テストインポート ===\n');
  
  const filepath = path.join(process.cwd(), 'data', 'zeh', '08_ibaraki.csv');
  
  try {
    // CSVファイルを読み込み
    const csvContent = await fs.readFile(filepath, 'utf-8');
    const records: ZEHBuilderRecord[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      relax_quotes: true,
      relax_column_count: true
    });

    console.log(`総レコード数: ${records.length}\n`);
    
    let newCount = 0;
    let updateCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // 各レコードを処理
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const companyName = record['登録名称（屋号）'];
      
      if (!companyName || companyName.trim() === '') {
        skipCount++;
        continue;
      }

      try {
        // 既存の会社を検索
        const existingCompany = await prisma.company.findFirst({
          where: { name: companyName.trim() }
        });

        // ZEH実績データを解析
        const zehPerformance = [];
        const years = ['2020', '2021', '2022', '2023', '2024'];
        
        for (const year of years) {
          const value = record[`ZEH普及実績[${year}年度]（新築戸建住宅）`];
          if (value && value !== '-' && value !== '－' && value !== '') {
            const percentage = parseFloat(value);
            if (!isNaN(percentage)) {
              zehPerformance.push({ year: parseInt(year), percentage });
            }
          }
        }

        // 対応可能エリアを解析
        const targetAreas = record['対応可能エリア']
          ? record['対応可能エリア'].split(';').map(area => area.trim())
          : ['茨城県'];

        // 会社データを準備
        const companyData = {
          corporateNumber: existingCompany?.corporateNumber || `ZEH_IBARAKI_${Date.now()}_${i}`,
          name: companyName.trim(),
          website: record['ホームページ'] && record['ホームページ'] !== '-' 
            ? (record['ホームページ'].startsWith('http') ? record['ホームページ'] : `https://${record['ホームページ']}`)
            : undefined,
          isVerified: true,
          gBizData: {
            source: 'ZEH_BUILDER',
            importDate: new Date().toISOString(),
            zehRegistration: {
              businessTypes: record['ZEHビルダー/プランナーZEH普及対象'] 
                ? record['ZEHビルダー/プランナーZEH普及対象'].split(',').map(t => t.trim())
                : ['新築注文戸建住宅'],
              performance: zehPerformance,
              targetAreas: targetAreas,
              phoneNumber: record['電話番号'],
              lastUpdated: new Date().toISOString()
            }
          }
        };

        if (existingCompany) {
          // 既存会社を更新
          await prisma.company.update({
            where: { id: existingCompany.id },
            data: {
              website: companyData.website || existingCompany.website,
              isVerified: true,
              gBizData: {
                ...(existingCompany.gBizData as any || {}),
                zehRegistration: companyData.gBizData.zehRegistration
              },
              gBizLastUpdated: new Date()
            }
          });
          updateCount++;
          console.log(`✓ 更新: ${companyName}`);
        } else {
          // 新規会社を作成
          const newCompany = await prisma.company.create({
            data: companyData
          });
          
          // サービスエリアを登録
          await prisma.serviceArea.create({
            data: {
              companyId: newCompany.id,
              prefecture: '茨城県',
              coverage: 'FULL',
              remarks: 'ZEHビルダー登録'
            }
          });
          
          newCount++;
          console.log(`✓ 新規: ${companyName}`);
        }

      } catch (error) {
        errorCount++;
        console.error(`✗ エラー: ${companyName} - ${error}`);
      }
    }

    // サマリーを表示
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 インポート結果:');
    console.log(`  - 総レコード数: ${records.length}`);
    console.log(`  - 新規登録: ${newCount}社`);
    console.log(`  - 更新: ${updateCount}社`);
    console.log(`  - スキップ: ${skipCount}件`);
    console.log(`  - エラー: ${errorCount}件`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // 登録された会社の確認
    const totalCompanies = await prisma.company.count({
      where: {
        gBizData: {
          path: ['source'],
          equals: 'ZEH_BUILDER'
        }
      }
    });
    console.log(`\n✅ データベース内のZEHビルダー総数: ${totalCompanies}社`);

  } catch (error) {
    console.error('インポートエラー:', error);
  }
}

// 実行
testImportIbaraki()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });