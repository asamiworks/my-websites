import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // 請求書を取得
    const invoiceRef = db.collection('invoices').doc(id);
    const invoiceDoc = await invoiceRef.get();

    if (!invoiceDoc.exists) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const invoice = invoiceDoc.data();

    // 既にPDFが生成されている場合は既存のURLを返す
    if (invoice?.pdfUrl) {
      return NextResponse.json({
        success: true,
        pdfUrl: invoice.pdfUrl,
        message: '請求書PDFは既に生成されています'
      });
    }

    // Firebase Functionsの請求書PDF生成エンドポイントを呼び出し
    const functionsUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-asamiworks-679b3.cloudfunctions.net';
    const response = await fetch(`${functionsUrl}/generateInvoicePDFManual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ADMIN_SECRET_KEY || 'dev-secret-key'}`
      },
      body: JSON.stringify({ invoiceId: id })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate invoice PDF');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      pdfUrl: data.pdfUrl,
      message: '請求書PDFを生成しました'
    });

  } catch (error: any) {
    console.error('Error generating invoice PDF:', error);
    return NextResponse.json(
      { error: error.message || '請求書PDF生成に失敗しました' },
      { status: 500 }
    );
  }
}
