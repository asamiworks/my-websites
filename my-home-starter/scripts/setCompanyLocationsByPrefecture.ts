// scripts/setCompanyLocationsByPrefecture.ts
// 住所データがなくても市区町村ページで会社を表示できるようにする緊急対応スクリプト

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

// 都道府県の県庁所在地の座標
const prefectureCapitals: { [key: string]: { lat: number; lng: number; capital: string } } = {
  '北海道': { lat: 43.0642, lng: 141.3469, capital: '札幌市' },
  '青森県': { lat: 40.8246, lng: 140.7406, capital: '青森市' },
  '岩手県': { lat: 39.7036, lng: 141.1527, capital: '盛岡市' },
  '宮城県': { lat: 38.2689, lng: 140.8721, capital: '仙台市' },
  '秋田県': { lat: 39.7186, lng: 140.1024, capital: '秋田市' },
  '山形県': { lat: 38.2405, lng: 140.3636, capital: '山形市' },
  '福島県': { lat: 37.7500, lng: 140.4678, capital: '福島市' },
  '茨城県': { lat: 36.3418, lng: 140.4468, capital: '水戸市' },
  '栃木県': { lat: 36.5658, lng: 139.8836, capital: '宇都宮市' },
  '群馬県': { lat: 36.3906, lng: 139.0604, capital: '前橋市' },
  '埼玉県': { lat: 35.8570, lng: 139.6489, capital: 'さいたま市' },
  '千葉県': { lat: 35.6050, lng: 140.1233, capital: '千葉市' },
  '東京都': { lat: 35.6762, lng: 139.6503, capital: '新宿区' },
  '神奈川県': { lat: 35.4478, lng: 139.6425, capital: '横浜市' },
  '新潟県': { lat: 37.9022, lng: 139.0236, capital: '新潟市' },
  '富山県': { lat: 36.6953, lng: 137.2114, capital: '富山市' },
  '石川県': { lat: 36.5944, lng: 136.6256, capital: '金沢市' },
  '福井県': { lat: 36.0652, lng: 136.2216, capital: '福井市' },
  '山梨県': { lat: 35.6640, lng: 138.5685, capital: '甲府市' },
  '長野県': { lat: 36.6513, lng: 138.1810, capital: '長野市' },
  '岐阜県': { lat: 35.3912, lng: 136.7223, capital: '岐阜市' },
  '静岡県': { lat: 34.9769, lng: 138.3831, capital: '静岡市' },
  '愛知県': { lat: 35.1802, lng: 136.9066, capital: '名古屋市' },
  '三重県': { lat: 34.7303, lng: 136.5086, capital: '津市' },
  '滋賀県': { lat: 35.0045, lng: 135.8686, capital: '大津市' },
  '京都府': { lat: 35.0212, lng: 135.7555, capital: '京都市' },
  '大阪府': { lat: 34.6863, lng: 135.5200, capital: '大阪市' },
  '兵庫県': { lat: 34.6913, lng: 135.1830, capital: '神戸市' },
  '奈良県': { lat: 34.6851, lng: 135.8328, capital: '奈良市' },
  '和歌山県': { lat: 34.2261, lng: 135.1675, capital: '和歌山市' },
  '鳥取県': { lat: 35.5039, lng: 134.2383, capital: '鳥取市' },
  '島根県': { lat: 35.4723, lng: 133.0505, capital: '松江市' },
  '岡山県': { lat: 34.6617, lng: 133.9350, capital: '岡山市' },
  '広島県': { lat: 34.3966, lng: 132.4596, capital: '広島市' },
  '山口県': { lat: 34.1862, lng: 131.4705, capital: '山口市' },
  '徳島県': { lat: 34.0658, lng: 134.5593, capital: '徳島市' },
  '香川県': { lat: 34.3401, lng: 134.0434, capital: '高松市' },
  '愛媛県': { lat: 33.8416, lng: 132.7659, capital: '松山市' },
  '高知県': { lat: 33.5597, lng: 133.5311, capital: '高知市' },
  '福岡県': { lat: 33.6064, lng: 130.4183, capital: '福岡市' },
  '佐賀県': { lat: 33.2494, lng: 130.2988, capital: '佐賀市' },
  '長崎県': { lat: 32.7448, lng: 129.8737, capital: '長崎市' },
  '熊本県': { lat: 32.7898, lng: 130.7417, capital: '熊本市' },
  '大分県': { lat: 33.2381, lng: 131.6126, capital: '大分市' },
  '宮崎県': { lat: 31.9111, lng: 131.4239, capital: '宮崎市' },
  '鹿児島県': { lat: 31.5602, lng: 130.5581, capital: '鹿児島市' },
  '沖縄県': { lat: 26.2124, lng: 127.6809, capital: '那覇市' }
};

// 市区町村ごとの座標データを読み込み（public/municipalities.csvから）
async function loadMunicipalityCoordinates() {
  const csvPath = path.join(process.cwd(), 'public', 'municipalities.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });
  
  const coordinatesMap = new Map<string, { lat: number; lng: number }>();
  
  records.forEach((record: any) => {
    const key = `${record.prefecture}${record.city}`;
    // CSVに緯度経度があれば使用（なければ後で補完）
    if (record.lat && record.lng) {
      coordinatesMap.set(key, {
        lat: parseFloat(record.lat),
        lng: parseFloat(record.lng)
      });
    }
  });
  
  return coordinatesMap;
}

// 都道府県をベースに仮の住所と座標を設定
async function setCompanyLocations() {
  console.log('🏗️ 会社の位置情報設定を開始します...\n');
  
  try {
    // 座標が設定されていない会社を取得
    const companies = await prisma.company.findMany({
      where: {
        gBizData: null
      },
      include: {
        serviceAreas: true
      }
    });
    
    console.log(`📊 処理対象: ${companies.length}社\n`);
    
    // 市区町村の座標データを読み込み
    const municipalityCoords = await loadMunicipalityCoordinates();
    
    let processedCount = 0;
    const updatePromises = [];
    
    for (const company of companies) {
      if (company.serviceAreas.length === 0) {
        console.log(`⚠️  ${company.name}: サービスエリアが設定されていません`);
        continue;
      }
      
      // 最初のサービスエリアを本社所在地と仮定
      const mainArea = company.serviceAreas[0];
      const prefecture = mainArea.prefecture;
      const city = mainArea.city;
      
      let coordinates = null;
      let estimatedAddress = '';
      
      if (city) {
        // 市区町村レベルの座標を探す
        const cityKey = `${prefecture}${city}`;
        const cityCoords = municipalityCoords.get(cityKey);
        
        if (cityCoords) {
          coordinates = cityCoords;
          estimatedAddress = `${prefecture}${city}`;
        }
      }
      
      // 市区町村の座標がない場合は県庁所在地の座標を使用
      if (!coordinates && prefectureCapitals[prefecture]) {
        const prefData = prefectureCapitals[prefecture];
        coordinates = { lat: prefData.lat, lng: prefData.lng };
        estimatedAddress = `${prefecture}${prefData.capital}`;
      }
      
      if (coordinates) {
        // 電話番号の取得（ZEHデータから、もしあれば）
        let phoneNumber = '';
        if (company.website && company.website.includes('tel:')) {
          const match = company.website.match(/tel:([\d-]+)/);
          if (match) phoneNumber = match[1];
        }
        
        const updateData = {
          gBizData: {
            ...(typeof company.gBizData === 'object' ? company.gBizData : {}),
            coordinates: coordinates,
            estimatedLocation: {
              prefecture: prefecture,
              city: city || prefectureCapitals[prefecture]?.capital || '',
              address: estimatedAddress,
              method: city ? 'municipality_center' : 'prefecture_capital',
              isEstimated: true
            },
            zehRegistration: {
              phoneNumber: phoneNumber || null
            },
            lastUpdated: new Date().toISOString()
          },
          gBizLastUpdated: new Date()
        };
        
        updatePromises.push(
          prisma.company.update({
            where: { id: company.id },
            data: updateData
          }).then(() => {
            processedCount++;
            console.log(`✅ ${company.name}: ${estimatedAddress} (${coordinates.lat}, ${coordinates.lng})`);
          }).catch(error => {
            console.error(`❌ ${company.name}: 更新エラー`, error.message);
          })
        );
      } else {
        console.log(`⚠️  ${company.name}: 座標を特定できません`);
      }
      
      // バッチ処理（100件ごとに実行）
      if (updatePromises.length >= 100) {
        await Promise.all(updatePromises);
        updatePromises.length = 0;
        console.log(`\n💾 ${processedCount}件処理済み...\n`);
      }
    }
    
    // 残りの更新を実行
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }
    
    console.log('\n=== 処理完了 ===');
    console.log(`✅ 成功: ${processedCount}件`);
    console.log(`⚠️  スキップ: ${companies.length - processedCount}件`);
    
    // 統計情報を表示
    const stats = await prisma.company.count({
      where: {
        gBizData: {
          not: null
        }
      }
    });
    
    console.log(`\n📊 総計: ${stats}社に座標情報あり`);
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 茨城県の会社のみ処理する関数
async function setIbarakiCompanyLocations() {
  console.log('🏗️ 茨城県の会社の位置情報設定を開始します...\n');
  
  try {
    const companies = await prisma.company.findMany({
      where: {
        serviceAreas: {
          some: {
            prefecture: '茨城県'
          }
        },
        gBizData: null
      },
      include: {
        serviceAreas: {
          where: {
            prefecture: '茨城県'
          }
        }
      }
    });
    
    console.log(`📊 茨城県の処理対象: ${companies.length}社\n`);
    
    // 茨城県の主要都市の座標（より詳細）
    const ibarakiCities: { [key: string]: { lat: number; lng: number } } = {
      '水戸市': { lat: 36.3659, lng: 140.4713 },
      '日立市': { lat: 36.5992, lng: 140.6513 },
      'つくば市': { lat: 36.0834, lng: 140.0767 },
      'ひたちなか市': { lat: 36.3966, lng: 140.5346 },
      '土浦市': { lat: 36.0781, lng: 140.1951 },
      '古河市': { lat: 36.1789, lng: 139.7527 },
      '取手市': { lat: 35.9117, lng: 140.0511 },
      '牛久市': { lat: 35.9795, lng: 140.1494 },
      '守谷市': { lat: 35.9514, lng: 139.9753 },
      '龍ケ崎市': { lat: 35.9113, lng: 140.1813 },
      '石岡市': { lat: 36.1906, lng: 140.2856 },
      '結城市': { lat: 36.3050, lng: 139.8767 },
      '下妻市': { lat: 36.1847, lng: 139.9672 },
      '常総市': { lat: 36.0233, lng: 139.9933 },
      '常陸太田市': { lat: 36.5384, lng: 140.5267 },
      '高萩市': { lat: 36.7161, lng: 140.7161 },
      '北茨城市': { lat: 36.8019, lng: 140.7508 },
      '笠間市': { lat: 36.3460, lng: 140.3040 },
      '鹿嶋市': { lat: 35.9658, lng: 140.6447 },
      '潮来市': { lat: 35.9472, lng: 140.5547 },
      '常陸大宮市': { lat: 36.5433, lng: 140.4108 },
      '那珂市': { lat: 36.4567, lng: 140.4870 },
      '筑西市': { lat: 36.3070, lng: 139.9828 },
      '坂東市': { lat: 36.0486, lng: 139.8889 },
      '稲敷市': { lat: 35.9564, lng: 140.3236 },
      'かすみがうら市': { lat: 36.1514, lng: 140.2356 },
      '桜川市': { lat: 36.3270, lng: 140.0905 },
      '神栖市': { lat: 35.8900, lng: 140.6644 },
      '行方市': { lat: 36.0147, lng: 140.4870 },
      '鉾田市': { lat: 36.1592, lng: 140.5156 },
      'つくばみらい市': { lat: 35.9633, lng: 140.0372 },
      '小美玉市': { lat: 36.2408, lng: 140.3511 },
      '茨城町': { lat: 36.2869, lng: 140.4246 },
      '大洗町': { lat: 36.3133, lng: 140.5747 },
      '城里町': { lat: 36.4797, lng: 140.3761 },
      '東海村': { lat: 36.4733, lng: 140.5678 },
      '大子町': { lat: 36.7654, lng: 140.3570 },
      '美浦村': { lat: 36.0083, lng: 140.3008 },
      '阿見町': { lat: 36.0308, lng: 140.2150 },
      '河内町': { lat: 35.8833, lng: 140.2456 },
      '八千代町': { lat: 36.1817, lng: 139.8897 },
      '五霞町': { lat: 36.1147, lng: 139.7456 },
      '境町': { lat: 36.1089, lng: 139.7956 },
      '利根町': { lat: 35.8556, lng: 140.1439 }
    };
    
    let processedCount = 0;
    
    for (const company of companies) {
      const serviceArea = company.serviceAreas[0];
      let coordinates = null;
      let estimatedAddress = '';
      
      if (serviceArea.city && ibarakiCities[serviceArea.city]) {
        // 詳細な市の座標がある場合
        coordinates = ibarakiCities[serviceArea.city];
        estimatedAddress = `茨城県${serviceArea.city}`;
      } else {
        // なければ県庁所在地（水戸市）の座標を使用
        coordinates = prefectureCapitals['茨城県'];
        estimatedAddress = `茨城県${prefectureCapitals['茨城県'].capital}`;
      }
      
      await prisma.company.update({
        where: { id: company.id },
        data: {
          gBizData: {
            coordinates: coordinates,
            estimatedLocation: {
              prefecture: '茨城県',
              city: serviceArea.city || '水戸市',
              address: estimatedAddress,
              method: 'estimated_from_service_area',
              isEstimated: true
            },
            zehRegistration: {
              phoneNumber: company.website?.match(/tel:([\d-]+)/)?.[1] || null
            },
            lastUpdated: new Date().toISOString()
          },
          gBizLastUpdated: new Date()
        }
      });
      
      processedCount++;
      console.log(`✅ ${company.name}: ${estimatedAddress} (${coordinates.lat}, ${coordinates.lng})`);
    }
    
    console.log(`\n✅ 茨城県の処理完了: ${processedCount}社`);
    
  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// メイン実行
const args = process.argv.slice(2);

if (args.includes('--ibaraki')) {
  // 茨城県のみ処理
  setIbarakiCompanyLocations();
} else if (args.includes('--all')) {
  // 全都道府県処理
  setCompanyLocations();
} else {
  console.log('使用方法:');
  console.log('  npx tsx scripts/setCompanyLocationsByPrefecture.ts --ibaraki  # 茨城県のみ');
  console.log('  npx tsx scripts/setCompanyLocationsByPrefecture.ts --all      # 全都道府県');
}