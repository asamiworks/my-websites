import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '@/lib/services/invoiceService';
import archiver from 'archiver';
import { PassThrough } from 'stream';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// Force Node.js runtime (required for PDF generation)
export const runtime = 'nodejs';

const invoiceService = new InvoiceService();

/**
 * POST /api/invoices/bulk-pdf - 複数の請求書PDFをZIPファイルとしてダウンロード
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
        },
        { status: 400 }
      );
    }

    // ZIPアーカイブを作成
    const archive = archiver('zip', {
      zlib: { level: 9 }, // 最大圧縮
    });

    // PassThroughストリームを作成
    const passThroughStream = new PassThrough();
    archive.pipe(passThroughStream);

    // StreamをBufferに変換するためのPromise
    const zipBufferPromise = new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      passThroughStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      passThroughStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      passThroughStream.on('error', (err) => {
        reject(err);
      });

      archive.on('error', (err) => {
        reject(err);
      });
    });

    // PDFを生成してアーカイブに追加
    for (const invoiceId of invoiceIds) {
      const invoice = await invoiceService.getById(invoiceId);

      if (!invoice) {
        console.warn(`Invoice not found: ${invoiceId}`);
        continue;
      }

      try {
        // 外部プロセスでPDFを生成
        const scriptPath = path.join(process.cwd(), 'scripts', 'generate-invoice-pdf.ts');
        const { stdout, stderr } = await execAsync(`npx tsx "${scriptPath}" ${invoiceId}`);

        if (stderr) {
          console.error(`PDF generation stderr for ${invoiceId}:`, stderr);
        }

        // スクリプトの出力（ファイルパス）を取得
        const filePath = stdout.trim();

        if (!filePath || !filePath.endsWith('.pdf')) {
          throw new Error(`Invalid file path returned: ${filePath}`);
        }

        // 保存したPDFファイルを読み込む
        const fs = await import('fs/promises');
        const pdfBuffer = await fs.readFile(filePath);

        // ファイル名を生成（請求書番号_クライアント名.pdf）
        const safeClientName = invoice.clientName.replace(/[/\\:*?"<>|]/g, '_').trim();
        const fileName = `${invoice.invoiceNumber}_${safeClientName}.pdf`;

        // アーカイブに追加
        archive.append(pdfBuffer, { name: fileName });
      } catch (error) {
        console.error(`Failed to generate PDF for invoice ${invoiceId}:`, error);
      }
    }

    // アーカイブを確定
    archive.finalize();

    // ZIPバッファを取得
    const zipBuffer = await zipBufferPromise;

    // 現在の日付（ローカルタイムゾーン）
    const now = new Date();
    const dateStr = now.toLocaleDateString('ja-JP').replace(/\//g, '-'); // YYYY-MM-DD形式

    // ZIPファイルとして返す
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="invoices-${dateStr}.zip"`,
      },
    });
  } catch (error) {
    console.error('Bulk PDF generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PDF_GENERATION_ERROR',
          message: 'PDFの一括生成に失敗しました',
          details: error instanceof Error ? { message: error.message } : {},
        },
      },
      { status: 500 }
    );
  }
}
