/**
 * クライアントの管理費と請求頻度を更新するスクリプト
 */

import { ClientService } from '../src/lib/services/clientService';

async function updateClientFees() {
  console.log('🔄 クライアント情報を更新中...\n');

  const clientService = new ClientService();

  try {
    // 全クライアントを取得
    const clients = await clientService.getAll();

    // 各クライアントを名前で検索して更新
    const updates = [
      {
        name: 'まつ建トータルサポート',
        managementFee: 6000,
        billingFrequency: 'monthly' as const,
      },
      {
        name: '株式会社足立電気',
        managementFee: 6000,
        billingFrequency: 'monthly' as const,
      },
      {
        name: '天晴れ整体院',
        managementFee: 6000,
        billingFrequency: 'monthly' as const,
      },
      {
        name: '福田 あすか',
        managementFee: 6600,
        billingFrequency: 'monthly' as const,
      },
      {
        name: '株式会社ノードベース',
        managementFee: 6600,
        billingFrequency: 'monthly' as const,
      },
      {
        name: '神宮寺',
        managementFee: 10000,
        billingFrequency: 'yearly' as const,
      },
    ];

    for (const update of updates) {
      const client = clients.find(c => c.clientName === update.name);

      if (client) {
        await clientService.update(client.id, {
          currentManagementFee: update.managementFee,
          billingFrequency: update.billingFrequency,
        });

        const frequency = update.billingFrequency === 'monthly' ? '月次' : '年次';
        console.log(`✅ ${update.name}: ${update.managementFee.toLocaleString()}円/${frequency}`);
      } else {
        console.log(`⚠️  ${update.name} が見つかりませんでした`);
      }
    }

    console.log('\n🎉 クライアント情報の更新が完了しました！');
    console.log('\n請求頻度:');
    console.log('【月次請求（毎月）】');
    console.log('  - まつ建トータルサポート: 6,000円/月');
    console.log('  - 株式会社足立電気: 6,000円/月');
    console.log('  - 天晴れ整体院: 6,000円/月');
    console.log('  - 福田 あすか様: 6,600円/月');
    console.log('  - 株式会社ノードベース: 6,600円/月');
    console.log('\n【年次請求（年1回）】');
    console.log('  - 神宮寺: 10,000円/年');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
updateClientFees();
