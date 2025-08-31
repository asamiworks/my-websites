import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixAdditionalProblems() {
  console.log("🔧 追加の問題を修正します...\n");

  // 1. 神奈川県の番号が埼玉県になっている問題を修正
  console.log("=== 神奈川県の番号を修正 ===");
  
  const kanagawaPrefixes = ['045', '044', '046', '0463', '0465', '0466', '0467'];
  
  for (const prefix of kanagawaPrefixes) {
    const companies = await prisma.company.findMany({
      where: {
        AND: [
          { gBizData: { path: ['phoneNumber'], string_starts_with: prefix } },
          { gBizData: { path: ['prefecture'], equals: '埼玉県' } }
        ]
      }
    });
    
    console.log(`${prefix}番号で埼玉県になっている会社: ${companies.length}社`);
    
    for (const company of companies) {
      const gBizData = company.gBizData as any;
      console.log(`修正: ${company.name} - 埼玉県 → 神奈川県`);
      
      await prisma.company.update({
        where: { id: company.id },
        data: {
          gBizData: {
            ...gBizData,
            prefecture: '神奈川県'
          }
        }
      });
    }
  }

  // 2. 佐賀県の番号が長崎県になっている問題を修正
  console.log("\n=== 佐賀県の番号を修正 ===");
  
  const sagaPrefixes = ['0952', '0954', '0955'];
  
  for (const prefix of sagaPrefixes) {
    const companies = await prisma.company.findMany({
      where: {
        AND: [
          { gBizData: { path: ['phoneNumber'], string_starts_with: prefix } },
          { gBizData: { path: ['prefecture'], equals: '長崎県' } }
        ]
      }
    });
    
    console.log(`${prefix}番号で長崎県になっている会社: ${companies.length}社`);
    
    for (const company of companies) {
      const gBizData = company.gBizData as any;
      console.log(`修正: ${company.name} - 長崎県 → 佐賀県`);
      
      await prisma.company.update({
        where: { id: company.id },
        data: {
          gBizData: {
            ...gBizData,
            prefecture: '佐賀県'
          }
        }
      });
    }
  }

  // 3. 統計を再確認
  const prefectureCounts = await prisma.company.groupBy({
    by: ['id'],
    where: {
      gBizData: {
        not: null
      }
    },
    _count: true
  });

  console.log(`\n✅ 修正完了`);
  console.log(`住所設定済み: ${prefectureCounts.length}社`);

  await prisma.$disconnect();
}

fixAdditionalProblems().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
