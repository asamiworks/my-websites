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

  // 法人番号APIも試す（申請不要）
  console.log('\n2️⃣ 法人番号API（国税庁）のテスト - 申請不要');
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
      });
    }
  } catch (error: any) {
    console.error('❌ エラー:', error.message);
  }
}

testSimpleRequest();
