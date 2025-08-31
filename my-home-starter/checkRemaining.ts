import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkRemaining() {
  const companiesWithoutAddress = await prisma.company.findMany({
    where: {
      gBizData: {
        equals: null
      }
    },
    include: {
      serviceAreas: true
    }
  });
  
  console.log(`\n住所が設定されていない会社: ${companiesWithoutAddress.length}社\n`);
  
  companiesWithoutAddress.forEach((company, index) => {
    console.log(`${index + 1}. ${company.name}`);
    console.log(`   ID: ${company.id}`);
    console.log(`   ServiceAreas: ${company.serviceAreas.map(sa => sa.prefecture).join(', ')}`);
    console.log('');
  });
  
  await prisma.$disconnect();
}

checkRemaining();
