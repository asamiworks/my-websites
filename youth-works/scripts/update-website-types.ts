import { ClientService } from '../src/lib/services/clientService';
import { WebsiteType } from '../src/lib/types/client';

async function updateWebsiteTypes() {
  console.log('クライアントのウェブサイト種別を更新します...\n');

  const clientService = new ClientService();

  try {
    // 全クライアントを取得
    const clients = await clientService.getAll();

    // ウェブサイト種別のマッピング
    const websiteTypeMapping: Record<string, WebsiteType> = {
      'まつ建トータルサポート': 'landingpage',
      '株式会社足立電気': 'homepage',
      '天晴れ整体院': 'landingpage',
      '福田 あすか': 'homepage',
      '株式会社ノードベース': 'homepage',
      '神宮寺': 'homepage', // デフォルトはHP
    };

    let updateCount = 0;

    for (const client of clients) {
      const websiteType = websiteTypeMapping[client.clientName] || 'homepage';

      // websiteTypeが未設定または異なる場合のみ更新
      if (!client.websiteType || client.websiteType !== websiteType) {
        const updatedClient = {
          ...client,
          websiteType,
          updatedAt: new Date().toISOString(),
        };

        await clientService.update(client.id, updatedClient);

        const typeLabel = websiteType === 'homepage' ? 'ホームページ' : 'ランディングページ';
        console.log(`✓ ${client.clientName}: ${typeLabel}`);
        updateCount++;
      } else {
        const typeLabel = websiteType === 'homepage' ? 'ホームページ' : 'ランディングページ';
        console.log(`  ${client.clientName}: ${typeLabel} (変更なし)`);
      }
    }

    console.log(`\n${updateCount}件のクライアントデータを更新しました。`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    throw error;
  }
}

updateWebsiteTypes();
