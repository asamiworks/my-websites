import { NextRequest, NextResponse } from 'next/server';
import { CompanyService } from '@/lib/services/companyService';
import { getInvoiceIssueDate, getPaymentDueDate, getClosingDate } from '@/lib/utils/dateUtils';
import { ApiResponse } from '@/lib/types';

const companyService = new CompanyService();

/**
 * GET /api/invoices/dates?targetMonth=YYYY-MM - 請求書の日付を計算
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetMonth = searchParams.get('targetMonth');

    if (!targetMonth) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '対象月は必須です（YYYY-MM形式）',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const [year, month] = targetMonth.split('-').map(Number);

    // 会社設定を取得
    const company = await companyService.get();
    const invoiceSettings = company?.invoiceSettings;

    if (!invoiceSettings) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '請求書設定が見つかりません',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 締め日を計算（対象月の前月）
    // targetMonthが2025-11の場合、締め日は2025-10-31
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonth = month === 1 ? 12 : month - 1;
    const closingDate = getClosingDate(prevYear, prevMonth, invoiceSettings);

    // 発行日を計算（対象月）
    const issueDate = getInvoiceIssueDate(year, month, invoiceSettings);

    // 支払い期限を計算（対象月）
    const dueDate = getPaymentDueDate(year, month, invoiceSettings);

    const response: ApiResponse<{
      closingDate: string;
      issueDate: string;
      dueDate: string;
      settings: typeof invoiceSettings;
    }> = {
      success: true,
      data: {
        closingDate: closingDate.toISOString(),
        issueDate: issueDate.toISOString(),
        dueDate: dueDate.toISOString(),
        settings: invoiceSettings,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'CALCULATION_ERROR',
        message: '日付の計算に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
