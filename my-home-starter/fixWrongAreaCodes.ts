import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixWrongAreaCodes() {
  console.log("🔍 誤認識された市外局番データを修正します...\n");

  // 1. ServiceAreaと異なる県に設定されている会社を修正
  console.log("=== ServiceAreaと異なる県に設定されている会社を修正 ===\n");

  const companies = await prisma.company.findMany({
    where: {
      gBizData: {
        path: ['phoneNumber'],
        not: null
      }
    },
    include: {
      serviceAreas: true
    }
  });

  // 不一致を検出
  let mismatchCount = 0;
  const mismatches: any[] = [];

  companies.forEach(company => {
    const gBizData = company.gBizData as any;
    if (!gBizData || !gBizData.prefecture || !gBizData.phoneNumber) return;
    
    const servicePrefectures = company.serviceAreas?.map(sa => sa.prefecture) || [];
    
    // gBizDataの県がServiceAreaに含まれているかチェック
    if (servicePrefectures.length > 0 && !servicePrefectures.includes(gBizData.prefecture)) {
      mismatchCount++;
      mismatches.push({
        id: company.id,
        name: company.name,
        phoneNumber: gBizData.phoneNumber,
        gBizPrefecture: gBizData.prefecture,
        serviceAreas: servicePrefectures.join(', '),
        hasPhoneNumber: true
      });
    }
  });

  console.log(`📊 不一致検出: ${mismatchCount}社\n`);
  
  if (mismatches.length > 0) {
    console.log("不一致の例（最初の10件）:");
    mismatches.slice(0, 10).forEach(m => {
      console.log(`  ${m.name}:`);
      console.log(`    電話番号: ${m.phoneNumber}`);
      console.log(`    現在の設定: ${m.gBizPrefecture}`);
      console.log(`    ServiceArea: ${m.serviceAreas}`);
    });
  }

  // 2. 088番号の修正
  console.log("\n=== 088番号の修正 ===\n");
  
  const with088 = companies.filter(c => {
    const g = c.gBizData as any;
    return g && g.phoneNumber && g.phoneNumber.startsWith('088');
  });

  console.log(`088番号を持つ会社: ${with088.length}社`);

  let fixed088Count = 0;
  for (const company of with088) {
    const hasKochi = company.serviceAreas?.some(sa => sa.prefecture === '高知県') || false;
    const hasShikoku = company.serviceAreas?.some(sa => 
      ['徳島県', '香川県', '愛媛県', '高知県'].includes(sa.prefecture)
    ) || false;
    
    const gBizData = company.gBizData as any;
    const currentPref = gBizData.prefecture;
    
    // 現在の県が高知県でない場合
    if (currentPref !== '高知県') {
      let newPrefecture = '高知県'; // デフォルトは高知県
      
      // ServiceAreaに基づいて判断
      if (hasKochi) {
        newPrefecture = '高知県';
      } else if (hasShikoku) {
        // 他の四国の県がServiceAreaにある場合は、その県を優先
        const shikokuAreas = company.serviceAreas?.filter(sa => 
          ['徳島県', '香川県', '愛媛県'].includes(sa.prefecture)
        ) || [];
        if (shikokuAreas.length === 1) {
          newPrefecture = shikokuAreas[0].prefecture;
        }
      }
      
      // 更新
      await prisma.company.update({
        where: { id: company.id },
        data: {
          gBizData: {
            ...gBizData,
            prefecture: newPrefecture
          }
        }
      });
      
      console.log(`  ✅ ${company.name}: ${currentPref} → ${newPrefecture}`);
      fixed088Count++;
    }
  }

  // 3. 単一のServiceAreaと異なる県の修正
  console.log("\n=== 単一のServiceAreaと異なる県の修正 ===\n");

  const singleAreaCompanies = companies.filter(c => 
    c.serviceAreas && c.serviceAreas.length === 1
  );

  let singleAreaFixed = 0;
  for (const company of singleAreaCompanies) {
    const gBizData = company.gBizData as any;
    if (!gBizData || !gBizData.prefecture) continue;
    
    const serviceArea = company.serviceAreas![0];
    if (gBizData.prefecture !== serviceArea.prefecture) {
      await prisma.company.update({
        where: { id: company.id },
        data: {
          gBizData: {
            ...gBizData,
            prefecture: serviceArea.prefecture
          }
        }
      });
      
      console.log(`  ✅ ${company.name}: ${gBizData.prefecture} → ${serviceArea.prefecture}`);
      singleAreaFixed++;
    }
  }

  // 4. 統計情報
  console.log("\n=== 修正後の統計 ===\n");

  const prefectures = ['東京都', '神奈川県', '千葉県', '埼玉県', '大阪府', '愛知県'];
  
  for (const prefecture of prefectures) {
    const updatedCompanies = await prisma.company.findMany({
      where: {
        gBizData: {
          path: ['prefecture'],
          equals: prefecture
        }
      }
    });

    const withCorrectCity = updatedCompanies.filter(c => {
      const g = c.gBizData as any;
      return g && g.city && g.prefecture === prefecture;
    }).length;

    console.log(`${prefecture}: ${withCorrectCity}/${updatedCompanies.length}社 (${updatedCompanies.length > 0 ? (withCorrectCity/updatedCompanies.length*100).toFixed(1) : '0'}%)`);
  }

  console.log(`\n✅ 合計修正数: ${fixed088Count + singleAreaFixed}社`);

  await prisma.$disconnect();
}

fixWrongAreaCodes().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
