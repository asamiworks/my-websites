// scripts/fixMissingCoordinates.ts
// 座標が取得できなかった市町村の座標を手動で設定

import * as fs from 'fs';
import * as path from 'path';

interface Municipality {
  code: string;
  prefecture: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
}

async function fixMissingCoordinates() {
  console.log('=== 座標未取得の市町村を修正 ===\n');

  // 手動で設定する座標データ
  // これらの座標は各市町村の役所の位置を基準にしています
  const missingCoordinates: Municipality[] = [
    {
      code: "11201",
      prefecture: "埼玉県",
      district: "",
      city: "川越市",
      lat: 35.9250,    // 川越市役所
      lng: 139.4859
    },
    {
      code: "11212",
      prefecture: "埼玉県",
      district: "",
      city: "東松山市",
      lat: 36.0421,    // 東松山市役所
      lng: 139.3998
    },
    {
      code: "13381",
      prefecture: "東京都",
      district: "三宅支庁",
      city: "三宅村",
      lat: 34.0756,    // 三宅村役場（三宅島）
      lng: 139.5265
    },
    {
      code: "13401",
      prefecture: "東京都",
      district: "八丈支庁",
      city: "八丈町",
      lat: 33.1094,    // 八丈町役場（八丈島）
      lng: 139.7897
    }
  ];

  // 既存の座標データを読み込み
  const coordinatesPath = path.join(process.cwd(), 'data', 'municipality-coordinates.json');
  let existingData: Municipality[] = [];
  
  if (fs.existsSync(coordinatesPath)) {
    existingData = JSON.parse(fs.readFileSync(coordinatesPath, 'utf-8'));
    console.log(`既存データ: ${existingData.length}件`);
  }

  // 既存データのマップを作成
  const existingMap = new Map(
    existingData.map(m => [`${m.prefecture}${m.city}`, m])
  );

  // 修正データを追加
  let addedCount = 0;
  for (const municipality of missingCoordinates) {
    const key = `${municipality.prefecture}${municipality.city}`;
    
    if (!existingMap.has(key)) {
      existingData.push(municipality);
      console.log(`✓ 追加: ${municipality.prefecture} ${municipality.city} (${municipality.lat}, ${municipality.lng})`);
      addedCount++;
    } else {
      console.log(`⏭ スキップ: ${municipality.prefecture} ${municipality.city} (既存)`);
    }
  }

  // データをソート（都道府県コード順）
  existingData.sort((a, b) => a.code.localeCompare(b.code));

  // ファイルに保存
  fs.writeFileSync(coordinatesPath, JSON.stringify(existingData, null, 2));
  
  console.log(`\n座標データを更新しました: ${coordinatesPath}`);
  console.log(`追加件数: ${addedCount}件`);
  console.log(`総件数: ${existingData.length}件`);

  // 検証：すべての座標が有効か確認
  console.log('\n=== 座標データの検証 ===');
  let invalidCount = 0;
  
  for (const municipality of existingData) {
    if (!municipality.lat || !municipality.lng || 
        municipality.lat === 0 || municipality.lng === 0) {
      console.log(`❌ 無効: ${municipality.prefecture} ${municipality.city}`);
      invalidCount++;
    }
  }

  if (invalidCount === 0) {
    console.log('✅ すべての座標データが有効です！');
  } else {
    console.log(`\n⚠️ ${invalidCount}件の無効な座標があります`);
  }

  // 都道府県別の統計
  console.log('\n=== 都道府県別統計 ===');
  const byPrefecture = new Map<string, number>();
  
  existingData.forEach(m => {
    byPrefecture.set(m.prefecture, (byPrefecture.get(m.prefecture) || 0) + 1);
  });

  Array.from(byPrefecture.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([pref, count]) => {
      console.log(`${pref}: ${count}件`);
    });
}

// 座標の妥当性を確認（オプション）
async function verifyCoordinates() {
  console.log('\n=== 座標の妥当性確認 ===');
  
  const testCases = [
    { name: '川越市', lat: 35.9250, lng: 139.4859, expectedPref: '埼玉県' },
    { name: '東松山市', lat: 36.0421, lng: 139.3998, expectedPref: '埼玉県' },
    { name: '三宅村', lat: 34.0756, lng: 139.5265, expectedPref: '東京都' },
    { name: '八丈町', lat: 33.1094, lng: 139.7897, expectedPref: '東京都' }
  ];

  for (const test of testCases) {
    // 日本の範囲内かチェック
    const isValidLat = test.lat >= 24 && test.lat <= 46;  // 日本の緯度範囲
    const isValidLng = test.lng >= 123 && test.lng <= 146; // 日本の経度範囲
    
    if (isValidLat && isValidLng) {
      console.log(`✓ ${test.name}: 座標が日本の範囲内です`);
    } else {
      console.log(`✗ ${test.name}: 座標が日本の範囲外です！`);
    }
  }
}

// 実行
fixMissingCoordinates()
  .then(() => verifyCoordinates())
  .then(() => {
    console.log('\n修正完了！');
    process.exit(0);
  })
  .catch(error => {
    console.error('エラー:', error);
    process.exit(1);
  });