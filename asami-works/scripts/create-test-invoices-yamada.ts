import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

// Firebase Admin初期化
if (!getApps().length) {
  const serviceAccountPath = join(process.cwd(), 'firebase-admin-key.json');
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = getFirestore();

async function createTestInvoices() {
  try {
    const clientId = 'rq7UpqXPHcOVWADt3X4Z'; // 山田太郎様のクライアントID

    const now = new Date();
    const invoices = [
      {
        clientId,
        clientName: '山田太郎',
        invoiceNumber: `INV-2025-001`,
        issueDate: Timestamp.fromDate(new Date(2025, 0, 15)), // 2025年1月15日
        dueDate: Timestamp.fromDate(new Date(2025, 1, 28)), // 2025年2月28日
        items: [
          {
            description: 'Webサイト制作費用',
            quantity: 1,
            unitPrice: 300000,
            amount: 300000,
          },
        ],
        subtotal: 300000,
        taxRate: 0.1,
        taxAmount: 30000,
        totalAmount: 330000,
        status: 'paid',
        paidAmount: 330000,
        paidDate: Timestamp.fromDate(new Date(2025, 1, 10)),
        notes: '2024年12月制作分',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        clientId,
        clientName: '山田太郎',
        invoiceNumber: `INV-2025-002`,
        issueDate: Timestamp.fromDate(new Date(2025, 1, 1)), // 2025年2月1日
        dueDate: Timestamp.fromDate(new Date(2025, 1, 28)), // 2025年2月28日
        items: [
          {
            description: '月額保守管理費',
            quantity: 1,
            unitPrice: 50000,
            amount: 50000,
          },
        ],
        subtotal: 50000,
        taxRate: 0.1,
        taxAmount: 5000,
        totalAmount: 55000,
        status: 'sent',
        notes: '2025年2月分',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        clientId,
        clientName: '山田太郎',
        invoiceNumber: `INV-2025-003`,
        issueDate: Timestamp.fromDate(new Date(2025, 2, 1)), // 2025年3月1日
        dueDate: Timestamp.fromDate(new Date(2025, 2, 31)), // 2025年3月31日
        items: [
          {
            description: '月額保守管理費',
            quantity: 1,
            unitPrice: 50000,
            amount: 50000,
          },
        ],
        subtotal: 50000,
        taxRate: 0.1,
        taxAmount: 5000,
        totalAmount: 55000,
        status: 'sent',
        notes: '2025年3月分',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    ];

    console.log('📝 テスト請求書を作成中...\n');

    for (const invoice of invoices) {
      const docRef = await db.collection('invoices').add(invoice);
      console.log(`✅ ${invoice.invoiceNumber} を作成しました`);
      console.log(`   - 発行日: ${invoice.issueDate.toDate().toLocaleDateString('ja-JP')}`);
      console.log(`   - 支払期限: ${invoice.dueDate.toDate().toLocaleDateString('ja-JP')}`);
      console.log(`   - 金額: ¥${invoice.totalAmount.toLocaleString()}`);
      console.log(`   - ステータス: ${invoice.status === 'paid' ? '支払い済み' : '送信済み'}`);
      console.log('');
    }

    console.log('🎉 すべてのテスト請求書を作成しました！');
    console.log('');
    console.log('🔗 マイページで確認:');
    console.log('  http://localhost:3000/mypage/1762998364879-g0m4578kz8n');
    console.log('');
    console.log('📊 管理画面で確認:');
    console.log('  http://localhost:3000/admin/invoices?clientId=rq7UpqXPHcOVWADt3X4Z');

    process.exit(0);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

createTestInvoices();
