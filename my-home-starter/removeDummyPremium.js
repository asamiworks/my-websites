const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removeDummyPremium() {
  try {
    // 大和ハウス工業と積水ハウスのisPremiumをfalseに更新
    const result = await prisma.company.updateMany({
      where: {
        OR: [
          { name: '大和ハウス工業' },
          { name: '積水ハウス' }
        ]
      },
      data: {
        isPremium: false
      }
    });
    
    console.log(`${result.count}社の有料会員ステータスを解除しました`);
    
    // 確認
    const premiumCount = await prisma.company.count({
      where: { isPremium: true }
    });
    
    console.log(`現在の有料会員数: ${premiumCount}社`);
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeDummyPremium();
