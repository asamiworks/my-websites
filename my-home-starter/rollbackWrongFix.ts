import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function rollbackWrongFix() {
  console.log("⚠️  誤った修正をロールバックします...\n");

  // 市外局番から正しい都道府県を判定する関数
  function getPrefectureFromPhoneNumber(phoneNumber: string): string | null {
    if (!phoneNumber) return null;
    
    // 主要な市外局番のマッピング
    const areaCodeMap: { [key: string]: string } = {
      // 北海道
      '011': '北海道',
      // 東北
      '019': '岩手県',
      '0198': '岩手県',
      // 関東
      '03': '東京都',
      '04': '埼玉県',  // 04-2958は埼玉県狭山市
      '042': '東京都',
      '045': '神奈川県',
      '046': '神奈川県',
      '047': '千葉県',
      '048': '埼玉県',
      // 中部
      '052': '愛知県',
      '053': '静岡県',  // 浜松市
      '054': '静岡県',  // 静岡市
      '055': '静岡県',  // 沼津市など
      '0586': '愛知県', // 一宮市
      // 新潟
      '025': '新潟県',
      '0250': '新潟県',
      // 四国
      '088': '高知県',  // 088は高知県！
      // 九州
      '095': '長崎県',
      '096': '熊本県',
      '098': '沖縄県',
    };

    // 電話番号から市外局番を抽出してマッチング
    for (const [code, pref] of Object.entries(areaCodeMap)) {
      if (phoneNumber.startsWith(code)) {
        return pref;
      }
    }
    
    return null;
  }

  // すべての会社を取得
  const companies = await prisma.company.findMany({
    where: {
      gBizData: {
        path: ['phoneNumber'],
        not: null
      }
    }
  });

  let fixedCount = 0;
  
  for (const company of companies) {
    const gBizData = company.gBizData as any;
    if (!gBizData || !gBizData.phoneNumber) continue;
    
    const correctPrefecture = getPrefectureFromPhoneNumber(gBizData.phoneNumber);
    
    if (correctPrefecture && gBizData.prefecture !== correctPrefecture) {
      await prisma.company.update({
        where: { id: company.id },
        data: {
          gBizData: {
            ...gBizData,
            prefecture: correctPrefecture
          }
        }
      });
      
      console.log(`✅ ${company.name}: ${gBizData.prefecture} → ${correctPrefecture} (電話: ${gBizData.phoneNumber})`);
      fixedCount++;
    }
  }

  console.log(`\n✅ 合計修正数: ${fixedCount}社`);
  console.log("\n※ 市外局番に基づいて正しい都道府県に修正しました");

  await prisma.$disconnect();
}

rollbackWrongFix().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
