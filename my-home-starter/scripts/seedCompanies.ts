// scripts/seedCompanies.ts
// 実行方法: npx tsx scripts/seedCompanies.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCompanies() {
  try {
    console.log('住宅会社のサンプルデータを投入します...\n');

    // サンプル住宅会社データ
    const companies = [
      {
        corporateNumber: '1234567890123',
        name: '茨城ハウス工業',
        nameKana: 'イバラキハウスコウギョウ',
        description: '茨城県で50年の実績を持つ地域密着型の住宅会社です。',
        isPremium: true,
        website: 'https://example-ibaraki-house.com',
      },
      {
        corporateNumber: '2345678901234',
        name: '水戸ホーム',
        nameKana: 'ミトホーム',
        description: '水戸市を中心に高品質な注文住宅を提供しています。',
        isPremium: true,
        website: 'https://example-mito-home.com',
      },
      {
        corporateNumber: '3456789012345',
        name: '関東住建',
        nameKana: 'カントウジュウケン',
        description: '関東一円で展開する大手住宅メーカーです。',
        isPremium: true,
        website: 'https://example-kanto-juken.com',
      },
      {
        corporateNumber: '4567890123456',
        name: 'つくば工務店',
        nameKana: 'ツクバコウムテン',
        description: '自然素材にこだわった家づくりを提案します。',
        isPremium: false,
        website: 'https://example-tsukuba.com',
      },
      {
        corporateNumber: '5678901234567',
        name: '日立建設',
        nameKana: 'ヒタチケンセツ',
        description: '耐震性能にこだわった安心・安全な住まいづくり。',
        isPremium: true,
        website: 'https://example-hitachi-kensetsu.com',
      },
      {
        corporateNumber: '6789012345678',
        name: '土浦ホームズ',
        nameKana: 'ツチウラホームズ',
        description: 'コストパフォーマンスに優れた注文住宅を提供。',
        isPremium: true,
        website: 'https://example-tsuchiura-homes.com',
      },
      {
        corporateNumber: '7890123456789',
        name: '取手工務店',
        nameKana: 'トリデコウムテン',
        description: '地元の木材を使用した温もりある家づくり。',
        isPremium: false,
        website: null,
      },
      {
        corporateNumber: '8901234567890',
        name: '牛久住宅',
        nameKana: 'ウシクジュウタク',
        description: 'デザイン性と機能性を両立した住まいを提案。',
        isPremium: true,
        website: 'https://example-ushiku.com',
      },
    ];

    for (const companyData of companies) {
      // 会社を作成または更新
      const company = await prisma.company.upsert({
        where: { corporateNumber: companyData.corporateNumber },
        update: {},
        create: companyData,
      });

      console.log(`✓ ${company.name} を作成/更新しました`);

      // サービスエリアを追加（会社によって異なるエリアを設定）
      let serviceAreas: { prefecture: string; city: string | null }[] = [];
      
      if (company.name === '茨城ハウス工業' || company.name === '関東住建') {
        // 県全体をカバー
        serviceAreas = [
          { prefecture: '茨城県', city: null },
        ];
      } else if (company.name === '水戸ホーム') {
        serviceAreas = [
          { prefecture: '茨城県', city: '水戸市' },
          { prefecture: '茨城県', city: 'ひたちなか市' },
          { prefecture: '茨城県', city: '笠間市' },
        ];
      } else if (company.name === 'つくば工務店') {
        serviceAreas = [
          { prefecture: '茨城県', city: 'つくば市' },
          { prefecture: '茨城県', city: 'つくばみらい市' },
          { prefecture: '茨城県', city: '守谷市' },
        ];
      } else if (company.name === '日立建設') {
        serviceAreas = [
          { prefecture: '茨城県', city: '日立市' },
          { prefecture: '茨城県', city: '高萩市' },
          { prefecture: '茨城県', city: '北茨城市' },
        ];
      } else if (company.name === '土浦ホームズ') {
        serviceAreas = [
          { prefecture: '茨城県', city: '土浦市' },
          { prefecture: '茨城県', city: 'かすみがうら市' },
          { prefecture: '茨城県', city: '石岡市' },
        ];
      } else if (company.name === '取手工務店') {
        serviceAreas = [
          { prefecture: '茨城県', city: '取手市' },
          { prefecture: '茨城県', city: '龍ケ崎市' },
        ];
      } else if (company.name === '牛久住宅') {
        serviceAreas = [
          { prefecture: '茨城県', city: '牛久市' },
          { prefecture: '茨城県', city: '阿見町' },
          { prefecture: '茨城県', city: '稲敷市' },
        ];
      }

      for (const area of serviceAreas) {
        await prisma.serviceArea.upsert({
          where: {
            companyId_prefecture_city: {
              companyId: company.id,
              prefecture: area.prefecture,
              city: area.city,
            },
          },
          update: {},
          create: {
            companyId: company.id,
            prefecture: area.prefecture,
            city: area.city,
          },
        });
      }

      // 価格帯を追加（プレミアム会社のみ、会社によって価格帯を変える）
      if (company.isPremium) {
        let priceData = {
          companyId: company.id,
          productName: '標準プラン',
          minPrice: 2000,
          maxPrice: 3000,
          includeItems: ['基本工事費', '設計費', '諸経費'],
        };

        // 会社によって価格帯を変更
        if (company.name === '関東住建') {
          priceData = {
            ...priceData,
            minPrice: 2500,
            maxPrice: 4000,
            includeItems: ['基本工事費', '設計費', '諸経費', '外構工事費'],
          };
        } else if (company.name === '水戸ホーム') {
          priceData = {
            ...priceData,
            minPrice: 1800,
            maxPrice: 2800,
          };
        } else if (company.name === '土浦ホームズ') {
          priceData = {
            ...priceData,
            minPrice: 1500,
            maxPrice: 2500,
          };
        } else if (company.name === '牛久住宅') {
          priceData = {
            ...priceData,
            minPrice: 2200,
            maxPrice: 3500,
            includeItems: ['基本工事費', '設計費', '諸経費', 'デザイン料'],
          };
        }

        await prisma.priceRange.create({
          data: priceData,
        });
      }

      // 専門分野を追加（会社によって異なる専門分野）
      let specialties: string[] = [];
      
      if (company.name === '茨城ハウス工業') {
        specialties = ['注文住宅', '高気密高断熱', 'ZEH住宅', '長期優良住宅'];
      } else if (company.name === '水戸ホーム') {
        specialties = ['注文住宅', 'ローコスト住宅', '子育て世代向け'];
      } else if (company.name === '関東住建') {
        specialties = ['注文住宅', '高級住宅', 'デザイナーズ住宅', 'ZEH住宅'];
      } else if (company.name === 'つくば工務店') {
        specialties = ['注文住宅', '自然素材', '健康住宅', '木造住宅'];
      } else if (company.name === '日立建設') {
        specialties = ['注文住宅', '耐震住宅', '鉄骨造', '防災住宅'];
      } else if (company.name === '土浦ホームズ') {
        specialties = ['注文住宅', 'ローコスト住宅', '規格住宅'];
      } else if (company.name === '取手工務店') {
        specialties = ['注文住宅', '和風住宅', '木造住宅'];
      } else if (company.name === '牛久住宅') {
        specialties = ['注文住宅', 'デザイナーズ住宅', 'モダン住宅', 'スマートホーム'];
      }
      for (const specialty of specialties) {
        await prisma.specialty.upsert({
          where: {
            companyId_category_value: {
              companyId: company.id,
              category: '得意分野',
              value: specialty,
            },
          },
          update: {},
          create: {
            companyId: company.id,
            category: '得意分野',
            value: specialty,
          },
        });
      }
    }

    // PR枠のサンプルデータ（各地域に追加）
    const prSections = [
      {
        prefecture: '茨城県',
        city: '水戸市',
        companyName: '茨城ハウス工業',
        description: '創業50年の実績！地域No.1の施工実績を誇ります。無料相談会実施中！',
        contactInfo: '0120-123-456',
        displayOrder: 1,
        isActive: true,
      },
      {
        prefecture: '茨城県',
        city: '水戸市',
        companyName: '水戸ホーム',
        description: '高品質×低価格を実現！月々5万円台から理想の家づくりをサポート。',
        contactInfo: '0120-234-567',
        displayOrder: 2,
        isActive: true,
      },
      {
        prefecture: '茨城県',
        city: 'つくば市',
        companyName: 'つくば工務店',
        description: '自然素材100%の健康住宅。アレルギー対策も万全です。',
        contactInfo: '029-xxx-xxxx',
        displayOrder: 1,
        isActive: true,
      },
      {
        prefecture: '茨城県',
        city: 'つくば市',
        companyName: '関東住建',
        description: '最新の住宅設備と洗練されたデザインで理想の住まいを実現。',
        contactInfo: '0120-345-678',
        displayOrder: 2,
        isActive: true,
      },
      {
        prefecture: '茨城県',
        city: '日立市',
        companyName: '日立建設',
        description: '耐震等級3標準！大切な家族を守る強い家づくり。',
        contactInfo: '0294-xxx-xxxx',
        displayOrder: 1,
        isActive: true,
      },
      {
        prefecture: '茨城県',
        city: '土浦市',
        companyName: '土浦ホームズ',
        description: '土地探しから資金計画まで、家づくりをトータルサポート！',
        contactInfo: '029-xxx-xxxx',
        displayOrder: 1,
        isActive: true,
      },
    ];

    for (const prData of prSections) {
      await prisma.pRSection.create({
        data: prData,
      });
      console.log(`✓ PR枠: ${prData.companyName} を作成しました`);
    }

    console.log('\n✅ サンプルデータの投入が完了しました！');
    console.log(`\n📊 投入データ統計:`);
    console.log(`  - 住宅会社: ${companies.length}社`);
    console.log(`  - PR枠: ${prSections.length}件`);
    console.log(`\n🔍 データ確認方法:`);
    console.log(`  - 水戸市のページ: http://localhost:3000/area/ibaraki/mito-shi`);
    console.log(`  - つくば市のページ: http://localhost:3000/area/ibaraki/tsukuba-shi`);
    console.log(`  - 日立市のページ: http://localhost:3000/area/ibaraki/hitachi-shi`);
    console.log(`  - 土浦市のページ: http://localhost:3000/area/ibaraki/tsuchiura-shi`);

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCompanies();