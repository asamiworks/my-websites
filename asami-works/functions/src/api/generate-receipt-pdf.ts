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
  paidDate?: admin.firestore.Timestamp;
  status: string;
  notes?: string;
  receiptUrl?: string;
  receiptGeneratedAt?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

/**
 * 領収書PDFを生成
 */
const generateReceiptPDF = async (invoice: Invoice): Promise<Buffer> => {
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
      doc.fontSize(24).text('RECEIPT', { align: 'center' }).moveDown(0.5);
      doc.fontSize(20).text('領収書', { align: 'center' }).moveDown(2);

      // 領収書情報
      const startY = doc.y;
      doc.fontSize(10).text('AsamiWorks', 50, startY);
      doc.fontSize(9)
        .text('〒532-0011', 50)
        .text('大阪府大阪市淀川区西中島 5-6-13 新大阪御幸ビル 6F', 50)
        .text('TEL: 06-4866-6758', 50)
        .text('Email: info@asami-works.com', 50);

      const rightX = 350;
      doc.fontSize(10).text(`領収書No: ${invoice.invoiceNumber}`, rightX, startY, { width: 200, align: 'right' });

      // 発行日
      const paidDate = invoice.paidDate ? invoice.paidDate.toDate() : new Date();
      const paidDateStr = new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(paidDate);
      doc.text(`発行日: ${paidDateStr}`, rightX, undefined, { width: 200, align: 'right' });

      doc.moveDown(3);

      // 宛名
      doc.fontSize(14)
        .fillColor('#000')
        .text(`${invoice.clientName} 様`, 50)
        .moveDown(1);

      // 金額（大きく表示）
      doc.fontSize(16)
        .text('下記正に領収いたしました', 50)
        .moveDown(1);

      doc.fontSize(28)
        .fillColor('#000')
        .text(`¥${invoice.totalAmount.toLocaleString()}`, 50, undefined, { align: 'center' })
        .moveDown(2);

      // 内訳
      doc.fontSize(12)
        .fillColor('#000')
        .text('お支払い内訳', 50)
        .moveDown(0.5);

      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const itemX = 50;
      const quantityX = 300;
      const priceX = 370;
      const amountX = 470;

      doc.fontSize(9)
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

      // 合計金額（詳細）
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

      doc.moveDown(3);

      // 但し書き
      doc.fontSize(10)
        .fillColor('#000')
        .text('但し、', 50)
        .moveDown(0.3);

      if (invoice.notes) {
        doc.fontSize(9)
          .text(invoice.notes, 50, undefined, { width: 500 });
      } else {
        doc.fontSize(9)
          .text('上記の通り領収いたしました', 50, undefined, { width: 500 });
      }

      doc.moveDown(2);

      // 印紙（必要に応じて）
      if (invoice.totalAmount >= 50000) {
        doc.fontSize(8)
          .fillColor('#666')
          .text('※ 5万円以上のため収入印紙の貼付が必要です', 50, undefined, { width: 500 });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Google Driveに領収書PDFをアップロード
 */
const uploadReceiptToGoogleDrive = async (
  pdfBuffer: Buffer,
  year: number,
  month: number,
  clientName: string,
  invoiceNumber: string
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
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1asd9c8BJyv8HP_5PBnKBumHL_UFbMscC';

  // 年月フォルダを取得または作成
  const folderName = `${year}年${month}月`;

  const folderResponse = await drive.files.list({
    q: `name='${folderName}' and '${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
  });

  let folderId: string;

  if (folderResponse.data.files && folderResponse.data.files.length > 0) {
    folderId = folderResponse.data.files[0].id!;
  } else {
    const folder = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [rootFolderId],
      },
      fields: 'id',
    });
    folderId = folder.data.id!;
  }

  // ファイル名（領収書用）
  const fileName = `${year}${String(month).padStart(2, '0')}_${clientName}_領収書_${invoiceNumber}.pdf`;

  // 既存ファイルをチェック
  const existingFiles = await drive.files.list({
    q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
    fields: 'files(id)',
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
    });
    fileId = file.data.id!;
  }

  return `https://drive.google.com/file/d/${fileId}/view`;
};

/**
 * 領収書PDF生成用HTTP関数
 */
export const generateReceiptPDF_HTTP = onRequest({
  timeoutSeconds: 300,
  memory: '2GiB'
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

    // 支払い済みチェック
    if (invoice.status !== 'paid') {
      response.status(400).json({
        error: '領収書は支払い済みの請求書のみ生成できます'
      });
      return;
    }

    console.log(`Generating receipt PDF for invoice ${invoice.invoiceNumber}...`);

    // 領収書PDFを生成
    const pdfBuffer = await generateReceiptPDF(invoice);

    // 支払い日または発行日から年月を取得
    const paidDate = invoice.paidDate ? invoice.paidDate.toDate() : invoice.issueDate.toDate();
    const year = paidDate.getFullYear();
    const month = paidDate.getMonth() + 1;

    // Google Driveにアップロード
    const fileUrl = await uploadReceiptToGoogleDrive(
      pdfBuffer,
      year,
      month,
      invoice.clientName,
      invoice.invoiceNumber
    );

    // 請求書にGoogle DriveのURLを保存
    await db.collection('invoices').doc(invoice.id).update({
      receiptUrl: fileUrl,
      receiptGeneratedAt: new Date().toISOString(),
    });

    console.log(`Successfully generated receipt PDF: ${fileUrl}`);

    response.json({
      success: true,
      receiptUrl: fileUrl,
      message: '領収書PDFを生成しました'
    });

  } catch (error: any) {
    console.error('Error generating receipt PDF:', error);
    response.status(500).json({
      success: false,
      error: error.message || '領収書PDF生成に失敗しました'
    });
  }
});
