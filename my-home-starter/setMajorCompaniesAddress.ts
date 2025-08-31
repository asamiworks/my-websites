import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function setMajorCompaniesAddress() {
  console.log("🏢 大手企業の住所を設定します...\n");

  const majorCompanies = [
    {
      name: "積水ハウス",
      phoneNumber: "06-6440-3111",
      prefecture: "大阪府",
      city: "大阪市北区",
      address: "大阪府大阪市北区大淀中一丁目1番88号",
      lat: 34.7055,
      lng: 135.4859
    },
    {
      name: "大和ハウス工業",
      phoneNumber: "06-6346-2111",
      prefecture: "大阪府",
      city: "大阪市北区",
      address: "大阪府大阪市北区梅田3丁目3番5号",
      lat: 34.7024,
      lng: 135.4937
    },
    {
      name: "タマホーム",
      phoneNumber: "03-6631-0300",
      prefecture: "東京都",
      city: "港区",
      address: "東京都港区高輪3丁目22番9号",
      lat: 35.6333,
      lng: 139.7366
    }
  ];

  for (const companyData of majorCompanies) {
    const company = await prisma.company.findFirst({
      where: { name: companyData.name }
    });

    if (company) {
      await prisma.company.update({
        where: { id: company.id },
        data: {
          gBizData: {
            phoneNumber: companyData.phoneNumber,
            address: companyData.address,
            prefecture: companyData.prefecture,
            city: companyData.city,
            coordinates: {
              lat: companyData.lat,
              lng: companyData.lng
            },
            source: 'manual',
            method: 'major_company_manual_entry',
            lastUpdated: new Date().toISOString()
          } as Prisma.InputJsonValue,
          gBizLastUpdated: new Date()
        }
      });
      
      console.log(`✅ ${companyData.name}: ${companyData.address}`);
    }
  }

  // ServiceAreaの重複も修正
  console.log("\n🔧 ServiceAreaの重複を修正中...");
  
  const companiesWithDuplicates = await prisma.company.findMany({
    where: {
      name: {
        in: ["積水ハウス", "大和ハウス工業", "タマホーム"]
      }
    },
    include: {
      serviceAreas: true
    }
  });

  for (const company of companiesWithDuplicates) {
    // 重複を除去
    const uniquePrefectures = [...new Set(company.serviceAreas.map(sa => sa.prefecture))];
    
    // 既存のServiceAreaを削除
    await prisma.serviceArea.deleteMany({
      where: { companyId: company.id }
    });
    
    // 重複なしで再作成
    for (const prefecture of uniquePrefectures) {
      await prisma.serviceArea.create({
        data: {
          companyId: company.id,
          prefecture: prefecture
        }
      });
    }
    
    console.log(`✅ ${company.name}: ServiceAreaの重複を解消`);
  }

  // 最終統計
  const finalCount = await prisma.company.count({
    where: {
      gBizData: {
        not: Prisma.DbNull
      }
    }
  });

  console.log(`\n📊 最終結果: ${finalCount}/5789社に住所設定完了（${(finalCount/5789*100).toFixed(2)}%）`);

  await prisma.$disconnect();
}

setMajorCompaniesAddress();
