import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_COMPANIES = [
  {
    corporateNumber: '8120001059652',
    name: '積水ハウス',
    description: '日本最大手の住宅メーカー。高品質な住宅を提供。',
  },
  {
    corporateNumber: '8120001059917',
    name: '大和ハウス工業',
    description: '総合住宅メーカー。戸建て住宅から賃貸住宅まで幅広く対応。',
  },
  {
    corporateNumber: '7010401059441',
    name: 'タマホーム',
    description: 'ローコスト住宅のパイオニア。良質な住宅を手頃な価格で提供。',
  },
];

async function main() {
  console.log('🚀 初期データのインポートを開始します...\n');

  for (const companyData of SAMPLE_COMPANIES) {
    try {
      // 会社を作成
      const company = await prisma.company.create({
        data: {
          ...companyData,
          isVerified: true,
        },
      });

      console.log(`✅ ${company.name}を登録しました`);

      // 対応エリアを追加
      await prisma.serviceArea.createMany({
        data: [
          { companyId: company.id, prefecture: '東京都', coverage: 'FULL' },
          { companyId: company.id, prefecture: '神奈川県', coverage: 'FULL' },
          { companyId: company.id, prefecture: '埼玉県', coverage: 'FULL' },
          { companyId: company.id, prefecture: '千葉県', coverage: 'FULL' },
        ],
      });

      // 価格帯を追加
      await prisma.priceRange.create({
        data: {
          companyId: company.id,
          productName: 'スタンダードプラン',
          minPrice: 60,
          maxPrice: 80,
          avgPrice: 70,
          includeItems: ['基礎工事', '外装', '内装', '基本設備'],
        },
      });

      // 特徴を追加
      await prisma.specialty.createMany({
        data: [
          { companyId: company.id, category: 'HOUSE_TYPE', value: '二階建て' },
          { companyId: company.id, category: 'STRUCTURE', value: '木造' },
          { companyId: company.id, category: 'FEATURE', value: 'ZEH対応' },
        ],
      });

    } catch (error) {
      console.error(`❌ エラー: ${companyData.name}`, error);
    }
  }

  const count = await prisma.company.count();
  console.log(`\n✨ 完了！ 登録済み会社数: ${count}社`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
