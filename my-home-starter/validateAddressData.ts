import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function validateAddressData() {
  console.log("🔍 住所データの検証を開始します...\n");

  // 1. 全体統計
  const totalCompanies = await prisma.company.count();
  const withAddress = await prisma.company.count({
    where: {
      gBizData: {
        not: null
      }
    }
  });

  console.log("=== 全体統計 ===");
  console.log(`総会社数: ${totalCompanies}`);
  console.log(`住所設定済み: ${withAddress} (${(withAddress/totalCompanies*100).toFixed(1)}%)\n`);

  // 2. 都道府県別分布
  const companies = await prisma.company.findMany({
    where: {
      gBizData: {
        not: null
      }
    },
    include: {
      serviceAreas: true
    }
  });

  const prefectureCount: { [key: string]: number } = {};
  companies.forEach(company => {
    const gBizData = company.gBizData as any;
    if (gBizData?.prefecture) {
      prefectureCount[gBizData.prefecture] = (prefectureCount[gBizData.prefecture] || 0) + 1;
    }
  });

  console.log("=== 都道府県別分布（上位10） ===");
  Object.entries(prefectureCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([pref, count]) => {
      console.log(`${pref}: ${count}社`);
    });

  // 3. ServiceAreaとの不一致チェック
  console.log("\n=== ServiceAreaとの整合性チェック ===");
  
  const mismatches: any[] = [];
  companies.forEach(company => {
    const gBizData = company.gBizData as any;
    if (!gBizData?.prefecture || company.serviceAreas.length === 0) return;
    
    const servicePrefs = company.serviceAreas.map(sa => sa.prefecture);
    const companyPref = gBizData.prefecture;
    
    // 会社の所在地がServiceAreaに含まれていない場合（通常はあり得る）
    // ただし、あまりにも離れている場合は要確認
    const isNearby = isNearbyPrefecture(companyPref, servicePrefs);
    
    if (!isNearby && !servicePrefs.includes(companyPref)) {
      mismatches.push({
        name: company.name,
        phone: gBizData.phoneNumber,
        prefecture: companyPref,
        serviceAreas: servicePrefs.join(', '),
        distance: getDistance(companyPref, servicePrefs)
      });
    }
  });

  console.log(`遠隔地にある可能性がある会社: ${mismatches.length}社`);
  
  // 距離が特に遠い上位10社を表示
  mismatches
    .sort((a, b) => b.distance - a.distance)
    .slice(0, 10)
    .forEach(m => {
      console.log(`\n${m.name}:`);
      console.log(`  電話: ${m.phone}`);
      console.log(`  所在地: ${m.prefecture}`);
      console.log(`  ServiceArea: ${m.serviceAreas}`);
    });

  // 4. 市外局番の分布チェック
  console.log("\n=== 市外局番の分布（上位20） ===");
  
  const areaCodeCount: { [key: string]: number } = {};
  companies.forEach(company => {
    const gBizData = company.gBizData as any;
    if (gBizData?.areaCode) {
      areaCodeCount[gBizData.areaCode] = (areaCodeCount[gBizData.areaCode] || 0) + 1;
    }
  });

  Object.entries(areaCodeCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .forEach(([code, count]) => {
      console.log(`${code}: ${count}社`);
    });

  // 5. 特定の会社のサンプルチェック
  console.log("\n=== サンプルチェック（ランダム10社） ===");
  
  const randomCompanies = companies
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
    
  for (const company of randomCompanies) {
    const gBizData = company.gBizData as any;
    console.log(`\n${company.name}:`);
    console.log(`  電話番号: ${gBizData.phoneNumber}`);
    console.log(`  市外局番: ${gBizData.areaCode}`);
    console.log(`  推定住所: ${gBizData.prefecture}${gBizData.city}`);
    console.log(`  ServiceArea: ${company.serviceAreas.map(sa => sa.prefecture).join(', ')}`);
    console.log(`  設定方法: ${gBizData.method || '不明'}`);
  }

  // 6. 異常値検出
  console.log("\n=== 異常値の可能性がある会社 ===");
  
  // 088番号で高知県/徳島県以外
  const abnormal088 = companies.filter(c => {
    const g = c.gBizData as any;
    return g?.phoneNumber?.startsWith('088') && 
           !['高知県', '徳島県'].includes(g.prefecture);
  });
  
  if (abnormal088.length > 0) {
    console.log(`\n088番号で四国以外: ${abnormal088.length}社`);
    abnormal088.slice(0, 5).forEach(c => {
      const g = c.gBizData as any;
      console.log(`  ${c.name}: ${g.phoneNumber} → ${g.prefecture}`);
    });
  }

  // 03番号で東京都以外
  const abnormal03 = companies.filter(c => {
    const g = c.gBizData as any;
    return g?.phoneNumber?.startsWith('03') && g.prefecture !== '東京都';
  });
  
  if (abnormal03.length > 0) {
    console.log(`\n03番号で東京都以外: ${abnormal03.length}社`);
    abnormal03.slice(0, 5).forEach(c => {
      const g = c.gBizData as any;
      console.log(`  ${c.name}: ${g.phoneNumber} → ${g.prefecture}`);
    });
  }

  await prisma.$disconnect();
}

// 都道府県の隣接関係をチェック
function isNearbyPrefecture(pref: string, servicePrefs: string[]): boolean {
  const nearby: { [key: string]: string[] } = {
    '東京都': ['神奈川県', '埼玉県', '千葉県', '山梨県'],
    '神奈川県': ['東京都', '千葉県', '山梨県', '静岡県'],
    '埼玉県': ['東京都', '千葉県', '茨城県', '栃木県', '群馬県', '長野県', '山梨県'],
    '千葉県': ['東京都', '埼玉県', '茨城県', '神奈川県'],
    '静岡県': ['神奈川県', '山梨県', '長野県', '愛知県'],
    '愛知県': ['静岡県', '長野県', '岐阜県', '三重県'],
    '大阪府': ['京都府', '兵庫県', '奈良県', '和歌山県'],
    '高知県': ['徳島県', '愛媛県'],
    '徳島県': ['香川県', '愛媛県', '高知県'],
    // ... 他の都道府県も追加可能
  };

  const nearbyPrefs = nearby[pref] || [];
  return servicePrefs.some(sp => sp === pref || nearbyPrefs.includes(sp));
}

// 都道府県間の距離を計算（簡易版）
function getDistance(pref: string, servicePrefs: string[]): number {
  // 地域ブロックで簡易的に距離を計算
  const regions: { [key: string]: number } = {
    '北海道': 1,
    '青森県': 2, '岩手県': 2, '宮城県': 2, '秋田県': 2, '山形県': 2, '福島県': 2,
    '茨城県': 3, '栃木県': 3, '群馬県': 3, '埼玉県': 3, '千葉県': 3, '東京都': 3, '神奈川県': 3,
    '新潟県': 4, '富山県': 4, '石川県': 4, '福井県': 4,
    '山梨県': 5, '長野県': 5, '岐阜県': 5, '静岡県': 5, '愛知県': 5,
    '三重県': 6, '滋賀県': 6, '京都府': 6, '大阪府': 6, '兵庫県': 6, '奈良県': 6, '和歌山県': 6,
    '鳥取県': 7, '島根県': 7, '岡山県': 7, '広島県': 7, '山口県': 7,
    '徳島県': 8, '香川県': 8, '愛媛県': 8, '高知県': 8,
    '福岡県': 9, '佐賀県': 9, '長崎県': 9, '熊本県': 9, '大分県': 9, '宮崎県': 9, '鹿児島県': 9,
    '沖縄県': 10
  };

  const prefRegion = regions[pref] || 0;
  const minDistance = Math.min(...servicePrefs.map(sp => Math.abs(prefRegion - (regions[sp] || 0))));
  return minDistance;
}

validateAddressData();
