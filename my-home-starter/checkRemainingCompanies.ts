import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function checkRemaining() {
  const companiesWithoutAddress = await prisma.company.findMany({
    where: {
      gBizData: {
        equals: Prisma.DbNull
      }
    },
    include: {
      serviceAreas: true
    }
  });
  
  console.log(`\n住所が設定されていない会社: ${companiesWithoutAddress.length}社\n`);
  
  // ServiceArea別に集計
  const byServiceArea: { [key: string]: number } = {};
  companiesWithoutAddress.forEach(company => {
    const areas = company.serviceAreas.map(sa => sa.prefecture).join(', ') || 'なし';
    byServiceArea[areas] = (byServiceArea[areas] || 0) + 1;
  });
  
  console.log("=== ServiceArea別分布 ===");
  Object.entries(byServiceArea)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .forEach(([area, count]) => {
      console.log(`${area}: ${count}社`);
    });
  
  // ランダムに10社表示
  console.log("\n=== サンプル（10社） ===");
  companiesWithoutAddress
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .forEach((company, index) => {
      console.log(`\n${index + 1}. ${company.name}`);
      console.log(`   ID: ${company.id}`);
      console.log(`   ServiceAreas: ${company.serviceAreas.map(sa => sa.prefecture).join(', ')}`);
    });
  
  await prisma.$disconnect();
}

checkRemaining();
