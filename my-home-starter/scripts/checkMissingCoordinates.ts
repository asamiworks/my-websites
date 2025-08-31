// scripts/checkMissingCoordinates.ts
// 座標が取得できなかった市町村を特定

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

interface Municipality {
  code: string;
  prefecture: string;
  district: string;
  city: string;
  lat?: number;
  lng?: number;
}

async function checkMissingCoordinates() {
  console.log('=== 座標未取得の市町村を確認 ===\n');

  // CSVファイルから全市町村を読み込み
  const csvPath = path.join(process.cwd(), 'public', 'municipalities.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  const records = parse(csvContent, {
    columns: false,
    skip_empty_lines: true,
    from_line: 2 // ヘッダーをスキップ
  });

  const allMunicipalities: Municipality[] = records.map((record: string[]) => {
    const code = record[0]?.replace(/"/g, '') || '';
    const prefecture = record[1]?.replace(/"/g, '') || '';
    const district = record[2]?.replace(/"/g, '') || '';
    const city = record[4]?.replace(/"/g, '') || '';

    // 市町村名の決定
    let municipalityName = '';
    if (city && district && district.includes('市')) {
      // 政令指定都市の区（例：大阪市北区）
      municipalityName = `${district}${city}`;
    } else if (city) {
      // 通常の市町村
      municipalityName = city;
    } else if (district) {
      // 郡部の場合
      municipalityName = district;
    }

    return {
      code,
      prefecture,
      district,
      city: municipalityName
    };
  }).filter(m => m.prefecture && m.city);

  console.log(`全市町村数: ${allMunicipalities.length}件`);

  // 座標データを読み込み
  const coordinatesPath = path.join(process.cwd(), 'data', 'municipality-coordinates.json');
  let coordinatedMunicipalities: Municipality[] = [];
  
  if (fs.existsSync(coordinatesPath)) {
    coordinatedMunicipalities = JSON.parse(fs.readFileSync(coordinatesPath, 'utf-8'));
    console.log(`座標取得済み: ${coordinatedMunicipalities.length}件`);
  }

  // 座標取得済みのマップを作成
  const coordinatedMap = new Map(
    coordinatedMunicipalities.map(m => [`${m.prefecture}${m.city}`, m])
  );

  // 座標が取得できていない市町村を特定
  const missingMunicipalities: Municipality[] = [];
  
  for (const municipality of allMunicipalities) {
    const key = `${municipality.prefecture}${municipality.city}`;
    if (!coordinatedMap.has(key)) {
      missingMunicipalities.push(municipality);
    }
  }

  console.log(`\n座標未取得: ${missingMunicipalities.length}件\n`);

  // 詳細を表示
  if (missingMunicipalities.length > 0) {
    console.log('=== 座標未取得の市町村一覧 ===');
    missingMunicipalities.forEach((m, index) => {
      console.log(`${index + 1}. [${m.code}] ${m.prefecture} - ${m.city}`);
      if (m.district && m.district !== m.city) {
        console.log(`   郡・支庁: ${m.district}`);
      }
    });

    // 手動で座標を設定するためのテンプレートを生成
    console.log('\n=== 手動設定用テンプレート ===');
    console.log('以下のデータを municipality-coordinates.json に追加してください：\n');
    
    const manualEntries = missingMunicipalities.map(m => {
      // 一般的な座標を仮設定（後で正確な値に置き換える）
      return {
        code: m.code,
        prefecture: m.prefecture,
        district: m.district,
        city: m.city,
        lat: 0, // 要修正
        lng: 0  // 要修正
      };
    });

    console.log(JSON.stringify(manualEntries, null, 2));

    // 国土地理院APIで再試行するためのコード
    console.log('\n=== 再試行用コマンド ===');
    missingMunicipalities.forEach(m => {
      const address = `${m.prefecture}${m.city}`;
      const encodedAddress = encodeURIComponent(address);
      console.log(`\n# ${address}`);
      console.log(`curl "https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodedAddress}" | jq .`);
    });
  }

  // 都道府県別の統計
  console.log('\n=== 都道府県別統計 ===');
  const byPrefecture = new Map<string, { total: number; missing: number }>();
  
  allMunicipalities.forEach(m => {
    if (!byPrefecture.has(m.prefecture)) {
      byPrefecture.set(m.prefecture, { total: 0, missing: 0 });
    }
    byPrefecture.get(m.prefecture)!.total++;
  });

  missingMunicipalities.forEach(m => {
    if (byPrefecture.has(m.prefecture)) {
      byPrefecture.get(m.prefecture)!.missing++;
    }
  });

  Array.from(byPrefecture.entries())
    .filter(([_, stats]) => stats.missing > 0)
    .forEach(([pref, stats]) => {
      console.log(`${pref}: ${stats.missing}/${stats.total}件が未取得`);
    });
}

// 実行
checkMissingCoordinates()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('エラー:', error);
    process.exit(1);
  });