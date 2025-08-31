// scripts/testHoujinBangouAPI.ts
// 法人番号APIの動作確認

import axios from 'axios';

async function testAPI() {
  console.log('🔍 法人番号APIのテスト...\n');

  // テスト1: 直接XMLを取得（デフォルト）
  try {
    console.log('1. XMLレスポンスのテスト（積水ハウス）');
    const xmlResponse = await axios.get('https://api.houjin-bangou.nta.go.jp/4/name', {
      params: {
        name: '積水ハウス',
        type: '12', // 前方一致
        mode: '2'  // 登記記録の閉鎖等を含めない
      }
    });
    console.log('✅ ステータス:', xmlResponse.status);
    console.log('レスポンス:', xmlResponse.data.substring(0, 200) + '...');
  } catch (error: any) {
    console.error('❌ エラー:', error.response?.status, error.message);
  }

  // テスト2: 会社名のバリエーション
  const testNames = [
    '積水ハウス',
    '積水ハウス株式会社',
    '株式会社積水ハウス',
    'BESS',
    '株式会社森山工務店'
  ];

  for (const name of testNames) {
    try {
      console.log(`\n2. "${name}" を検索`);
      const response = await axios.get('https://api.houjin-bangou.nta.go.jp/4/name', {
        params: {
          name: name,
          type: '12',
          mode: '2'
        },
        headers: {
          'Accept': 'application/xml'
        }
      });
      
      // XMLをパース（簡易的な方法）
      const matches = response.data.match(/<count>(\d+)<\/count>/);
      const count = matches ? matches[1] : '0';
      console.log(`✅ 見つかった件数: ${count}`);
      
      if (parseInt(count) > 0) {
        const corpNumber = response.data.match(/<corporateNumber>(\d+)<\/corporateNumber>/)?.[1];
        const corpName = response.data.match(/<name>([^<]+)<\/name>/)?.[1];
        console.log(`   法人番号: ${corpNumber}`);
        console.log(`   正式名称: ${corpName}`);
      }
    } catch (error: any) {
      console.error(`❌ エラー: ${error.response?.status} ${error.message}`);
    }
  }

  // テスト3: 正しいエンドポイントの確認
  console.log('\n3. エンドポイントの確認');
  const endpoints = [
    'https://api.houjin-bangou.nta.go.jp/4/name',
    'https://api.houjin-bangou.nta.go.jp/4/num',
    'https://api.houjin-bangou.nta.go.jp/1/name', // 旧バージョン？
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.head(endpoint);
      console.log(`✅ ${endpoint} - ステータス: ${response.status}`);
    } catch (error: any) {
      console.log(`❌ ${endpoint} - エラー: ${error.response?.status || error.message}`);
    }
  }
}

// XMLパーサーを使わない簡易的な法人情報取得
async function searchCorporateNumberSimple(companyName: string) {
  try {
    const response = await axios.get('https://api.houjin-bangou.nta.go.jp/4/name', {
      params: {
        name: companyName,
        type: '12', // 前方一致
        mode: '2'
      }
    });
    
    const xmlData = response.data;
    
    // 簡易的なXMLパース
    const corporations = [];
    const corporationMatches = xmlData.matchAll(/<corporation>[\s\S]*?<\/corporation>/g);
    
    for (const match of corporationMatches) {
      const corpXml = match[0];
      const corporateNumber = corpXml.match(/<corporateNumber>(\d+)<\/corporateNumber>/)?.[1];
      const name = corpXml.match(/<name>([^<]+)<\/name>/)?.[1];
      const prefecture = corpXml.match(/<prefectureName>([^<]+)<\/prefectureName>/)?.[1];
      const city = corpXml.match(/<cityName>([^<]+)<\/cityName>/)?.[1];
      const streetNumber = corpXml.match(/<streetNumber>([^<]+)<\/streetNumber>/)?.[1];
      const postCode = corpXml.match(/<postCode>(\d+)<\/postCode>/)?.[1];
      
      if (corporateNumber) {
        corporations.push({
          corporateNumber,
          name,
          prefecture,
          city,
          streetNumber,
          postCode,
          address: [prefecture, city, streetNumber].filter(Boolean).join('')
        });
      }
    }
    
    return corporations;
  } catch (error) {
    console.error('検索エラー:', error);
    return [];
  }
}

// テスト実行
async function main() {
  await testAPI();
  
  console.log('\n\n4. 実際の検索テスト');
  const results = await searchCorporateNumberSimple('積水ハウス');
  console.log('検索結果:', results);
}

main();