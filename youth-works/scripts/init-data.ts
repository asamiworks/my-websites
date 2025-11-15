/**
 * 初期データ登録スクリプト
 * 会社情報とクライアント情報を登録します
 */

import { CompanyService } from '../src/lib/services/companyService';
import { ClientService } from '../src/lib/services/clientService';
import { CompanyFormData, ClientFormData } from '../src/lib/types';

async function initializeData() {
  console.log('🚀 初期データの登録を開始します...\n');

  const companyService = new CompanyService();
  const clientService = new ClientService();

  try {
    // 1. 会社情報の登録
    console.log('📝 会社情報を登録中...');
    const companyData: CompanyFormData = {
      name: 'AsamiWorks',
      representative: '浅見 洋輔',
      postalCode: '300-0341',
      address: '茨城県稲敷郡阿見町うずら野4-21-2 パストラル宮岡第二108',
      phone: '080-6660-4032',
      email: 'info@asami-works.com',
      website: 'https://asami-works.com',
      bankInfo: {
        bankName: '筑波銀行（0131）',
        branchName: '荒川本郷支店（142）',
        accountType: '普通',
        accountNumber: '1111756',
        accountHolder: 'Asami Works 浅見 洋輔',
      },
      paymentTerms: 30,
    };

    await companyService.save(companyData);
    console.log('✅ 会社情報を登録しました\n');

    // 2. クライアント情報の登録
    console.log('📝 クライアント情報を登録中...');

    const clients: ClientFormData[] = [
      {
        clientName: 'まつ建トータルサポート',
        siteName: 'ワイルドダートRCつくば',
        postalCode: '301-0000',
        address1: '茨城県龍ケ崎市4278番地5',
        sitePublishDate: '2025-08-10',
        initialProductionCost: 30000,
        currentManagementFee: 0, // 制作費のみの場合は管理費0
        billingFrequency: 'monthly',
        contractStartDate: '2025-08-10',
      },
      {
        clientName: '神宮寺',
        siteName: '茨城メモリアルパーク',
        postalCode: '300-4115',
        address1: '茨城県土浦市藤沢１５３５',
        sitePublishDate: '2025-05-22',
        initialProductionCost: 370000,
        currentManagementFee: 0,
        billingFrequency: 'monthly',
        contractStartDate: '2025-05-22',
      },
      {
        clientName: '株式会社足立電気',
        siteName: '株式会社足立電気',
        postalCode: '301-0012',
        address1: '茨城県龍ケ崎市上町４２７８−５',
        sitePublishDate: '2025-04-27',
        initialProductionCost: 80000,
        currentManagementFee: 0,
        billingFrequency: 'monthly',
        contractStartDate: '2025-04-27',
      },
      {
        clientName: '天晴れ整体院',
        siteName: '天晴れ整体院',
        postalCode: '301-0841',
        address1: '茨城県龍ケ崎市白羽４丁目2−１',
        sitePublishDate: '2025-07-23',
        initialProductionCost: 70000,
        currentManagementFee: 0,
        billingFrequency: 'monthly',
        contractStartDate: '2025-07-23',
      },
      {
        clientName: '福田 あすか',
        siteName: 'pilias artmake',
        postalCode: '000-0000',
        address1: '（未登録）',
        sitePublishDate: '2025-08-31',
        initialProductionCost: 55000,
        currentManagementFee: 0,
        billingFrequency: 'monthly',
        contractStartDate: '2025-08-31',
      },
      {
        clientName: '株式会社ノードベース',
        siteName: 'nodebase',
        postalCode: '000-0000',
        address1: '（未登録）',
        sitePublishDate: '2025-08-31',
        initialProductionCost: 120000,
        currentManagementFee: 0,
        billingFrequency: 'monthly',
        contractStartDate: '2025-08-31',
      },
    ];

    for (const clientData of clients) {
      const client = await clientService.create(clientData);
      console.log(`✅ ${client.clientName} を登録しました`);
    }

    console.log('\n🎉 初期データの登録が完了しました！');
    console.log('\n次のステップ:');
    console.log('1. サーバーを起動: npm run dev');
    console.log('2. ブラウザで http://localhost:3200 にアクセス');
    console.log('3. /invoices/generate で請求書を生成');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
initializeData();
