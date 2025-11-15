/**
 * すべてのクライアントの制作費を請求済みにするスクリプト
 */

import { ClientService } from '../src/lib/services/clientService';

async function markProductionInvoiced() {
  console.log('🔄 制作費を請求済みに設定中...\n');

  const clientService = new ClientService();

  try {
    // 全クライアントを取得
    const clients = await clientService.getAll();

    let updatedCount = 0;

    for (const client of clients) {
      if (!client.hasInvoicedProduction) {
        await clientService.markProductionInvoiced(client.id);
        console.log(`✅ ${client.clientName} - 制作費を請求済みに設定しました`);
        updatedCount++;
      } else {
        console.log(`⏭️  ${client.clientName} - すでに請求済みです`);
      }
    }

    console.log(`\n🎉 完了しました！ ${updatedCount}件のクライアントを更新しました。`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
markProductionInvoiced();
