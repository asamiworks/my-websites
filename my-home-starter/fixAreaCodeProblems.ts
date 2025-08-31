import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixAreaCodeProblems() {
  console.log("🔧 市外局番の問題を修正します...\n");

  // 1. 098番号の修正（宮崎県・鹿児島県）
  console.log("=== 098番号の修正 ===");
  
  const companies098 = await prisma.company.findMany({
    where: {
      gBizData: {
        path: ['phoneNumber'],
        string_starts_with: '098'
      }
    }
  });

  console.log(`098番号を持つ会社: ${companies098.length}社\n`);

  for (const company of companies098) {
    const gBizData = company.gBizData as any;
    const phone = gBizData.phoneNumber;
    
    let correctPrefecture = '';
    let correctCity = '';
    let lat = 0;
    let lng = 0;
    
    // 098番号の正しいマッピング
    if (phone.startsWith('0980')) {
      correctPrefecture = '沖縄県';
      correctCity = '石垣市';
      lat = 24.3448;
      lng = 124.1572;
    } else if (phone.startsWith('0982')) {
      correctPrefecture = '宮崎県';
      correctCity = '延岡市';
      lat = 32.5815;
      lng = 131.6648;
    } else if (phone.startsWith('0983')) {
      correctPrefecture = '宮崎県';
      correctCity = '日向市';
      lat = 32.4215;
      lng = 131.6243;
    } else if (phone.startsWith('0984')) {
      correctPrefecture = '宮崎県';
      correctCity = '小林市';
      lat = 31.9973;
      lng = 130.9742;
    } else if (phone.startsWith('0985')) {
      correctPrefecture = '宮崎県';
      correctCity = '宮崎市';
      lat = 31.9111;
      lng = 131.4239;
    } else if (phone.startsWith('0986')) {
      correctPrefecture = '宮崎県';
      correctCity = '都城市';
      lat = 31.7199;
      lng = 131.0615;
    } else if (phone.startsWith('0987')) {
      correctPrefecture = '宮崎県';
      correctCity = '日南市';
      lat = 31.5996;
      lng = 131.3790;
    } else if (phone.startsWith('098')) {
      correctPrefecture = '沖縄県';
      correctCity = '那覇市';
      lat = 26.2124;
      lng = 127.6809;
    }
    
    if (correctPrefecture && gBizData.prefecture !== correctPrefecture) {
      console.log(`修正: ${company.name}`);
      console.log(`  電話: ${phone}`);
      console.log(`  ${gBizData.prefecture} → ${correctPrefecture}`);
      
      await prisma.company.update({
        where: { id: company.id },
        data: {
          gBizData: {
            ...gBizData,
            prefecture: correctPrefecture,
            city: correctCity,
            coordinates: { lat, lng }
          }
        }
      });
    }
  }

  // 2. 042番号の修正
  console.log("\n=== 042番号の修正 ===");
  
  const companies042 = await prisma.company.findMany({
    where: {
      gBizData: {
        path: ['phoneNumber'],
        string_starts_with: '042'
      }
    }
  });

  console.log(`042番号を持つ会社: ${companies042.length}社\n`);

  for (const company of companies042) {
    const gBizData = company.gBizData as any;
    const phone = gBizData.phoneNumber.replace(/[-\s]/g, '');
    
    let correctCity = '八王子市';
    let lat = 35.6557;
    let lng = 139.3389;
    
    // 042のサブエリアを詳細に判定
    if (phone.startsWith('0422')) {
      correctCity = '武蔵野市';
      lat = 35.7181;
      lng = 139.5667;
    } else if (phone.startsWith('0423')) {
      correctCity = '三鷹市';
      lat = 35.6833;
      lng = 139.5598;
    } else if (phone.startsWith('0424')) {
      correctCity = '調布市';
      lat = 35.6506;
      lng = 139.5408;
    } else if (phone.startsWith('0425')) {
      correctCity = '国分寺市';
      lat = 35.7109;
      lng = 139.4626;
    } else if (phone.startsWith('0426')) {
      correctCity = '小平市';
      lat = 35.7286;
      lng = 139.4774;
    } else if (phone.startsWith('0427')) {
      correctCity = '東村山市';
      lat = 35.7546;
      lng = 139.4684;
    } else if (phone.startsWith('0428')) {
      correctCity = '青梅市';
      lat = 35.7879;
      lng = 139.2758;
    }
    
    if (gBizData.prefecture !== '東京都' || gBizData.city !== correctCity) {
      console.log(`修正: ${company.name}`);
      console.log(`  電話: ${phone}`);
      console.log(`  ${gBizData.prefecture}${gBizData.city} → 東京都${correctCity}`);
      
      await prisma.company.update({
        where: { id: company.id },
        data: {
          gBizData: {
            ...gBizData,
            prefecture: '東京都',
            city: correctCity,
            coordinates: { lat, lng }
          }
        }
      });
    }
  }

  // 3. 携帯電話・IP電話の削除
  console.log("\n=== 携帯電話・IP電話の処理 ===");
  
  const invalidPhones = await prisma.company.findMany({
    where: {
      OR: [
        { gBizData: { path: ['phoneNumber'], string_starts_with: '080' } },
        { gBizData: { path: ['phoneNumber'], string_starts_with: '090' } },
        { gBizData: { path: ['phoneNumber'], string_starts_with: '070' } },
        { gBizData: { path: ['phoneNumber'], string_starts_with: '050' } },
        { gBizData: { path: ['phoneNumber'], string_starts_with: '0120' } },
        { gBizData: { path: ['phoneNumber'], string_starts_with: '0800' } }
      ]
    }
  });

  console.log(`携帯電話・IP電話を持つ会社: ${invalidPhones.length}社`);
  
  for (const company of invalidPhones) {
    console.log(`削除: ${company.name} - ${(company.gBizData as any).phoneNumber}`);
    
    await prisma.company.update({
      where: { id: company.id },
      data: {
        gBizData: null,
        gBizLastUpdated: null
      }
    });
  }

  // 4. 統計情報
  const finalStats = await prisma.company.groupBy({
    by: ['id'],
    where: {
      gBizData: {
        not: null
      }
    },
    _count: true
  });

  console.log(`\n✅ 修正完了`);
  console.log(`住所設定済み: ${finalStats.length}社`);

  await prisma.$disconnect();
}

fixAreaCodeProblems().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
