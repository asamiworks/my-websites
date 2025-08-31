const { PrismaClient } = require('@prisma/client');

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
    
    // 地域ごとの有料会員数も確認
    const premiumByArea = await prisma.serviceArea.findMany({
      where: {
        company: {
          isPremium: true
        }
      },
      select: {
        prefecture: true,
        city: true,
        company: {
          select: {
            name: true
          }
        }
      }
    });
    
    // 都道府県ごとに集計
    const prefectureMap = new Map();
    premiumByArea.forEach(area => {
      const key = area.prefecture;
      if (!prefectureMap.has(key)) {
        prefectureMap.set(key, new Set());
      }
      prefectureMap.get(key).add(area.company.name);
    });
    
    console.log('\n=== 都道府県別有料会員数 ===');
    if (prefectureMap.size > 0) {
      Array.from(prefectureMap.entries())
        .sort((a, b) => b[1].size - a[1].size)
        .forEach(([prefecture, companies]) => {
          console.log(`${prefecture}: ${companies.size}社`);
        });
    } else {
      console.log('地域データがありません');
    }
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPremiumCompanies();
