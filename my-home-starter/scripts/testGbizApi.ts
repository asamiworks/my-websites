// scripts/testGbizApiSimple.ts
// 実行方法: npx tsx scripts/testGbizApiSimple.ts

import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const GBIZ_API_TOKEN = process.env.GBIZ_API_TOKEN;

async function testSimpleRequest() {
  if (!GBIZ_API_TOKEN) {
    console.error('❌ GBIZ_API_TOKEN が設定されていません');
    return;
  }

  console.log('🔍 gBizINFO API シンプルテスト\n');
  console.log('APIトークン: ', GBIZ_API_TOKEN.substring(0, 10) + '...');

  // テスト1: 最もシンプルなリクエスト
  console.log('\n1️⃣ 最小限のパラメータでテスト');
  try {
    const response = await axios.get('https://info.gbiz.go.jp/api/v1/corporations', {
      headers: {
        'X-API-TOKEN': GBIZ_API_TOKEN,
        'Accept': 'application/json'
      },
      params: {
        page: 1,
        per_page: 1
      }
    });
    console.log('✅ 成功！');
    console.log('レスポンス:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('❌ エラー:', error.response?.status, error.response?.data);
  }

  // テスト2: キーワード検索
  console.log('\n2️⃣ キーワード検索テスト');
  try {
    const response = await axios.get('https://info.gbiz.go.jp/api/v1/corporations', {
      headers: {
        'X-API-TOKEN': GBIZ_API_TOKEN,
        'Accept': 'application/json'
      },
      params: {
        keyword: 'ハウス',
        page: 1,
        per_page: 3
      }
    });
    console.log('✅ 成功！');
    console.log(`検索結果: ${response.data.total_count}件`);
    response.data.results?.forEach((corp: any) => {
      console.log(`- ${corp.name} (${corp.corporate_number})`);
    });
  } catch (error: any) {
    console.error('❌ エラー:', error.response?.status, error.response?.data);
  }

  // テスト3: 特定の法人番号で詳細取得
  console.log('\n3️⃣ 特定企業の詳細取得テスト（積水ハウス）');
  try {
    const response = await axios.get(
      'https://info.gbiz.go.jp/api/v1/corporation/8120001059652', // 積水ハウスの法人番号
      {
        headers: {
          'X-API-TOKEN': GBIZ_API_TOKEN,
          'Accept': 'application/json'
        }
      }
    );
    console.log('✅ 成功！');
    console.log('企業名:', response.data.name);
    console.log('所在地:', response.data.location);
    console.log('資本金:', response.data.capital_stock);
  } catch (error: any) {
    console.error('❌ エラー:', error.response?.status, error.response?.data);
  }

  // テスト4: APIの仕様確認
  console.log('\n4️⃣ 利用可能なパラメータの確認');
  console.log('📖 APIドキュメント: https://info.gbiz.go.jp/api/');
  console.log('\n利用可能なパラメータ:');
  console.log('- keyword: キーワード検索');
  console.log('- name: 法人名');
  console.log('- corporate_number: 法人番号');
  console.log('- prefecture: 都道府県');
  console.log('- city: 市区町村');
  console.log('- capital_stock_from/to: 資本金範囲');
  console.log('- employee_number_from/to: 従業員数範囲');
  console.log('- founded_from/to: 設立年範囲');
  
  // 法人番号APIも試す
  console.log('\n5️⃣ 法人番号API（国税庁）のテスト - 申請不要');
  try {
    const response = await axios.get(
      'https://api.houjin-bangou.nta.go.jp/4/name',
      {
        params: {
          name: '積水ハウス',
          type: '12',
          mode: '2'
        }
      }
    );
    console.log('✅ 法人番号API成功！');
    const results = response.data;
    if (results.length > 0) {
      results.slice(0, 3).forEach((corp: any) => {
        console.log(`- ${corp.name} (${corp.corporateNumber})`);
        console.log(`  ${corp.prefectureName}${corp.cityName}${corp.streetNumber || ''}`);
      });
    }
  } catch (error: any) {
    console.error('❌ エラー:', error.message);
  }
}

testSimpleRequest();