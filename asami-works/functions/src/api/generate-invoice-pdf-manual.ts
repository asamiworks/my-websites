import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import PDFDocument from 'pdfkit';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { adminDb } from '../services/firebase-admin-service';

const db = adminDb;

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  issueDate: admin.firestore.Timestamp;
  dueDate: admin.firestore.Timestamp;
  status: string;
  notes?: string;
  pdfUrl?: string;
  pdfGeneratedAt?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface BankInfo {
  bankName: string;
  branchName: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
}

/**
 * 請求書PDFを生成
 */
const generateInvoicePDF = async (
  invoice: Invoice,
  bankInfo?: BankInfo
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ヘッダー
      doc.fontSize(24).text('INVOICE', { align: 'center' }).moveDown(0.5);
      doc.fontSize(20).text('請求書', { align: 'center' }).moveDown(2);

      // 請求書情報
      const startY = doc.y;
      doc.fontSize(10).text('AsamiWorks', 50, startY);
      doc.fontSize(9)
        .text('〒532-0011', 50)
        .text('大阪府大阪市淀川区西中島 5-6-13 新大阪御幸ビル 6F', 50)
        .text('TEL: 06-4866-6758', 50)
        .text('Email: info@asami-works.com', 50);

      const rightX = 400;
      doc.fontSize(10).text(`請求書番号: ${invoice.invoiceNumber}`, rightX, startY, { width: 150, align: 'right' });

      if (invoice.issueDate) {
        const issueDate = invoice.issueDate.toDate();
        const issueDateStr = new Intl.DateTimeFormat('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(issueDate);
        doc.text(`発行日: ${issueDateStr}`, rightX, undefined, { width: 150, align: 'right' });
      }

      if (invoice.dueDate) {
        const dueDate = invoice.dueDate.toDate();
        const dueDateStr = new Intl.DateTimeFormat('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(dueDate);
        doc.text(`支払期限: ${dueDateStr}`, rightX, undefined, { width: 150, align: 'right' });
      }

      doc.moveDown(3);

      // 請求先情報
      doc.fontSize(12).text(`${invoice.clientName} 御中`, 50).moveDown(2);

      // 請求項目テーブル
      const tableTop = doc.y;
      const itemX = 50;
      const quantityX = 300;
      const priceX = 370;
      const amountX = 470;

      doc.fontSize(10)
        .fillColor('#000')
        .text('項目', itemX, tableTop)
        .text('数量', quantityX, tableTop)
        .text('単価', priceX, tableTop)
        .text('金額', amountX, tableTop);

      doc.moveTo(itemX, tableTop + 15).lineTo(545, tableTop + 15).stroke();

      let currentY = tableTop + 25;
      invoice.items.forEach((item) => {
        doc.fontSize(9)
          .text(item.description, itemX, currentY, { width: 240 })
          .text(item.quantity.toString(), quantityX, currentY, { width: 60 })
          .text(`¥${item.unitPrice.toLocaleString()}`, priceX, currentY, { width: 90, align: 'right' })
          .text(`¥${item.amount.toLocaleString()}`, amountX, currentY, { width: 75, align: 'right' });
        currentY += 25;
      });

      doc.moveDown(2);

      // 合計金額
      const totalRightX = 400;
      const totalValueX = 470;

      doc.fontSize(10)
        .text('小計:', totalRightX, undefined, { width: 60, align: 'right' })
        .text(`¥${invoice.subtotal.toLocaleString()}`, totalValueX, doc.y - 12, { width: 75, align: 'right' });

      const taxRate = invoice.taxRate ? (invoice.taxRate * 100).toFixed(0) : '0';
      doc.text(`消費税 (${taxRate}%):`, totalRightX, undefined, { width: 60, align: 'right' })
        .text(`¥${invoice.taxAmount.toLocaleString()}`, totalValueX, doc.y - 12, { width: 75, align: 'right' });

      doc.fontSize(12)
        .fillColor('#000')
        .text('合計:', totalRightX, undefined, { width: 60, align: 'right' })
        .text(`¥${invoice.totalAmount.toLocaleString()}`, totalValueX, doc.y - 14, { width: 75, align: 'right' });

      doc.moveDown(2);

      // 振込先情報
      if (bankInfo) {
        doc.fontSize(11)
          .fillColor('#000')
          .text('お振込先', 50)
          .moveDown(0.5);

        doc.fontSize(9)
          .text(`銀行名: ${bankInfo.bankName}`, 50)
          .text(`支店名: ${bankInfo.branchName}`, 50)
          .text(`口座種別: ${bankInfo.accountType}`, 50)
          .text(`口座番号: ${bankInfo.accountNumber}`, 50)
          .text(`口座名義: ${bankInfo.accountHolder}`, 50);

        doc.moveDown(2);
      }

      // 備考
      if (invoice.notes) {
        doc.fontSize(10)
          .fillColor('#666')
          .text('備考:', 50)
          .fontSize(9)
          .text(invoice.notes, 50, undefined, { width: 500 });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Google DriveにPDFをアップロード
 */
const uploadToGoogleDrive = async (
  pdfBuffer: Buffer,
  year: number,
  month: number,
  clientName: string
): Promise<string> => {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS)
    : null;

  if (!credentials) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variable is not set');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID_INVOICES || '0AIyWA0JFbdhEUk9PVA';

  // 年月フォルダを作成せず、直接ルートフォルダに保存
  const folderId = rootFolderId;

  // ファイル名 - 年月を含める
  const fileName = `${year}${String(month).padStart(2, '0')}_${clientName}.pdf`;

  // 既存ファイルをチェック
  const existingFiles = await drive.files.list({
    q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
    fields: 'files(id)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  let fileId: string;

  if (existingFiles.data.files && existingFiles.data.files.length > 0) {
    // 既存ファイルを更新
    fileId = existingFiles.data.files[0].id!;
    await drive.files.update({
      fileId,
      media: {
        mimeType: 'application/pdf',
        body: Readable.from(pdfBuffer),
      },
      supportsAllDrives: true,
    });
  } else {
    // 新規ファイルを作成
    const file = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType: 'application/pdf',
        body: Readable.from(pdfBuffer),
      },
      fields: 'id',
      supportsAllDrives: true,
    });
    fileId = file.data.id!;
  }

  return `https://drive.google.com/file/d/${fileId}/view`;
};

/**
 * 手動で請求書PDFを生成するHTTP関数
 */
export const generateInvoicePDFManual_HTTP = onRequest({
  timeoutSeconds: 300,
  memory: '2GiB',
  secrets: ['GOOGLE_SERVICE_ACCOUNT_CREDENTIALS']
}, async (request, response) => {
  // 認証チェック
  const authHeader = request.headers['authorization'] || request.headers['Authorization'];
  const expectedAuth = `Bearer ${process.env.ADMIN_SECRET_KEY || 'dev-secret-key'}`;

  if (!authHeader || authHeader !== expectedAuth) {
    response.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { invoiceId } = request.body;

    if (!invoiceId) {
      response.status(400).json({ error: 'Invoice ID is required' });
      return;
    }

    // 請求書を取得
    const invoiceDoc = await db.collection('invoices').doc(invoiceId).get();

    if (!invoiceDoc.exists) {
      response.status(404).json({ error: 'Invoice not found' });
      return;
    }

    const invoice = {
      id: invoiceDoc.id,
      ...invoiceDoc.data()
    } as Invoice;

    console.log(`Generating invoice PDF for ${invoice.invoiceNumber}...`);

    // 設定から振込先情報を取得
    const settingsDoc = await db.collection('settings').doc('invoice_settings').get();
    const bankInfo: BankInfo | undefined = settingsDoc.exists ? settingsDoc.data()?.bankInfo : undefined;

    // PDFを生成
    const pdfBuffer = await generateInvoicePDF(invoice, bankInfo);

    // 発行日から年月を取得
    const issueDate = invoice.issueDate.toDate();
    const year = issueDate.getFullYear();
    const month = issueDate.getMonth() + 1;

    // Google Driveにアップロード
    const fileUrl = await uploadToGoogleDrive(pdfBuffer, year, month, invoice.clientName);

    // 請求書にGoogle DriveのURLを保存
    await db.collection('invoices').doc(invoice.id).update({
      pdfUrl: fileUrl,
      pdfGeneratedAt: new Date().toISOString(),
    });

    console.log(`Successfully generated invoice PDF: ${fileUrl}`);

    response.json({
      success: true,
      pdfUrl: fileUrl,
      message: '請求書PDFを生成しました'
    });

  } catch (error: any) {
    console.error('Error generating invoice PDF:', error);
    response.status(500).json({
      success: false,
      error: error.message || '請求書PDF生成に失敗しました'
    });
  }
});
