import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPremiumCompanies() {
  try {
    // 全会社数を取得
    const totalCompanies = await prisma.company.count();
    
    // 有料会員数を取得
    const premiumCompanies = await prisma.company.count({
      where: {
        isPremium: true
      }
    });
    
    // 無料会員数を取得
    const freeCompanies = await prisma.company.count({
      where: {
        isPremium: false
      }
    });
    
    // 有料会員の詳細情報を取得
    const premiumCompaniesList = await prisma.company.findMany({
      where: {
        isPremium: true
      },
      select: {
        id: true,
        name: true,
        isPremium: true,
        createdAt: true
      }
    });
    
    console.log('=== 会社登録状況 ===');
    console.log(`全会社数: ${totalCompanies}`);
    console.log(`有料会員数: ${premiumCompanies}`);
    console.log(`無料会員数: ${freeCompanies}`);
    console.log(`有料会員率: ${totalCompanies > 0 ? (premiumCompanies / totalCompanies * 100).toFixed(1) : 0}%`);
    
    console.log('\n=== 有料会員一覧 ===');
    if (premiumCompaniesList.length > 0) {
      premiumCompaniesList.forEach((company, index) => {
        console.log(`${index + 1}. ${company.name} (ID: ${company.id})`);
      });
    } else {
      console.log('有料会員はまだ登録されていません');
    }
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPremiumCompanies();
