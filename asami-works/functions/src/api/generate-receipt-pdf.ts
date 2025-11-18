import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { pdf } from '@react-pdf/renderer';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { adminDb } from '../services/firebase-admin-service';
import { ReceiptPDF } from '../pdf/ReceiptTemplate';
import React from 'react';

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
  // React PDFコンポーネントを作成してバッファに変換
  const element = React.createElement(ReceiptPDF, { invoice });
  const pdfDoc = pdf(element as any);
  const buffer = await pdfDoc.toBuffer() as any as Buffer;
  return buffer;
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
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID_RECEIPTS || '0APkoULdGNWdVUk9PVA';

  // 年月フォルダを作成せず、直接ルートフォルダに保存
  const folderId = rootFolderId;

  // ファイル名（領収書用）- 年月を含める
  const fileName = `${year}${String(month).padStart(2, '0')}_${clientName}_領収書_${invoiceNumber}.pdf`;

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
 * 領収書PDF生成用HTTP関数
 */
export const generateReceiptPDF_HTTP = onRequest({
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
