import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '@/lib/services/invoiceService';
import { ApiResponse, Invoice } from '@/lib/types';

const invoiceService = new InvoiceService();

/**
 * GET /api/invoices/:id - 請求書詳細を取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await invoiceService.getById(id);

    if (!invoice) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '請求書が見つかりません',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Invoice> = {
      success: true,
      data: invoice,
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

/**
 * DELETE /api/invoices/:id - 請求書を削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await invoiceService.delete(id);

    if (!success) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '請求書が見つかりません',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: '請求書の削除に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
