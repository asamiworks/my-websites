/**
 * 各クライアントの入金済み期間を設定するスクリプト
 */

import { ClientService } from '../src/lib/services/clientService';

async function setPaidPeriods() {
  console.log('🔄 入金済み期間を設定中...\n');

  const clientService = new ClientService();

  try {
    // 全クライアントを取得
    const clients = await clientService.getAll();

    // 各クライアントの入金状況
    const paidPeriods = [
      {
        name: 'まつ建トータルサポート',
        lastPaidPeriod: '2025-09', // 2025年9月分まで入金済み
      },
      {
        name: '神宮寺',
        lastPaidPeriod: undefined, // 未入金（年払い、管理開始から1年後に請求）
      },
      {
        name: '株式会社足立電気',
        lastPaidPeriod: '2025-08', // 2025年8月分まで入金済み
      },
      {
        name: '天晴れ整体院',
        lastPaidPeriod: '2025-08', // 2025年8月分まで入金済み
      },
      {
        name: '福田 あすか',
        lastPaidPeriod: '2025-09', // 2025年9月分まで入金済み
      },
      {
        name: '株式会社ノードベース',
        lastPaidPeriod: '2025-09', // 2025年9月分まで入金済み
      },
    ];

    for (const paidInfo of paidPeriods) {
      const client = clients.find(c => c.clientName === paidInfo.name);

      if (client) {
        if (paidInfo.lastPaidPeriod) {
          await clientService.updateLastPaidPeriod(client.id, paidInfo.lastPaidPeriod);
          console.log(`✅ ${paidInfo.name}: ${paidInfo.lastPaidPeriod}まで入金済み`);
        } else {
          console.log(`✅ ${paidInfo.name}: 未入金（年払い）`);
        }
      } else {
        console.log(`⚠️  ${paidInfo.name} が見つかりませんでした`);
      }
    }

    console.log('\n🎉 入金済み期間の設定が完了しました！');
    console.log('\n📋 設定内容まとめ:');
    console.log('┌─────────────────────────────┬──────────────────┐');
    console.log('│ クライアント名              │ 最終入金期間     │');
    console.log('├─────────────────────────────┼──────────────────┤');
    console.log('│ まつ建トータルサポート      │ 2025年9月まで    │');
    console.log('│ 神宮寺                      │ 未入金（年払い） │');
    console.log('│ 株式会社足立電気            │ 2025年8月まで    │');
    console.log('│ 天晴れ整体院                │ 2025年8月まで    │');
    console.log('│ 福田 あすか様               │ 2025年9月まで    │');
    console.log('│ 株式会社ノードベース        │ 2025年9月まで    │');
    console.log('└─────────────────────────────┴──────────────────┘');
    console.log('\n📝 次回請求予定（10月31日締め、11月1日発行）:');
    console.log('  - まつ建: 10月分（1ヶ月）');
    console.log('  - 神宮寺: なし（2026/05に年払い請求）');
    console.log('  - 足立電気: 9月・10月分（2ヶ月）');
    console.log('  - 天晴れ: 9月・10月分（2ヶ月）');
    console.log('  - 福田: 10月分（1ヶ月）');
    console.log('  - ノードベース: 10月分（1ヶ月）');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
setPaidPeriods();
