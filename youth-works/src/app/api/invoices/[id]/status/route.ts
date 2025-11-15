import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '@/lib/services/invoiceService';
import { ApiResponse, Invoice } from '@/lib/types';

const invoiceService = new InvoiceService();

/**
 * PATCH /api/invoices/:id/status - 請求書ステータスを更新
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, paidAmount } = await request.json();

    if (!status || !['issued', 'paid', 'overdue', 'cancelled'].includes(status)) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '有効なステータスを指定してください',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 入金済みにする場合は入金額が必須
    if (status === 'paid' && paidAmount === undefined) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '入金額を指定してください',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const invoice = await invoiceService.updateStatus(id, status, paidAmount);

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
        code: 'UPDATE_ERROR',
        message: 'ステータス更新に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
