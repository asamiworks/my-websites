// scripts/testApiEndpoints.ts
import axios from 'axios';

async function testEndpoints() {
  console.log('🔍 各種APIエンドポイントのテスト\n');

  // 法人番号APIの可能性のあるエンドポイント
  const endpoints = [
    'https://api.houjin-bangou.nta.go.jp/4/name',
    'https://api.houjin-bangou.nta.go.jp/1/name',
    'https://api.houjin-bangou.nta.go.jp/name',
    'https://www.houjin-bangou.nta.go.jp/webapi/name',
  ];

  console.log('📍 法人番号APIのエンドポイントテスト');
  for (const endpoint of endpoints) {
    try {
      console.log(`\nテスト: ${endpoint}`);
      const response = await axios.get(endpoint, {
        params: { name: 'test' },
        timeout: 5000
      });
      console.log('✅ アクセス可能');
    } catch (error: any) {
      console.log(`❌ ${error.response?.status || error.code}`);
    }
  }

  // ブラウザでアクセスする方法を案内
  console.log('\n📖 法人番号APIの正しい使い方');
  console.log('1. 公式サイト: https://www.houjin-bangou.nta.go.jp/');
  console.log('2. Web API仕様: https://www.houjin-bangou.nta.go.jp/webapi/');
  
  // 代替案：スクレイピングは規約違反なので、CSVダウンロードを提案
  console.log('\n💡 代替案：法人番号データのCSVダウンロード');
  console.log('国税庁は全法人データをCSVで提供しています：');
  console.log('https://www.houjin-bangou.nta.go.jp/download/');
  console.log('- 全件データ（月次更新）');
  console.log('- 差分データ（日次更新）');
  console.log('- 都道府県別データ');
}

// 代替API：Google Places API（有料だが確実）
async function testGooglePlacesAPI() {
  console.log('\n🌐 Google Places API（代替案）');
  console.log('建設会社・工務店の情報を取得可能：');
  console.log('- 企業名、住所、電話番号');
  console.log('- 営業時間、ウェブサイト');
  console.log('- ユーザーレビュー、評価');
  console.log('- 写真');
  console.log('\n料金：');
  console.log('- Places API: $17/1000リクエスト');
  console.log('- 月間$200の無料枠あり');
}

// 最も現実的な解決策
async function realisticSolution() {
  console.log('\n✅ 現実的な解決策の提案\n');
  
  console.log('1️⃣ 初期データの手動登録');
  console.log('   - 主要な住宅会社30-50社をまず登録');
  console.log('   - 建設業許可番号は国土交通省サイトで確認');
  console.log('   - https://www.mlit.go.jp/totikensangyo/const/1_6_bt_000080.html');
  
  console.log('\n2️⃣ 段階的なデータ拡充');
  console.log('   - 企業からの掲載申請フォーム');
  console.log('   - ユーザーからの情報提供');
  console.log('   - 定期的な手動更新');
  
  console.log('\n3️⃣ 将来的な自動化');
  console.log('   - gBizINFO APIが安定したら移行');
  console.log('   - 企業が自社情報を更新できる機能');
  console.log('   - 外部サービスとの連携');
}

// 実行
async function main() {
  await testEndpoints();
  await testGooglePlacesAPI();
  await realisticSolution();
}

main();