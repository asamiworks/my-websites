import { ClientService } from '../src/lib/services/clientService';
import { CompanyService } from '../src/lib/services/companyService';
import { PDFService } from '../src/lib/services/pdfService';
import { Invoice } from '../src/lib/types';

async function generateAdachiTestPDF() {
  console.log('株式会社足立電気のテスト請求書PDFを生成します...');

  const clientService = new ClientService();
  const companyService = new CompanyService();
  const pdfService = new PDFService();

  try {
    // 株式会社足立電気を取得
    const clients = await clientService.getAll();
    const adachiClient = clients.find(c => c.clientName.includes('足立電気'));

    if (!adachiClient) {
      console.error('株式会社足立電気が見つかりません');
      return;
    }

    console.log(`クライアント: ${adachiClient.clientName}`);
    console.log(`月額管理費: ¥${adachiClient.currentManagementFee.toLocaleString()}`);

    // 会社情報を取得
    const company = await companyService.get();
    if (!company) {
      console.error('会社情報が設定されていません');
      return;
    }

    // 2ヶ月分まとめて請求（9月分 + 10月分）
    const twoMonthsFee = adachiClient.currentManagementFee * 2;

    // テスト請求書データを作成
    const testInvoice: Invoice = {
      id: 'test-adachi-' + Date.now(),
      invoiceNumber: 'INV-TEST-ADACHI-001',
      clientId: adachiClient.id,
      clientName: adachiClient.clientName,
      billingYear: 2025,
      billingMonth: 11, // 11月発行
      issueDate: new Date('2025-11-01').toISOString(), // 発行日: 2025年11月01日
      dueDate: new Date('2025-11-30').toISOString(), // 支払期限: 2025年11月30日
      managementFee: twoMonthsFee, // 2ヶ月分
      quantity: 2, // 2ヶ月分
      feeStartDate: new Date('2025-09-01').toISOString(), // 2025/09/01 開始
      feeEndDate: new Date('2025-10-31').toISOString(), // 2025/10/31 終了
      adjustmentAmount: 0,
      subtotal: twoMonthsFee,
      taxAmount: 0,
      totalAmount: twoMonthsFee,
      pdfPath: 'output/test/INV-TEST-ADACHI-2MONTHS.pdf',
      status: 'issued',
      notes: '2ヶ月分まとめて請求',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('PDFを生成中...');
    const filePath = await pdfService.generateAndSave(testInvoice);

    console.log('\n✓ テスト請求書PDFを生成しました');
    console.log(`保存先: ${filePath}`);
    console.log('\n請求書内容:');
    console.log(`- クライアント: ${testInvoice.clientName}`);
    console.log(`- 請求書番号: ${testInvoice.invoiceNumber}`);
    console.log(`- 発行日: ${new Date(testInvoice.issueDate).toLocaleDateString('ja-JP')}`);
    console.log(`- 支払期限: ${new Date(testInvoice.dueDate).toLocaleDateString('ja-JP')}`);
    console.log(`- サービス期間: ${new Date(testInvoice.feeStartDate).toLocaleDateString('ja-JP')} 〜 ${new Date(testInvoice.feeEndDate).toLocaleDateString('ja-JP')}`);
    console.log(`- 管理費（2ヶ月分）: ¥${testInvoice.managementFee.toLocaleString()}`);
    console.log(`- 合計: ¥${testInvoice.totalAmount.toLocaleString()}`);
    console.log(`- 備考: ${testInvoice.notes}`);

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

generateAdachiTestPDF();
