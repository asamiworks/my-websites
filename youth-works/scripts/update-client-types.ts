import { ClientService } from '../src/lib/services/clientService';

async function updateClientTypes() {
  console.log('クライアントタイプを更新します...');

  const clientService = new ClientService();

  try {
    const clients = await clientService.getAll();

    for (const client of clients) {
      // 名前に「株式会社」「有限会社」「合同会社」などが含まれるか、または明らかに法人名の場合は法人
      // 姓名が含まれる場合は個人
      let clientType: 'corporate' | 'individual';

      if (client.clientName.match(/(株式会社|有限会社|合同会社|一般社団法人|一般財団法人|法人|トータルサポート|整体院|メモリアルパーク)/)) {
        clientType = 'corporate';
      } else if (client.clientName.match(/\s/) || client.clientName.includes('　')) {
        // スペースが含まれる場合は個人（姓名が分かれている）
        clientType = 'individual';
      } else {
        // デフォルトは法人
        clientType = 'corporate';
      }

      await clientService.update(client.id, { clientType });
      console.log(`✓ ${client.clientName}: ${clientType === 'corporate' ? '法人' : '個人'}`);
    }

    console.log('\n✓ クライアントタイプの更新が完了しました');

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

updateClientTypes();
