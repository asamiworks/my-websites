import { PrismaClient } from '@prisma/client';
import { areaCodeDatabase } from './areaCodeDatabase.js';
const prisma = new PrismaClient();

async function addAddressToGBizData() {
  const companies = await prisma.company.findMany({
    where: {
      gBizData: { not: null }
    }
  });
  
  console.log(`📊 処理対象: ${companies.length}社`);
  console.log(`📍 市外局番データベース: ${Object.keys(areaCodeDatabase).length}件\n`);
  
  let successCount = 0;
  let phoneNotFound = 0;
  let areaCodeNotFound = 0;
  let alreadyHasAddress = 0;
  let specialNumber = 0;
  
  for (const company of companies) {
    const gBizData = company.gBizData as any;
    
    // 既に住所情報がある場合はスキップ
    if (gBizData && typeof gBizData === 'object' && 'city' in gBizData) {
      alreadyHasAddress++;
      continue;
    }
    
    // phoneNumberを取得（複数の場所を確認）
    let phoneNumber = null;
    if (gBizData?.phoneNumber) {
      phoneNumber = gBizData.phoneNumber;
    } else if (gBizData?.zehRegistration?.phoneNumber) {
      phoneNumber = gBizData.zehRegistration.phoneNumber;
    }
    
    if (!phoneNumber) {
      phoneNotFound++;
      continue;
    }
    
    // 市外局番を抽出
    const normalized = phoneNumber.replace(/[-\s　]/g, '');
    
    // 0120などの特殊番号は除外
    if (normalized.startsWith('0120') || normalized.startsWith('0800')) {
      specialNumber++;
      continue;
    }
    
    // 携帯電話は除外
    if (/^0[789]0/.test(normalized)) {
      specialNumber++;
      continue;
    }
    
    let areaCode = null;
    let locationInfo = null;
    
    // 4桁の市外局番をチェック
    const fourDigit = normalized.substring(0, 4);
    if (areaCodeDatabase[fourDigit]) {
      areaCode = fourDigit;
      locationInfo = areaCodeDatabase[fourDigit];
    }
    
    // 3桁の市外局番をチェック（ハイフン付き）
    if (!locationInfo) {
      const threeDigitWithHyphen = normalized.substring(0, 2) + '-' + normalized.substring(2, 3);
      if (areaCodeDatabase[threeDigitWithHyphen]) {
        areaCode = threeDigitWithHyphen;
        locationInfo = areaCodeDatabase[threeDigitWithHyphen];
      }
    }
    
    // 3桁の市外局番をチェック
    if (!locationInfo) {
      const threeDigit = normalized.substring(0, 3);
      if (areaCodeDatabase[threeDigit]) {
        areaCode = threeDigit;
        locationInfo = areaCodeDatabase[threeDigit];
      }
    }
    
    // 2桁の市外局番をチェック
    if (!locationInfo) {
      const twoDigit = normalized.substring(0, 2);
      if (areaCodeDatabase[twoDigit]) {
        areaCode = twoDigit;
        locationInfo = areaCodeDatabase[twoDigit];
      }
    }
    
    if (!locationInfo) {
      areaCodeNotFound++;
      console.log(`⚠️  ${company.name}: 市外局番が見つかりません (${phoneNumber})`);
      continue;
    }
    
    // gBizDataに住所情報を追加
    const updatedGBizData = {
      ...gBizData,
      phoneNumber: phoneNumber,
      areaCode: areaCode,
      address: `${locationInfo.prefecture}${locationInfo.city}`,
      prefecture: locationInfo.prefecture,
      city: locationInfo.city,
      coordinates: {
        lat: locationInfo.lat,
        lng: locationInfo.lng
      }
    };
    
    // データベースを更新
    await prisma.company.update({
      where: { id: company.id },
      data: {
        gBizData: updatedGBizData
      }
    });
    
    successCount++;
    console.log(`✅ ${company.name}: ${phoneNumber} → ${locationInfo.prefecture}${locationInfo.city}`);
  }
  
  console.log('\n=== 処理完了 ===');
  console.log(`✅ 成功: ${successCount}社`);
  console.log(`📍 既に住所あり: ${alreadyHasAddress}社`);
  console.log(`❌ 電話番号なし: ${phoneNotFound}社`);
  console.log(`📱 特殊番号: ${specialNumber}社`);
  console.log(`⚠️  市外局番不明: ${areaCodeNotFound}社`);
  
  // 結果を確認
  const companiesWithCity = await prisma.company.findMany({
    where: {
      gBizData: { not: null }
    }
  });
  
  let cityCount = 0;
  let ibarakiWithCity = 0;
  const cityBreakdown: { [key: string]: number } = {};
  
  companiesWithCity.forEach((c) => {
    const g = c.gBizData as any;
    if (g && typeof g === 'object' && 'city' in g) {
      cityCount++;
      if (g.prefecture === '茨城県') {
        ibarakiWithCity++;
        cityBreakdown[g.city] = (cityBreakdown[g.city] || 0) + 1;
      }
    }
  });
  
  console.log(`\n📊 最終結果:`);
  console.log(`   全体: ${cityCount}/${companiesWithCity.length}社に市区町村情報あり (${(cityCount/companiesWithCity.length*100).toFixed(1)}%)`);
  console.log(`   茨城県: ${ibarakiWithCity}社に市区町村情報あり`);
  
  if (Object.keys(cityBreakdown).length > 0) {
    console.log(`\n📍 茨城県の市区町村別内訳:`);
    Object.entries(cityBreakdown)
      .sort(([,a], [,b]) => b - a)
      .forEach(([city, count]) => {
        console.log(`   ${city}: ${count}社`);
      });
  }
  
  await prisma.$disconnect();
}

addAddressToGBizData();
