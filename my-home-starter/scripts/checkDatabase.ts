// scripts/checkDatabase.ts
// 実行方法: npx tsx scripts/checkDatabase.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('=== データベース確認 ===\n');

    // 1. 会社の総数
    const totalCompanies = await prisma.company.count();
    console.log(`会社総数: ${totalCompanies}`);

    // 2. プレミアム会社の数
    const premiumCompanies = await prisma.company.count({
      where: { isPremium: true }
    });
    console.log(`プレミアム会社数: ${premiumCompanies}`);

    // 3. サービスエリアの確認
    const serviceAreas = await prisma.serviceArea.findMany({
      take: 10,
      include: { company: true }
    });
    console.log('\nサービスエリア（最初の10件）:');
    serviceAreas.forEach(area => {
      console.log(`- ${area.company.name}: ${area.prefecture} ${area.city || '全域'}`);
    });

    // 4. 茨城県に対応している会社
    const ibarakiCompanies = await prisma.company.findMany({
      where: {
        serviceAreas: {
          some: {
            prefecture: '茨城県'
          }
        }
      },
      include: {
        serviceAreas: true,
        priceRanges: true
      }
    });
    console.log(`\n茨城県対応の会社数: ${ibarakiCompanies.length}`);
    ibarakiCompanies.forEach(company => {
      console.log(`- ${company.name} (Premium: ${company.isPremium})`);
    });

    // 5. PR枠の確認
    const prSections = await prisma.pRSection.count();
    console.log(`\nPR枠の総数: ${prSections}`);

    // 6. 価格帯の確認
    const priceRanges = await prisma.priceRange.findMany({
      take: 5,
      include: { company: true }
    });
    console.log('\n価格帯設定（最初の5件）:');
    priceRanges.forEach(range => {
      console.log(`- ${range.company.name}: ${range.minPrice}万円〜${range.maxPrice}万円`);
    });

  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();