import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '@/lib/services/invoiceService';
import { ApiResponse, Invoice } from '@/lib/types';

const invoiceService = new InvoiceService();

/**
 * GET /api/invoices - 請求書一覧を取得
 */
export async function GET() {
  try {
    const invoices = await invoiceService.getAll();

    const response: ApiResponse<Invoice[]> = {
      success: true,
      data: invoices,
      meta: {
        total: invoices.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: '請求書情報の取得に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
