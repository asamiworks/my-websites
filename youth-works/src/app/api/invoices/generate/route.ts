import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '@/lib/services/invoiceService';
import { ApiResponse, InvoiceGenerationParams, InvoiceGenerationResult } from '@/lib/types';

const invoiceService = new InvoiceService();

/**
 * POST /api/invoices/generate - 請求書を一括生成
 */
export async function POST(request: NextRequest) {
  try {
    const params: InvoiceGenerationParams = await request.json();

    // バリデーション
    if (!params.targetMonth) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '対象月は必須です（YYYY-MM形式）',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 請求書生成
    const result = await invoiceService.generateForMonth(params);

    const response: ApiResponse<InvoiceGenerationResult> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: '請求書の生成に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
