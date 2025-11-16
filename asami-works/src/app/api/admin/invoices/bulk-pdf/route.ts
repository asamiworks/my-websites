import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceIds } = body;

    if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return NextResponse.json(
        { error: 'Invoice IDs are required' },
        { status: 400 }
      );
    }

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    const results: any[] = [];

    // 各請求書のPDF生成を順次実行
    for (const invoiceId of invoiceIds) {
      try {
        const invoiceRef = db.collection('invoices').doc(invoiceId);
        const invoiceDoc = await invoiceRef.get();

        if (!invoiceDoc.exists) {
          errorCount++;
          results.push({
            invoiceId,
            status: 'error',
            error: 'Invoice not found'
          });
          continue;
        }

        const invoice = invoiceDoc.data();

        // 既にPDFが生成されている場合はスキップ
        if (invoice?.pdfUrl) {
          skipCount++;
          results.push({
            invoiceId,
            status: 'skipped',
            reason: 'PDF already exists'
          });
          continue;
        }

        // Firebase Functionsを呼び出してPDF生成
        const functionsUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-asamiworks-679b3.cloudfunctions.net';
        const response = await fetch(`${functionsUrl}/generateInvoicePDFManual`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ADMIN_SECRET_KEY || 'dev-secret-key'}`
          },
          body: JSON.stringify({ invoiceId })
        });

        if (response.ok) {
          successCount++;
          results.push({
            invoiceId,
            status: 'success'
          });
        } else {
          errorCount++;
          const errorData = await response.json().catch(() => ({}));
          results.push({
            invoiceId,
            status: 'error',
            error: errorData.error || 'PDF generation failed'
          });
        }
      } catch (error: any) {
        errorCount++;
        results.push({
          invoiceId,
          status: 'error',
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `PDF生成完了: 成功${successCount}件、スキップ${skipCount}件、エラー${errorCount}件`,
      successCount,
      skipCount,
      errorCount,
      results
    });

  } catch (error: any) {
    console.error('Error in bulk PDF generation:', error);
    return NextResponse.json(
      { error: error.message || 'PDF一括生成に失敗しました' },
      { status: 500 }
    );
  }
}
