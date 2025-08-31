// scripts/updateZEHAddressesWithRetry.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

// API設定
const GBIZ_API_KEY = process.env.GBIZ_API_KEY || 'your-api-key-here';
const GBIZ_BASE_URL = 'https://info.gbiz.go.jp/hojin/v1/hojin';
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2秒
const BATCH_SIZE = 10; // 一度に処理する会社数
const BATCH_DELAY = 5000; // バッチ間の遅延（5秒）

interface GBizResponse {
  'hojin-infos': Array<{
    corporate_number: string;
    name: string;
    location?: string;
    prefecture_name?: string;
    city_name?: string;
    street_number?: string;
    post_code?: string;
  }>;
}

interface CompanyAddress {
  corporateNumber: string;
  name: string;
  address: string | null;
  prefecture: string | null;
  city: string | null;
  postCode: string | null;
}

// リトライ機能付きAPI呼び出し
async function fetchWithRetry(url: string, options: RequestInit, retries = RETRY_ATTEMPTS): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`API呼び出し試行 ${i + 1}/${retries}: ${url}`);
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 429) {
        // レート制限の場合は長めに待機
        const waitTime = (i + 1) * 10000; // 10秒、20秒、30秒と増加
        console.log(`レート制限検出。${waitTime / 1000}秒待機します...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (response.status >= 500) {
        // サーバーエラーの場合はリトライ
        console.log(`サーバーエラー (${response.status})。${RETRY_DELAY / 1000}秒後にリトライします...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        continue;
      }
      
      // その他のエラーは即座に失敗
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
      
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`エラー発生: ${error}. ${RETRY_DELAY / 1000}秒後にリトライします...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  
  throw new Error('最大リトライ回数に達しました');
}

// 会社名から住所を取得
async function getAddressFromGBizAPI(companyName: string): Promise<CompanyAddress | null> {
  try {
    // 会社名で検索
    const searchUrl = `${GBIZ_BASE_URL}?name=${encodeURIComponent(companyName)}&type=01&mode=2`;
    
    const response = await fetchWithRetry(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'X-hojinInfo-api-token': GBIZ_API_KEY
      }
    });
    
    const data: GBizResponse = await response.json();
    
    if (data['hojin-infos'] && data['hojin-infos'].length > 0) {
      const company = data['hojin-infos'][0];
      
      // 住所を組み立て
      const addressParts = [
        company.prefecture_name,
        company.city_name,
        company.street_number
      ].filter(Boolean);
      
      const fullAddress = addressParts.join('') || company.location || null;
      
      return {
        corporateNumber: company.corporate_number,
        name: company.name,
        address: fullAddress,
        prefecture: company.prefecture_name || null,
        city: company.city_name || null,
        postCode: company.post_code || null
      };
    }
    
    return null;
  } catch (error) {
    console.error(`gBizINFO API エラー (${companyName}):`, error);
    return null;
  }
}

// 法人番号から住所を取得（より正確）
async function getAddressByCorporateNumber(corporateNumber: string): Promise<CompanyAddress | null> {
  try {
    const url = `${GBIZ_BASE_URL}/${corporateNumber}`;
    
    const response = await fetchWithRetry(url, {
      headers: {
        'Accept': 'application/json',
        'X-hojinInfo-api-token': GBIZ_API_KEY
      }
    });
    
    const data = await response.json();
    
    if (data['hojin-infos'] && data['hojin-infos'].length > 0) {
      const company = data['hojin-infos'][0];
      
      const addressParts = [
        company.prefecture_name,
        company.city_name,
        company.street_number
      ].filter(Boolean);
      
      const fullAddress = addressParts.join('') || company.location || null;
      
      return {
        corporateNumber: company.corporate_number,
        name: company.name,
        address: fullAddress,
        prefecture: company.prefecture_name || null,
        city: company.city_name || null,
        postCode: company.post_code || null
      };
    }
    
    return null;
  } catch (error) {
    console.error(`gBizINFO API エラー (法人番号: ${corporateNumber}):`, error);
    return null;
  }
}

// バッチ処理で住所を更新
async function updateCompanyAddresses() {
  console.log('住所更新処理を開始します...');
  
  try {
    // 住所がない会社を取得
    const companiesWithoutAddress = await prisma.company.findMany({
      where: {
        OR: [
          { gBizData: { equals: null } },
          { gBizData: { path: ['address'], equals: null } }
        ]
      },
      select: {
        id: true,
        name: true,
        corporateNumber: true
      }
    });
    
    console.log(`住所がない会社数: ${companiesWithoutAddress.length}`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // バッチ処理
    for (let i = 0; i < companiesWithoutAddress.length; i += BATCH_SIZE) {
      const batch = companiesWithoutAddress.slice(i, i + BATCH_SIZE);
      console.log(`\nバッチ ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(companiesWithoutAddress.length / BATCH_SIZE)} を処理中...`);
      
      const promises = batch.map(async (company) => {
        try {
          // まず法人番号で検索
          let addressInfo = await getAddressByCorporateNumber(company.corporateNumber);
          
          // 法人番号で見つからない場合は会社名で検索
          if (!addressInfo) {
            console.log(`法人番号 ${company.corporateNumber} で見つからないため、会社名で検索: ${company.name}`);
            addressInfo = await getAddressFromGBizAPI(company.name);
          }
          
          if (addressInfo) {
            // データベースを更新
            await prisma.company.update({
              where: { id: company.id },
              data: {
                gBizData: {
                  address: addressInfo.address,
                  prefecture: addressInfo.prefecture,
                  city: addressInfo.city,
                  postCode: addressInfo.postCode,
                  lastUpdated: new Date().toISOString()
                },
                gBizLastUpdated: new Date()
              }
            });
            
            console.log(`✓ ${company.name}: ${addressInfo.address || '住所なし'}`);
            successCount++;
          } else {
            console.log(`✗ ${company.name}: 住所情報が見つかりません`);
            errorCount++;
          }
        } catch (error) {
          console.error(`エラー (${company.name}):`, error);
          errorCount++;
        }
      });
      
      await Promise.all(promises);
      
      // バッチ間で待機（APIレート制限対策）
      if (i + BATCH_SIZE < companiesWithoutAddress.length) {
        console.log(`次のバッチまで${BATCH_DELAY / 1000}秒待機...`);
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
    }
    
    console.log('\n=== 処理完了 ===');
    console.log(`成功: ${successCount}件`);
    console.log(`失敗: ${errorCount}件`);
    console.log(`成功率: ${((successCount / companiesWithoutAddress.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('処理中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 茨城県の会社のみ住所を更新
async function updateIbarakiCompanyAddresses() {
  console.log('茨城県の会社の住所更新を開始します...');
  
  try {
    // 茨城県の会社で住所がないものを取得
    const ibarakiCompanies = await prisma.company.findMany({
      where: {
        serviceAreas: {
          some: {
            prefecture: '茨城県'
          }
        },
        OR: [
          { gBizData: { equals: null } },
          { gBizData: { path: ['address'], equals: null } }
        ]
      },
      select: {
        id: true,
        name: true,
        corporateNumber: true
      }
    });
    
    console.log(`茨城県で住所がない会社数: ${ibarakiCompanies.length}`);
    
    // 通常の更新処理と同じロジック
    let successCount = 0;
    let errorCount = 0;
    
    for (const company of ibarakiCompanies) {
      try {
        let addressInfo = await getAddressByCorporateNumber(company.corporateNumber);
        
        if (!addressInfo) {
          addressInfo = await getAddressFromGBizAPI(company.name);
        }
        
        if (addressInfo) {
          await prisma.company.update({
            where: { id: company.id },
            data: {
              gBizData: {
                address: addressInfo.address,
                prefecture: addressInfo.prefecture,
                city: addressInfo.city,
                postCode: addressInfo.postCode,
                lastUpdated: new Date().toISOString()
              },
              gBizLastUpdated: new Date()
            }
          });
          
          console.log(`✓ ${company.name}: ${addressInfo.address}`);
          successCount++;
        } else {
          console.log(`✗ ${company.name}: 住所情報が見つかりません`);
          errorCount++;
        }
        
        // 各リクエスト間で少し待機
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`エラー (${company.name}):`, error);
        errorCount++;
      }
    }
    
    console.log('\n=== 茨城県の処理完了 ===');
    console.log(`成功: ${successCount}件`);
    console.log(`失敗: ${errorCount}件`);
    
  } catch (error) {
    console.error('処理中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// メイン処理
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--ibaraki')) {
    await updateIbarakiCompanyAddresses();
  } else {
    await updateCompanyAddresses();
  }
}

// 実行
main().catch((error) => {
  console.error('エラー:', error);
  process.exit(1);
});