/**
 * 管理開始日と料金変更履歴を正確に更新するスクリプト
 */

import { ClientService } from '../src/lib/services/clientService';

async function updateManagementDates() {
  console.log('🔄 管理開始日と料金変更履歴を更新中...\n');

  const clientService = new ClientService();

  try {
    // 全クライアントを取得
    const clients = await clientService.getAll();

    // 各クライアントの管理開始日と料金情報を更新
    const updates = [
      {
        name: 'まつ建トータルサポート',
        sitePublishDate: '2025-03-16', // 管理開始日
        currentManagementFee: 6000,
        billingFrequency: 'monthly' as const,
        // 3年目以降の値下げ
        feeChanges: [
          {
            effectiveDate: '2028-03-17',
            newManagementFee: 5000,
            reason: '3年目以降の料金変更',
          }
        ],
      },
      {
        name: '神宮寺',
        sitePublishDate: '2025-05-23', // 管理開始日
        currentManagementFee: 10000,
        billingFrequency: 'yearly' as const,
        feeChanges: [],
      },
      {
        name: '株式会社足立電気',
        sitePublishDate: '2025-04-28', // 管理開始日
        currentManagementFee: 6000,
        billingFrequency: 'monthly' as const,
        feeChanges: [],
      },
      {
        name: '天晴れ整体院',
        sitePublishDate: '2025-07-24', // 管理開始日
        currentManagementFee: 6000,
        billingFrequency: 'monthly' as const,
        feeChanges: [],
      },
      {
        name: '福田 あすか',
        sitePublishDate: '2025-08-12', // 管理開始日
        currentManagementFee: 6600,
        billingFrequency: 'monthly' as const,
        feeChanges: [],
      },
      {
        name: '株式会社ノードベース',
        sitePublishDate: '2025-08-17', // 管理開始日
        currentManagementFee: 6600,
        billingFrequency: 'monthly' as const,
        feeChanges: [],
      },
    ];

    for (const update of updates) {
      const client = clients.find(c => c.clientName === update.name);

      if (client) {
        // 基本情報を更新（accumulatedDifferenceがundefinedの場合は0で初期化）
        await clientService.update(client.id, {
          sitePublishDate: update.sitePublishDate,
          currentManagementFee: update.currentManagementFee,
          billingFrequency: update.billingFrequency,
          accumulatedDifference: client.accumulatedDifference ?? 0,
        });

        // 料金変更履歴を追加
        for (const feeChange of update.feeChanges) {
          await clientService.changeFee(
            client.id,
            feeChange.newManagementFee,
            feeChange.effectiveDate,
            feeChange.reason
          );
        }

        const frequency = update.billingFrequency === 'monthly' ? '月次' : '年次';
        console.log(`✅ ${update.name}`);
        console.log(`   管理開始日: ${update.sitePublishDate}`);
        console.log(`   管理費: ${update.currentManagementFee.toLocaleString()}円/${frequency}`);

        if (update.feeChanges.length > 0) {
          update.feeChanges.forEach(change => {
            console.log(`   料金変更: ${change.effectiveDate}から ${change.newManagementFee.toLocaleString()}円 (${change.reason})`);
          });
        }
        console.log('');
      } else {
        console.log(`⚠️  ${update.name} が見つかりませんでした\n`);
      }
    }

    console.log('🎉 管理開始日と料金変更履歴の更新が完了しました！');
    console.log('\n📋 更新内容まとめ:');
    console.log('┌─────────────────────────────┬──────────────┬────────────┬──────────────────────┐');
    console.log('│ クライアント名              │ 管理開始日   │ 管理費     │ 料金変更             │');
    console.log('├─────────────────────────────┼──────────────┼────────────┼──────────────────────┤');
    console.log('│ まつ建トータルサポート      │ 2025/03/16   │ ¥6,000/月  │ 2028/03/17→¥5,000    │');
    console.log('│ 神宮寺                      │ 2025/05/23   │ ¥10,000/年 │ なし                 │');
    console.log('│ 株式会社足立電気            │ 2025/04/28   │ ¥6,000/月  │ なし                 │');
    console.log('│ 天晴れ整体院                │ 2025/07/24   │ ¥6,000/月  │ なし                 │');
    console.log('│ 福田 あすか様               │ 2025/08/12   │ ¥6,600/月  │ なし                 │');
    console.log('│ 株式会社ノードベース        │ 2025/08/17   │ ¥6,600/月  │ なし                 │');
    console.log('└─────────────────────────────┴──────────────┴────────────┴──────────────────────┘');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
updateManagementDates();
