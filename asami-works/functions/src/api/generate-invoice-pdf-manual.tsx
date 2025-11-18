import React from 'react';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { renderToBuffer } from '@react-pdf/renderer';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { adminDb } from '../services/firebase-admin-service';
import { InvoicePDF } from '../pdf/InvoiceTemplate';

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

interface CompanyInfo {
  name: string;
  postalCode: string;
  address: string;
  phone: string;
  email: string;
}

/**
 * 請求書PDFを生成（@react-pdf/renderer使用）
 */
const generateInvoicePDF = async (
  invoice: Invoice,
  bankInfo?: BankInfo,
  companyInfo?: CompanyInfo
): Promise<Buffer> => {
  // デフォルトの会社情報
  const company = companyInfo || {
    name: 'AsamiWorks',
    postalCode: '532-0011',
    address: '大阪府大阪市淀川区西中島 5-6-13 新大阪御幸ビル 6F',
    phone: '06-4866-6758',
    email: 'info@asami-works.com',
  };

  // PDFコンポーネントを作成してバッファに変換
  const result = await renderToBuffer(
    <InvoicePDF invoice={invoice} bankInfo={bankInfo} companyInfo={company} />
  );

  // Uint8Array を Buffer に変換
  const buffer = Buffer.from(result);

  return buffer;
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

    // 設定から振込先情報と会社情報を取得
    const settingsDoc = await db.collection('settings').doc('admin').get();
    const settings = settingsDoc.exists ? settingsDoc.data() : {};
    const bankInfo: BankInfo | undefined = settings?.bankInfo;
    const companyInfo: CompanyInfo | undefined = settings?.companyInfo;

    // PDFを生成
    const pdfBuffer = await generateInvoicePDF(invoice, bankInfo, companyInfo);

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
