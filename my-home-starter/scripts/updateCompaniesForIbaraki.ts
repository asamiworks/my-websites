// scripts/updateCompaniesForIbaraki.ts
// 実行方法: npx tsx scripts/updateCompaniesForIbaraki.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCompaniesForIbaraki() {
  try {
    console.log('既存の会社を茨城県対応に更新します...\n');

    // 1. 既存の会社を取得
    const companies = await prisma.company.findMany();
    
    for (const company of companies) {
      // プレミアム会員に設定（最初の2社）
      if (companies.indexOf(company) < 2) {
        await prisma.company.update({
          where: { id: company.id },
          data: { isPremium: true }
        });
        console.log(`✓ ${company.name} をプレミアム会員に設定しました`);
      }

      // 茨城県のサービスエリアを追加
      const ibarakiAreas = [
        { prefecture: '茨城県', city: '水戸市' },
        { prefecture: '茨城県', city: 'つくば市' },
        { prefecture: '茨城県', city: '日立市' },
        { prefecture: '茨城県', city: 'ひたちなか市' },
        { prefecture: '茨城県', city: null }, // 県全体
      ];

      for (const area of ibarakiAreas) {
        try {
          await prisma.serviceArea.create({
            data: {
              companyId: company.id,
              prefecture: area.prefecture,
              city: area.city,
            },
          });
          console.log(`✓ ${company.name} に ${area.prefecture} ${area.city || '全域'} を追加`);
        } catch (error) {
          // 既に存在する場合はスキップ
          if (error instanceof Error && error.message.includes('Unique constraint')) {
            continue;
          }
          throw error;
        }
      }
    }

    // 2. PR枠を作成
    const prSections = [
      {
        prefecture: '茨城県',
        city: '水戸市',
        companyName: '積水ハウス',
        description: '全国No.1の実績！茨城県で理想の住まいを実現します。モデルハウス見学会開催中！',
        contactInfo: '0120-111-222',
        displayOrder: 1,
        isActive: true,
      },
      {
        prefecture: '茨城県',
        city: '水戸市',
        companyName: '大和ハウス工業',
        description: '強い家づくりで安心の暮らしを。地震に強い家をお探しの方はぜひご相談ください。',
        contactInfo: '0120-333-444',
        displayOrder: 2,
        isActive: true,
      },
      {
        prefecture: '茨城県',
        city: 'つくば市',
        companyName: '積水ハウス',
        description: 'つくばエリアで多数の施工実績！研究学園都市にふさわしい先進的な住まいをご提案。',
        contactInfo: '0120-555-666',
        displayOrder: 1,
        isActive: true,
      },
    ];

    for (const prData of prSections) {
      await prisma.pRSection.create({
        data: prData,
      });
      console.log(`✓ PR枠を作成: ${prData.companyName} (${prData.city})`);
    }

    // 3. データベースの状態を確認
    console.log('\n=== 更新後の状態 ===');
    
    const premiumCount = await prisma.company.count({
      where: { isPremium: true }
    });
    console.log(`プレミアム会社数: ${premiumCount}`);

    const ibarakiCompanies = await prisma.company.count({
      where: {
        serviceAreas: {
          some: {
            prefecture: '茨城県'
          }
        }
      }
    });
    console.log(`茨城県対応の会社数: ${ibarakiCompanies}`);

    const prCount = await prisma.pRSection.count({
      where: {
        prefecture: '茨城県'
      }
    });
    console.log(`茨城県のPR枠数: ${prCount}`);

    console.log('\n✅ 更新が完了しました！');

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCompaniesForIbaraki();