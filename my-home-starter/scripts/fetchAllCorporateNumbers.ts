// scripts/fetchAllCorporateNumbers.ts
// 全国の住宅会社の法人番号と住所を取得するスクリプト

import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

// 国税庁法人番号API（無料・申請不要）
const HOUJIN_BANGOU_API = 'https://api.houjin-bangou.nta.go.jp/4/name';
const HOUJIN_BANGOU_NUM_API = 'https://api.houjin-bangou.nta.go.jp/4/num';

// 処理設定
const BATCH_SIZE = 50; // 一度に処理する会社数
const WAIT_TIME = 2000; // 各バッチ間の待機時間（ミリ秒）
const API_WAIT = 500; // 各API呼び出し間の待機時間（ミリ秒）

interface HoujinBangouResponse {
  corporateNumber: string;
  name: string;
  furigana?: string;
  kind: string;
  prefectureName?: string;
  cityName?: string;
  streetNumber?: string;
  addressImageId?: string;
  prefectureCode?: string;
  cityCode?: string;
  postCode?: string;
  addressOutside?: string;
  addressOutsideImageId?: string;
  closeDate?: string;
  closeCause?: string;
  successorCorporateNumber?: string;
  changeCause?: string;
  assignmentDate: string;
  updateDate: string;
  changeDate?: string;
}

// 進捗ファイルのパス
const PROGRESS_FILE = path.join(process.cwd(), 'scripts', 'corporate_number_progress.json');

// 進捗の読み込み
async function loadProgress(): Promise<Set<string>> {
  try {
    const data = await fs.readFile(PROGRESS_FILE, 'utf-8');
    return new Set(JSON.parse(data).processed);
  } catch {
    return new Set();
  }
}

// 進捗の保存
async function saveProgress(processed: Set<string>) {
  await fs.writeFile(
    PROGRESS_FILE,
    JSON.stringify({ processed: Array.from(processed), updatedAt: new Date() }, null, 2)
  );
}

// 会社名から法人番号を検索
async function searchCorporateNumber(companyName: string): Promise<{
  corporateNumber: string;
  address: string | null;
  prefecture: string | null;
  city: string | null;
  postCode: string | null;
} | null> {
  try {
    // 会社名の正規化
    const normalizedName = companyName
      .replace(/[\s　]+/g, '') // スペースを削除
      .replace(/株式会社|㈱/g, '株式会社')
      .replace(/有限会社|㈲/g, '有限会社')
      .replace(/合同会社/g, '合同会社');
    
    // まず完全一致で検索
    let response = await axios.get(HOUJIN_BANGOU_API, {
      params: {
        name: normalizedName,
        type: '01', // 完全一致
        mode: '2'
      }
    });
    
    // 完全一致がない場合は前方一致で検索
    if (!response.data || response.data.length === 0) {
      response = await axios.get(HOUJIN_BANGOU_API, {
        params: {
          name: normalizedName,
          type: '12', // 前方一致
          mode: '2'
        }
      });
    }
    
    if (response.data && response.data.length > 0) {
      // 最も近い名前の会社を選択
      const exactMatch = response.data.find((corp: HoujinBangouResponse) => 
        corp.name.replace(/[\s　]+/g, '') === normalizedName
      );
      
      const company = exactMatch || response.data[0];
      
      // 住所を組み立て
      const address = [
        company.prefectureName,
        company.cityName,
        company.streetNumber
      ].filter(Boolean).join('');
      
      return {
        corporateNumber: company.corporateNumber,
        address: address || null,
        prefecture: company.prefectureName || null,
        city: company.cityName || null,
        postCode: company.postCode || null
      };
    }
    
    // それでも見つからない場合は部分一致で検索
    response = await axios.get(HOUJIN_BANGOU_API, {
      params: {
        name: normalizedName.substring(0, Math.min(normalizedName.length, 10)),
        type: '12', // 前方一致
        mode: '2'
      }
    });
    
    if (response.data && response.data.length > 0) {
      const company = response.data[0];
      const address = [
        company.prefectureName,
        company.cityName,
        company.streetNumber
      ].filter(Boolean).join('');
      
      return {
        corporateNumber: company.corporateNumber,
        address: address || null,
        prefecture: company.prefectureName || null,
        city: company.cityName || null,
        postCode: company.postCode || null
      };
    }
    
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API エラー (${companyName}):`, error.response?.status);
    } else {
      console.error(`エラー (${companyName}):`, error);
    }
    return null;
  }
}

// 統計情報の収集
interface Statistics {
  total: number;
  processed: number;
  found: number;
  notFound: number;
  errors: number;
  startTime: Date;
  byPrefecture: { [key: string]: { processed: number; found: number } };
}

// メイン処理
async function updateAllCorporateNumbers() {
  console.log('🏢 全国の住宅会社の法人番号取得を開始します...\n');
  
  const stats: Statistics = {
    total: 0,
    processed: 0,
    found: 0,
    notFound: 0,
    errors: 0,
    startTime: new Date(),
    byPrefecture: {}
  };
  
  try {
    // 進捗の読み込み
    const processedIds = await loadProgress();
    console.log(`📊 処理済み: ${processedIds.size}社\n`);
    
    // 仮の法人番号を持つ会社を取得
    const companies = await prisma.company.findMany({
      where: {
        corporateNumber: { startsWith: 'ZEH_' },
        id: { notIn: Array.from(processedIds) }
      },
      include: {
        serviceAreas: {
          take: 1
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    stats.total = companies.length;
    console.log(`🎯 処理対象: ${companies.length}社\n`);
    
    // バッチ処理
    for (let i = 0; i < companies.length; i += BATCH_SIZE) {
      const batch = companies.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(companies.length / BATCH_SIZE);
      
      console.log(`\n📦 バッチ ${batchNum}/${totalBatches} を処理中...`);
      console.log('━'.repeat(50));
      
      for (const company of batch) {
        const prefecture = company.serviceAreas[0]?.prefecture || '不明';
        
        // 都道府県別統計の初期化
        if (!stats.byPrefecture[prefecture]) {
          stats.byPrefecture[prefecture] = { processed: 0, found: 0 };
        }
        
        try {
          // 法人番号と住所を検索
          const result = await searchCorporateNumber(company.name);
          
          if (result) {
            // データベースを更新
            await prisma.company.update({
              where: { id: company.id },
              data: {
                corporateNumber: result.corporateNumber,
                gBizData: {
                  ...(typeof company.gBizData === 'object' ? company.gBizData : {}),
                  address: result.address,
                  prefecture: result.prefecture,
                  city: result.city,
                  postCode: result.postCode,
                  corporateNumber: result.corporateNumber,
                  source: 'houjin-bangou-api',
                  lastUpdated: new Date().toISOString()
                },
                gBizLastUpdated: new Date()
              }
            });
            
            console.log(`✅ ${company.name}`);
            console.log(`   法人番号: ${result.corporateNumber}`);
            console.log(`   住所: ${result.address || '(住所なし)'}`);
            
            stats.found++;
            stats.byPrefecture[prefecture].found++;
          } else {
            console.log(`❌ ${company.name} - 法人番号が見つかりません`);
            stats.notFound++;
          }
          
          stats.processed++;
          stats.byPrefecture[prefecture].processed++;
          processedIds.add(company.id);
          
          // API制限対策
          await new Promise(resolve => setTimeout(resolve, API_WAIT));
          
        } catch (error) {
          console.error(`⚠️  ${company.name} - エラー:`, error);
          stats.errors++;
          stats.processed++;
          stats.byPrefecture[prefecture].processed++;
        }
      }
      
      // 進捗を保存
      await saveProgress(processedIds);
      
      // 統計情報を表示
      const elapsed = (new Date().getTime() - stats.startTime.getTime()) / 1000 / 60;
      const rate = stats.processed / elapsed;
      const remaining = (stats.total - stats.processed) / rate;
      
      console.log('\n📊 進捗状況:');
      console.log(`   処理済み: ${stats.processed}/${stats.total} (${(stats.processed/stats.total*100).toFixed(1)}%)`);
      console.log(`   成功: ${stats.found} | 失敗: ${stats.notFound} | エラー: ${stats.errors}`);
      console.log(`   処理速度: ${rate.toFixed(1)}社/分`);
      console.log(`   推定残り時間: ${remaining.toFixed(0)}分`);
      
      // バッチ間で待機
      if (i + BATCH_SIZE < companies.length) {
        console.log(`\n⏳ 次のバッチまで${WAIT_TIME/1000}秒待機...`);
        await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
      }
    }
    
    // 最終統計
    console.log('\n' + '='.repeat(60));
    console.log('🎉 処理完了！');
    console.log('='.repeat(60));
    console.log(`\n📊 最終統計:`);
    console.log(`   総数: ${stats.total}社`);
    console.log(`   成功: ${stats.found}社 (${(stats.found/stats.total*100).toFixed(1)}%)`);
    console.log(`   失敗: ${stats.notFound}社`);
    console.log(`   エラー: ${stats.errors}社`);
    console.log(`   処理時間: ${((new Date().getTime() - stats.startTime.getTime()) / 1000 / 60).toFixed(1)}分`);
    
    console.log('\n📍 都道府県別統計:');
    Object.entries(stats.byPrefecture)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([pref, data]) => {
        console.log(`   ${pref}: ${data.found}/${data.processed}社 (${(data.found/data.processed*100).toFixed(1)}%)`);
      });
    
    // 座標設定の推奨
    console.log('\n💡 次のステップ:');
    console.log('   住所が取得できた会社に座標を設定するには:');
    console.log('   npx tsx scripts/setCompanyLocationsByPrefecture.ts --all');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 統計情報のみ表示
async function showStatistics() {
  const tempCount = await prisma.company.count({
    where: { corporateNumber: { startsWith: 'ZEH_' } }
  });
  
  const realCount = await prisma.company.count({
    where: { NOT: { corporateNumber: { startsWith: 'ZEH_' } } }
  });
  
  const withAddress = await prisma.company.count({
    where: {
      gBizData: { path: ['address'], not: null }
    }
  });
  
  console.log('📊 現在の状況:');
  console.log(`   仮の法人番号: ${tempCount}社`);
  console.log(`   実際の法人番号: ${realCount}社`);
  console.log(`   住所あり: ${withAddress}社`);
}

// 実行
const args = process.argv.slice(2);

if (args.includes('--stats')) {
  showStatistics().then(() => prisma.$disconnect());
} else if (args.includes('--reset')) {
  // 進捗をリセット
  fs.unlink(PROGRESS_FILE).catch(() => {});
  console.log('進捗をリセットしました');
} else {
  updateAllCorporateNumbers();
}
