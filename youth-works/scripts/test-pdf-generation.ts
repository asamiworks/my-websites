import { ClientService } from '../src/lib/services/clientService';
import { CompanyService } from '../src/lib/services/companyService';
import { PDFService } from '../src/lib/services/pdfService';
import { Invoice } from '../src/lib/types';

async function generateTestPDF() {
  console.log('テスト請求書PDFを生成します...');

  const clientService = new ClientService();
  const companyService = new CompanyService();
  const pdfService = new PDFService();

  try {
    // クライアントを1件取得
    const clients = await clientService.getAll();
    if (clients.length === 0) {
      console.error('クライアントが見つかりません');
      return;
    }

    const client = clients[0];
    console.log(`クライアント: ${client.clientName}`);

    // 会社情報を取得
    const company = await companyService.get();
    if (!company) {
      console.error('会社情報が設定されていません');
      return;
    }

    // テスト請求書データを作成
    const testInvoice: Invoice = {
      id: 'test-' + Date.now(),
      invoiceNumber: 'INV-TEST-001',
      clientId: client.id,
      clientName: client.clientName,
      billingYear: 2025,
      billingMonth: 11,
      issueDate: new Date('2025-11-01').toISOString(),
      dueDate: new Date('2025-11-30').toISOString(),
      managementFee: client.currentManagementFee,
      feeStartDate: new Date('2025-10-01').toISOString(),
      feeEndDate: new Date('2025-10-31').toISOString(),
      adjustmentAmount: 0,
      subtotal: client.currentManagementFee,
      taxAmount: 0,
      totalAmount: client.currentManagementFee,
      pdfPath: 'output/test/INV-TEST-001.pdf',
      status: 'issued',
      notes: 'テスト請求書です。',
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
    console.log(`- 管理費: ¥${testInvoice.managementFee.toLocaleString()}`);
    console.log(`- 合計: ¥${testInvoice.totalAmount.toLocaleString()}`);

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

generateTestPDF();
