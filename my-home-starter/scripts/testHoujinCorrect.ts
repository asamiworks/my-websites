// scripts/testHoujinCorrect.ts
import axios from 'axios';

async function testHoujinBangou() {
  console.log('🔍 法人番号API（国税庁）テスト\n');
  
  // 正しいエンドポイント
  const API_ENDPOINT = 'https://api.houjin-bangou.nta.go.jp/4/name';
  
  try {
    // 検索パラメータ
    const params = new URLSearchParams({
      name: 'ハウス',
      type: '12',  // JSON形式
      mode: '2'    // 部分一致
    });
    
    const url = `${API_ENDPOINT}?${params.toString()}`;
    console.log('リクエストURL:', url);
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ 成功！');
    
    // レスポンスの形式を確認
    console.log('レスポンス形式:', typeof response.data);
    
    if (Array.isArray(response.data)) {
      const companies = response.data;
      console.log(`\n${companies.length}件の企業が見つかりました\n`);
      
      companies.slice(0, 5).forEach((corp: any, index: number) => {
        console.log(`${index + 1}. ${corp.name || corp['法人名']}`);
        console.log(`   法人番号: ${corp.corporateNumber || corp['法人番号']}`);
        console.log(`   所在地: ${corp.prefectureName || corp['都道府県名']}${corp.cityName || corp['市区町村名'] || ''}`);
        console.log('');
      });
    } else {
      console.log('想定外のレスポンス形式:', response.data);
    }
  } catch (error: any) {
    console.error('❌ エラー:', error.message);
    if (error.response) {
      console.error('ステータス:', error.response.status);
      console.error('レスポンス:', error.response.data);
    }
  }
}

// 別の方法：直接ブラウザでアクセス可能なURLをテスト
async function testDirectAccess() {
  console.log('\n📝 直接アクセステスト');
  console.log('以下のURLをブラウザで開いてみてください：');
  console.log('https://api.houjin-bangou.nta.go.jp/4/name?name=積水ハウス&type=12&mode=1');
  
  // または特定の法人番号で検索
  console.log('\n特定の法人番号で検索：');
  try {
    const response = await axios.get(
      'https://api.houjin-bangou.nta.go.jp/4/num?id=8120001059652&type=12'
    );
    console.log('✅ 法人番号検索成功！');
    console.log(response.data);
  } catch (error: any) {
    console.error('❌ エラー:', error.message);
  }
}

// 建設業者の検索（手動でフィルタリング）
async function searchConstruction() {
  console.log('\n🏗️ 建設・住宅関連企業の検索');
  
  const keywords = ['住宅', '建設', '工務店', 'ハウス'];
  
  for (const keyword of keywords) {
    try {
      console.log(`\n検索キーワード: "${keyword}"`);
      
      const params = new URLSearchParams({
        name: keyword,
        type: '12',
        mode: '2'
      });
      
      const response = await axios.get(
        `https://api.houjin-bangou.nta.go.jp/4/name?${params.toString()}`
      );
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log(`${response.data.length}件見つかりました`);
        response.data.slice(0, 3).forEach((corp: any) => {
          console.log(`- ${corp.name || corp['法人名']}`);
        });
      }
    } catch (error) {
      console.error(`"${keyword}"の検索でエラー`);
    }
  }
}

// 実行
async function main() {
  await testHoujinBangou();
  await testDirectAccess();
  await searchConstruction();
}

main();