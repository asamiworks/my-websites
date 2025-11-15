import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '@/lib/services/invoiceService';
import { ApiResponse } from '@/lib/types';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const invoiceService = new InvoiceService();

/**
 * POST /api/invoices/:id/pdf - 請求書PDFをローカルに保存
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // 請求書を取得
    const invoice = await invoiceService.getById(id);

    if (!invoice) {
      const response: ApiResponse = {
        success: false,
        error: { code: 'NOT_FOUND', message: '請求書が見つかりません' },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 外部プロセスでPDFを生成
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'generate-invoice-pdf.ts');
      const { stdout, stderr } = await execAsync(`npx tsx "${scriptPath}" ${id}`);

      if (stderr) {
        console.error(`PDF generation stderr:`, stderr);
      }

      // スクリプトの出力（ファイルパス）を取得
      const filePath = stdout.trim();

      if (!filePath || !filePath.endsWith('.pdf')) {
        throw new Error(`Invalid file path returned: ${filePath}`);
      }

      const response: ApiResponse<{ filePath: string }> = {
        success: true,
        data: {
          filePath,
        },
      };

      return NextResponse.json(response);
    } catch (execError) {
      console.error('PDF generation execution error:', execError);
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PDF_GENERATION_ERROR',
          message: 'PDFの生成に失敗しました（外部プロセスエラー）',
          details: execError instanceof Error ? { message: execError.message } : {},
        },
      };
      return NextResponse.json(response, { status: 500 });
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'PDF_GENERATION_ERROR',
        message: 'PDFの生成に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
