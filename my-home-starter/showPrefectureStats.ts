import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function showPrefectureStats() {
  const companies = await prisma.company.findMany({
    where: {
      gBizData: {
        not: null
      }
    }
  });

  const prefectureCount: { [key: string]: number } = {};
  companies.forEach(company => {
    const gBizData = company.gBizData as any;
    if (gBizData?.prefecture) {
      prefectureCount[gBizData.prefecture] = (prefectureCount[gBizData.prefecture] || 0) + 1;
    }
  });

  console.log("=== 都道府県別 会社数（全都道府県） ===\n");
  
  const sortedPrefectures = Object.entries(prefectureCount)
    .sort(([,a], [,b]) => b - a);
  
  sortedPrefectures.forEach(([pref, count], index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${pref}: ${count}社`);
  });

  console.log(`\n合計: ${companies.length}社`);
  
  await prisma.$disconnect();
}

showPrefectureStats();
