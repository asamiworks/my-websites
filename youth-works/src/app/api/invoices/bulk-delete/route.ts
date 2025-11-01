import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '@/lib/services/invoiceService';
import { ApiResponse } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const invoiceService = new InvoiceService();

/**
 * POST /api/invoices/bulk-delete - 複数の請求書を削除
 * Body: { invoiceIds: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const { invoiceIds } = await request.json();

    if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: '請求書IDの配列が必要です',
          },
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    const results = {
      successCount: 0,
      errorCount: 0,
      deletedIds: [] as string[],
      errors: [] as { invoiceId: string; error: string }[],
    };

    for (const invoiceId of invoiceIds) {
      try {
        // 請求書情報を取得
        const invoice = await invoiceService.getById(invoiceId);

        // データベースから削除
        const deleted = await invoiceService.delete(invoiceId);

        if (!deleted) {
          results.errorCount++;
          results.errors.push({
            invoiceId,
            error: '請求書が見つかりません',
          });
          continue;
        }

        // PDFファイルも削除
        if (invoice?.pdfPath) {
          try {
            const pdfFilePath = path.join(process.cwd(), invoice.pdfPath);
            await fs.unlink(pdfFilePath);
          } catch (error) {
            // ファイルが存在しない場合はエラーを無視
            console.warn(`PDF file not found: ${invoice.pdfPath}`);
          }
        }

        results.successCount++;
        results.deletedIds.push(invoiceId);
      } catch (error) {
        results.errorCount++;
        results.errors.push({
          invoiceId,
          error: error instanceof Error ? error.message : '不明なエラー',
        });
      }
    }

    const response: ApiResponse<typeof results> = {
      success: results.errorCount === 0,
      data: results,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: '請求書の一括削除に失敗しました',
          details: error instanceof Error ? { message: error.message } : {},
        },
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
