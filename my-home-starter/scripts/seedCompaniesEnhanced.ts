import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HOUSING_COMPANIES = [
  {
    corporateNumber: '8120001059652',
    name: '積水ハウス',
    nameKana: 'セキスイハウス',
    description: '日本最大手の総合住宅メーカー。高品質・高性能な住宅を提供し、環境配慮型住宅の開発にも注力。',
    establishedDate: new Date('1960-08-01'),
    capital: BigInt(20269000000),
    employees: 16000,
    website: 'https://www.sekisuihouse.co.jp/',
    isVerified: true,
    isPremium: true,
    serviceAreas: [
      { prefecture: '東京都', coverage: 'FULL' },
      { prefecture: '神奈川県', coverage: 'FULL' },
      { prefecture: '埼玉県', coverage: 'FULL' },
      { prefecture: '千葉県', coverage: 'FULL' },
      { prefecture: '大阪府', coverage: 'FULL' },
      { prefecture: '愛知県', coverage: 'FULL' },
    ],
    priceRanges: [
      {
        productName: 'イズ・ロイエ',
        minPrice: 90,
        maxPrice: 120,
        avgPrice: 105,
        includeItems: ['基礎工事', '躯体工事', '外装', '内装', '設備', '外構'],
      },
      {
        productName: 'ビー・サイエ',
        minPrice: 70,
        maxPrice: 90,
        avgPrice: 80,
        includeItems: ['基礎工事', '躯体工事', '外装', '内装', '設備'],
      },
    ],
    specialties: [
      { category: 'HOUSE_TYPE', value: '二階建て' },
      { category: 'HOUSE_TYPE', value: '平屋' },
      { category: 'HOUSE_TYPE', value: '三階建て' },
      { category: 'STRUCTURE', value: '鉄骨造' },
      { category: 'STRUCTURE', value: '木造' },
      { category: 'FEATURE', value: 'ZEH対応' },
      { category: 'FEATURE', value: '制震システム' },
      { category: 'FEATURE', value: '太陽光発電' },
      { category: 'FEATURE', value: '全館空調' },
    ],
  },
  {
    corporateNumber: '8120001059917',
    name: '大和ハウス工業',
    nameKana: 'ダイワハウスコウギョウ',
    description: '総合住宅メーカーとして戸建て住宅から賃貸住宅、商業施設まで幅広く手がける。xevoシリーズが人気。',
    establishedDate: new Date('1955-04-05'),
    capital: BigInt(16154000000),
    employees: 18000,
    website: 'https://www.daiwahouse.co.jp/',
    isVerified: true,
    isPremium: true,
    serviceAreas: [
      { prefecture: '東京都', coverage: 'FULL' },
      { prefecture: '神奈川県', coverage: 'FULL' },
      { prefecture: '埼玉県', coverage: 'FULL' },
      { prefecture: '千葉県', coverage: 'FULL' },
      { prefecture: '大阪府', coverage: 'FULL' },
      { prefecture: '愛知県', coverage: 'FULL' },
      { prefecture: '福岡県', coverage: 'FULL' },
    ],
    priceRanges: [
      {
        productName: 'xevo Σ（ジーヴォシグマ）',
        minPrice: 85,
        maxPrice: 110,
        avgPrice: 95,
        includeItems: ['基礎工事', '躯体工事', '外装', '内装', '設備', '外構'],
      },
      {
        productName: 'xevo GranWood',
        minPrice: 75,
        maxPrice: 95,
        avgPrice: 85,
        includeItems: ['基礎工事', '躯体工事', '外装', '内装', '設備'],
      },
    ],
    specialties: [
      { category: 'HOUSE_TYPE', value: '二階建て' },
      { category: 'HOUSE_TYPE', value: '平屋' },
      { category: 'HOUSE_TYPE', value: '三階建て' },
      { category: 'STRUCTURE', value: '鉄骨造' },
      { category: 'STRUCTURE', value: '木造' },
      { category: 'FEATURE', value: 'ZEH対応' },
      { category: 'FEATURE', value: '耐震等級3' },
      { category: 'FEATURE', value: '外張り断熱' },
      { category: 'FEATURE', value: '蓄電池対応' },
    ],
  },
  {
    corporateNumber: '7010401059441',
    name: 'タマホーム',
    nameKana: 'タマホーム',
    description: 'ローコスト住宅のパイオニア。「大安心の家」シリーズで、良質な住宅を手頃な価格で提供。',
    establishedDate: new Date('1998-06-03'),
    capital: BigInt(4310000000),
    employees: 3500,
    website: 'https://www.tamahome.jp/',
    isVerified: true,
    isPremium: false,
    serviceAreas: [
      { prefecture: '東京都', coverage: 'FULL' },
      { prefecture: '神奈川県', coverage: 'FULL' },
      { prefecture: '埼玉県', coverage: 'FULL' },
      { prefecture: '千葉県', coverage: 'FULL' },
      { prefecture: '愛知県', coverage: 'FULL' },
      { prefecture: '大阪府', coverage: 'FULL' },
      { prefecture: '福岡県', coverage: 'FULL' },
    ],
    priceRanges: [
      {
        productName: '大安心の家',
        minPrice: 50,
        maxPrice: 65,
        avgPrice: 58,
        includeItems: ['基礎工事', '躯体工事', '外装', '内装', '基本設備'],
      },
      {
        productName: '木麗な家',
        minPrice: 45,
        maxPrice: 55,
        avgPrice: 50,
        includeItems: ['基礎工事', '躯体工事', '外装', '内装', '基本設備'],
      },
    ],
    specialties: [
      { category: 'HOUSE_TYPE', value: '二階建て' },
      { category: 'HOUSE_TYPE', value: '平屋' },
      { category: 'STRUCTURE', value: '木造' },
      { category: 'FEATURE', value: 'ローコスト住宅' },
      { category: 'FEATURE', value: '長期優良住宅' },
      { category: 'FEATURE', value: '省エネ基準適合' },
    ],
  },
  {
    corporateNumber: '7180001003632',
    name: '一条工務店',
    nameKana: 'イチジョウコウムテン',
    description: '「家は、性能。」をコンセプトに、高断熱・高気密住宅を提供。i-smartシリーズが人気。',
    establishedDate: new Date('1978-09-01'),
    capital: BigInt(545000000),
    employees: 5600,
    website: 'https://www.ichijo.co.jp/',
    isVerified: true,
    isPremium: true,
    serviceAreas: [
      { prefecture: '東京都', coverage: 'FULL' },
      { prefecture: '神奈川県', coverage: 'FULL' },
      { prefecture: '埼玉県', coverage: 'FULL' },
      { prefecture: '千葉県', coverage: 'FULL' },
      { prefecture: '静岡県', coverage: 'FULL' },
      { prefecture: '愛知県', coverage: 'FULL' },
    ],
    priceRanges: [
      {
        productName: 'i-smart',
        minPrice: 75,
        maxPrice: 90,
        avgPrice: 82,
        includeItems: ['基礎工事', '躯体工事', '外装', '内装', '設備', '全館床暖房'],
      },
      {
        productName: 'グラン・セゾン',
        minPrice: 80,
        maxPrice: 100,
        avgPrice: 90,
        includeItems: ['基礎工事', '躯体工事', '外装', '内装', '設備', '全館床暖房'],
      },
    ],
    specialties: [
      { category: 'HOUSE_TYPE', value: '二階建て' },
      { category: 'HOUSE_TYPE', value: '平屋' },
      { category: 'STRUCTURE', value: '木造' },
      { category: 'FEATURE', value: '高気密高断熱' },
      { category: 'FEATURE', value: '全館床暖房' },
      { category: 'FEATURE', value: 'ZEH対応' },
      { category: 'FEATURE', value: '太陽光発電' },
    ],
  },
  {
    corporateNumber: '5011101003872',
    name: '三井ホーム',
    nameKana: 'ミツイホーム',
    description: 'ツーバイフォー工法のパイオニア。デザイン性の高い注文住宅を提供。',
    establishedDate: new Date('1974-10-11'),
    capital: BigInt(13900000000),
    employees: 2200,
    website: 'https://www.mitsuihome.co.jp/',
    isVerified: true,
    isPremium: true,
    serviceAreas: [
      { prefecture: '東京都', coverage: 'FULL' },
      { prefecture: '神奈川県', coverage: 'FULL' },
      { prefecture: '埼玉県', coverage: 'FULL' },
      { prefecture: '千葉県', coverage: 'FULL' },
    ],
    priceRanges: [
      {
        productName: 'LUCAS（ルーカス）',
        minPrice: 85,
        maxPrice: 110,
        avgPrice: 95,
        includeItems: ['基礎工事', '躯体工事', '外装', '内装', '設備', 'デザイン設計'],
      },
    ],
    specialties: [
      { category: 'HOUSE_TYPE', value: '二階建て' },
      { category: 'HOUSE_TYPE', value: '三階建て' },
      { category: 'STRUCTURE', value: '木造' },
      { category: 'FEATURE', value: 'ツーバイフォー工法' },
      { category: 'FEATURE', value: 'デザイン住宅' },
      { category: 'FEATURE', value: 'ZEH対応' },
    ],
  },
];

// サンプルレビューデータ
const SAMPLE_REVIEWS = [
  {
    contractYear: 2023,
    completionYear: 2024,
    prefecture: '東京都',
    city: '世田谷区',
    totalPrice: 3500,
    pricePerTsubo: 85,
    houseSize: 41.2,
    overallRating: 4.5,
    priceRating: 4.0,
    qualityRating: 5.0,
    serviceRating: 4.5,
    title: '理想の家づくりができました',
    content: '営業担当の方が親身になって相談に乗ってくれ、予算内で理想の家を建てることができました。',
    pros: '断熱性能が高い、アフターサービスが充実',
    cons: '工期が予定より少し延びた',
    isVerified: true,
  },
  {
    contractYear: 2022,
    completionYear: 2023,
    prefecture: '神奈川県',
    city: '横浜市',
    totalPrice: 2800,
    pricePerTsubo: 70,
    houseSize: 40.0,
    overallRating: 4.0,
    priceRating: 4.5,
    qualityRating: 4.0,
    serviceRating: 3.5,
    title: 'コストパフォーマンスが良い',
    content: '予算を抑えながらも、満足のいく家を建てることができました。',
    pros: '価格が手頃、基本性能がしっかりしている',
    cons: 'オプション費用が高め',
    isVerified: true,
  },
];

async function main() {
  console.log('🚀 充実した住宅会社データのインポートを開始します...\n');

  // 既存データをクリア（開発環境のみ）
  if (process.env.NODE_ENV === 'development') {
    console.log('既存データをクリアしています...');
    await prisma.review.deleteMany();
    await prisma.specialty.deleteMany();
    await prisma.priceRange.deleteMany();
    await prisma.serviceArea.deleteMany();
    await prisma.company.deleteMany();
  }

  for (const companyData of HOUSING_COMPANIES) {
    try {
      console.log(`\n📝 ${companyData.name}を登録中...`);

      const { serviceAreas, priceRanges, specialties, ...company } = companyData;

      // 会社を作成
      const createdCompany = await prisma.company.create({
        data: company,
      });

      // 対応エリアを追加
      if (serviceAreas.length > 0) {
        await prisma.serviceArea.createMany({
          data: serviceAreas.map((area) => ({
            ...area,
            companyId: createdCompany.id,
          })),
        });
        console.log(`  ✓ ${serviceAreas.length}件の対応エリアを追加`);
      }

      // 価格帯を追加
      if (priceRanges.length > 0) {
        await prisma.priceRange.createMany({
          data: priceRanges.map((range) => ({
            ...range,
            companyId: createdCompany.id,
          })),
        });
        console.log(`  ✓ ${priceRanges.length}件の価格帯を追加`);
      }

      // 特徴を追加
      if (specialties.length > 0) {
        await prisma.specialty.createMany({
          data: specialties.map((specialty) => ({
            ...specialty,
            companyId: createdCompany.id,
          })),
        });
        console.log(`  ✓ ${specialties.length}件の特徴を追加`);
      }

      // 最初の2社にサンプルレビューを追加
      if (HOUSING_COMPANIES.indexOf(companyData) < 2) {
        const review = SAMPLE_REVIEWS[HOUSING_COMPANIES.indexOf(companyData)];
        await prisma.review.create({
          data: {
            ...review,
            companyId: createdCompany.id,
          },
        });
        console.log(`  ✓ サンプルレビューを追加`);
      }

      console.log(`✅ ${company.name}の登録が完了しました`);
    } catch (error) {
      console.error(`❌ エラー: ${companyData.name}`, error);
    }
  }

  // 統計情報を表示
  const stats = await prisma.company.count();
  const areaStats = await prisma.serviceArea.count();
  const priceStats = await prisma.priceRange.count();
  const reviewStats = await prisma.review.count();

  console.log('\n📊 登録完了統計:');
  console.log(`  - 会社数: ${stats}社`);
  console.log(`  - 対応エリア: ${areaStats}件`);
  console.log(`  - 価格帯: ${priceStats}件`);
  console.log(`  - レビュー: ${reviewStats}件`);
  console.log('\n✨ データインポートが完了しました！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
