import PDFDocument from 'pdfkit';
import { Invoice } from '@/types/invoice';

export class InvoicePDFService {
  /**
   * 請求書PDFを生成
   */
  async generateInvoicePDF(
    invoice: Invoice,
    bankInfo?: {
      bankName: string;
      branchName: string;
      accountType: string;
      accountNumber: string;
      accountHolder: string;
    }
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // ヘッダー
        this.addHeader(doc, invoice);

        // 請求書情報
        this.addInvoiceInfo(doc, invoice);

        // 請求先情報
        this.addClientInfo(doc, invoice);

        // 請求項目テーブル
        this.addItemsTable(doc, invoice);

        // 合計金額
        this.addTotalSection(doc, invoice);

        // 振込先情報
        if (bankInfo) {
          this.addBankInfo(doc, bankInfo);
        }

        // 備考
        if (invoice.notes) {
          this.addNotes(doc, invoice.notes);
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * ヘッダーを追加
   */
  private addHeader(doc: PDFKit.PDFDocument, invoice: Invoice) {
    doc.fontSize(24)
      .text('INVOICE', { align: 'center' })
      .moveDown(0.5);

    doc.fontSize(20)
      .text('請求書', { align: 'center' })
      .moveDown(2);
  }

  /**
   * 請求書情報を追加
   */
  private addInvoiceInfo(doc: PDFKit.PDFDocument, invoice: Invoice) {
    const startY = doc.y;

    // 左側: 発行者情報
    doc.fontSize(10)
      .text('AsamiWorks', 50, startY)
      .fontSize(9)
      .text('〒000-0000', 50)
      .text('東京都渋谷区xxxxx', 50)
      .text('TEL: 000-0000-0000', 50)
      .text('Email: info@asami-works.com', 50);

    // 右側: 請求書番号・日付
    const rightX = 400;
    doc.fontSize(10)
      .text(`請求書番号: ${invoice.invoiceNumber}`, rightX, startY, { width: 150, align: 'right' });

    if (invoice.issueDate) {
      const issueDate = this.formatDate(invoice.issueDate);
      doc.text(`発行日: ${issueDate}`, rightX, undefined, { width: 150, align: 'right' });
    }

    if (invoice.dueDate) {
      const dueDate = this.formatDate(invoice.dueDate);
      doc.text(`支払期限: ${dueDate}`, rightX, undefined, { width: 150, align: 'right' });
    }

    doc.moveDown(3);
  }

  /**
   * 請求先情報を追加
   */
  private addClientInfo(doc: PDFKit.PDFDocument, invoice: Invoice) {
    doc.fontSize(12)
      .text(`${invoice.clientName} 御中`, 50)
      .moveDown(2);
  }

  /**
   * 請求項目テーブルを追加
   */
  private addItemsTable(doc: PDFKit.PDFDocument, invoice: Invoice) {
    const tableTop = doc.y;
    const itemX = 50;
    const quantityX = 300;
    const priceX = 370;
    const amountX = 470;

    // テーブルヘッダー
    doc.fontSize(10)
      .fillColor('#000')
      .text('項目', itemX, tableTop)
      .text('数量', quantityX, tableTop)
      .text('単価', priceX, tableTop)
      .text('金額', amountX, tableTop);

    // ヘッダー下線
    doc.moveTo(itemX, tableTop + 15)
      .lineTo(545, tableTop + 15)
      .stroke();

    let currentY = tableTop + 25;

    // 請求項目
    invoice.items.forEach((item) => {
      doc.fontSize(9)
        .text(item.description, itemX, currentY, { width: 240 })
        .text(item.quantity.toString(), quantityX, currentY, { width: 60 })
        .text(`¥${item.unitPrice.toLocaleString()}`, priceX, currentY, { width: 90, align: 'right' })
        .text(`¥${item.amount.toLocaleString()}`, amountX, currentY, { width: 75, align: 'right' });

      currentY += 25;
    });

    doc.moveDown(2);
  }

  /**
   * 合計金額セクションを追加
   */
  private addTotalSection(doc: PDFKit.PDFDocument, invoice: Invoice) {
    const rightX = 400;
    const valueX = 470;

    // 小計
    doc.fontSize(10)
      .text('小計:', rightX, undefined, { width: 60, align: 'right' })
      .text(`¥${invoice.subtotal.toLocaleString()}`, valueX, doc.y - 12, { width: 75, align: 'right' });

    // 消費税
    const taxRate = invoice.taxRate ? (invoice.taxRate * 100).toFixed(0) : '0';
    doc.text(`消費税 (${taxRate}%):`, rightX, undefined, { width: 60, align: 'right' })
      .text(`¥${invoice.taxAmount.toLocaleString()}`, valueX, doc.y - 12, { width: 75, align: 'right' });

    // 合計
    doc.fontSize(12)
      .fillColor('#000')
      .text('合計:', rightX, undefined, { width: 60, align: 'right' })
      .text(`¥${invoice.totalAmount.toLocaleString()}`, valueX, doc.y - 14, { width: 75, align: 'right' });

    doc.moveDown(2);
  }

  /**
   * 振込先情報を追加
   */
  private addBankInfo(
    doc: PDFKit.PDFDocument,
    bankInfo: {
      bankName: string;
      branchName: string;
      accountType: string;
      accountNumber: string;
      accountHolder: string;
    }
  ) {
    doc.fontSize(11)
      .fillColor('#000')
      .text('お振込先', 50)
      .moveDown(0.5);

    doc.fontSize(9)
      .text(`銀行名: ${bankInfo.bankName}`, 50)
      .text(`支店名: ${bankInfo.branchName}`, 50)
      .text(`口座種別: ${bankInfo.accountType}`, 50)
      .text(`口座番号: ${bankInfo.accountNumber}`, 50)
      .text(`口座名義: ${bankInfo.accountHolder}`, 50);

    doc.moveDown(2);
  }

  /**
   * 備考を追加
   */
  private addNotes(doc: PDFKit.PDFDocument, notes: string) {
    doc.fontSize(10)
      .fillColor('#666')
      .text('備考:', 50)
      .fontSize(9)
      .text(notes, 50, undefined, { width: 500 });
  }

  /**
   * 日付をフォーマット
   */
  private formatDate(timestamp: any): string {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }
}
