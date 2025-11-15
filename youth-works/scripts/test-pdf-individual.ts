import { ClientService } from '../src/lib/services/clientService';
import { CompanyService } from '../src/lib/services/companyService';
import { PDFService } from '../src/lib/services/pdfService';
import { Invoice } from '../src/lib/types';

async function generateTestPDFIndividual() {
  console.log('個人クライアントのテスト請求書PDFを生成します...');

  const clientService = new ClientService();
  const companyService = new CompanyService();
  const pdfService = new PDFService();

  try {
    // 個人クライアント（福田 あすか）を取得
    const clients = await clientService.getAll();
    const individualClient = clients.find(c => c.clientType === 'individual');

    if (!individualClient) {
      console.error('個人クライアントが見つかりません');
      return;
    }

    console.log(`クライアント: ${individualClient.clientName} (個人)`);

    // 会社情報を取得
    const company = await companyService.get();
    if (!company) {
      console.error('会社情報が設定されていません');
      return;
    }

    // テスト請求書データを作成
    const testInvoice: Invoice = {
      id: 'test-individual-' + Date.now(),
      invoiceNumber: 'INV-TEST-002',
      clientId: individualClient.id,
      clientName: individualClient.clientName,
      billingYear: 2025,
      billingMonth: 11,
      issueDate: new Date('2025-11-01').toISOString(),
      dueDate: new Date('2025-11-30').toISOString(),
      managementFee: individualClient.currentManagementFee,
      feeStartDate: new Date('2025-10-01').toISOString(),
      feeEndDate: new Date('2025-10-31').toISOString(),
      adjustmentAmount: 0,
      subtotal: individualClient.currentManagementFee,
      taxAmount: 0,
      totalAmount: individualClient.currentManagementFee,
      pdfPath: 'output/test/INV-TEST-002-INDIVIDUAL.pdf',
      status: 'issued',
      notes: '個人クライアントのテスト請求書です。',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('PDFを生成中...');
    const filePath = await pdfService.generateAndSave(testInvoice);

    console.log('\n✓ テスト請求書PDFを生成しました');
    console.log(`保存先: ${filePath}`);
    console.log('\n請求書内容:');
    console.log(`- クライアント: ${testInvoice.clientName} (個人)`);
    console.log(`- 請求書番号: ${testInvoice.invoiceNumber}`);
    console.log(`- 管理費: ¥${testInvoice.managementFee.toLocaleString()}`);
    console.log(`- 合計: ¥${testInvoice.totalAmount.toLocaleString()}`);

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

generateTestPDFIndividual();
