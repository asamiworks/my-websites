import { v4 as uuidv4 } from 'uuid';
import { addMonths, format, startOfMonth, endOfMonth, differenceInMonths } from 'date-fns';
import { JSONStorage } from '../data/jsonStorage';
import { Invoice, Client, InvoiceGenerationParams, InvoiceGenerationResult, CustomInvoiceDates } from '../types';
import { ClientService } from './clientService';
import { CompanyService } from './companyService';
import { getInvoiceIssueDate, getPaymentDueDate, getBillingPeriod } from '../utils/dateUtils';

export class InvoiceService {
  private storage: JSONStorage<Invoice>;
  private clientService: ClientService;
  private companyService: CompanyService;

  constructor() {
    this.storage = new JSONStorage<Invoice>('invoices.json');
    this.clientService = new ClientService();
    this.companyService = new CompanyService();
  }

  /**
   * 全請求書を取得
   */
  async getAll(): Promise<Invoice[]> {
    return await this.storage.read();
  }

  /**
   * IDで請求書を取得
   */
  async getById(id: string): Promise<Invoice | null> {
    return await this.storage.findById(id);
  }

  /**
   * クライアントIDで請求書を検索
   */
  async getByClientId(clientId: string): Promise<Invoice[]> {
    return await this.storage.find(invoice => invoice.clientId === clientId);
  }

  /**
   * 指定月の請求書をプレビュー（保存せず計算のみ）
   */
  async previewForMonth(params: InvoiceGenerationParams): Promise<InvoiceGenerationResult> {
    const { targetMonth, clientIds } = params;
    const [year, month] = targetMonth.split('-').map(Number);

    const result: InvoiceGenerationResult = {
      successCount: 0,
      errorCount: 0,
      errors: [],
      invoices: [],
    };

    // 生成対象のクライアントを取得
    const allClients = await this.clientService.getActive();
    const targetClients = clientIds
      ? allClients.filter(c => clientIds.includes(c.id))
      : allClients;

    for (const client of targetClients) {
      try {
        // このクライアントの請求書を生成すべきか判定
        if (!this.shouldGenerateInvoice(client, year, month)) {
          continue;
        }

        const invoice = await this.previewInvoiceForClient(client, year, month);
        result.invoices.push(invoice);
        result.successCount++;
      } catch (error) {
        result.errorCount++;
        result.errors.push({
          clientId: client.id,
          clientName: client.clientName,
          error: error instanceof Error ? error.message : '不明なエラー',
        });
      }
    }

    return result;
  }

  /**
   * 指定月の請求書を生成
   */
  async generateForMonth(params: InvoiceGenerationParams): Promise<InvoiceGenerationResult> {
    const { targetMonth, clientIds, customDates } = params;
    const [year, month] = targetMonth.split('-').map(Number);

    const result: InvoiceGenerationResult = {
      successCount: 0,
      errorCount: 0,
      errors: [],
      invoices: [],
    };

    // 生成対象のクライアントを取得
    const allClients = await this.clientService.getActive();
    const targetClients = clientIds
      ? allClients.filter(c => clientIds.includes(c.id))
      : allClients;

    for (const client of targetClients) {
      try {
        // このクライアントの請求書を生成すべきか判定
        if (!this.shouldGenerateInvoice(client, year, month)) {
          continue;
        }

        const invoice = await this.generateInvoiceForClient(client, year, month, customDates);
        result.invoices.push(invoice);
        result.successCount++;
      } catch (error) {
        result.errorCount++;
        result.errors.push({
          clientId: client.id,
          clientName: client.clientName,
          error: error instanceof Error ? error.message : '不明なエラー',
        });
      }
    }

    return result;
  }

  /**
   * 未請求月数を計算
   */
  private calculateUnpaidMonths(client: Client, targetYear: number, targetMonth: number): number {
    // 月次請求の場合のみ未請求月数を計算
    if (client.billingFrequency !== 'monthly') {
      return 1;
    }

    // lastPaidPeriodがない場合は1ヶ月分
    if (!client.lastPaidPeriod) {
      return 1;
    }

    // lastPaidPeriod（YYYY-MM形式）をパース
    const [lastYear, lastMonth] = client.lastPaidPeriod.split('-').map(Number);
    const lastPaidDate = new Date(lastYear, lastMonth - 1, 1);

    // 請求対象月（前月）
    const billingPeriod = getBillingPeriod(targetYear, targetMonth);
    const targetBillingDate = billingPeriod.startDate;

    // 月数差分を計算（lastPaidPeriodの次月から請求対象月まで）
    const monthsDiff = differenceInMonths(targetBillingDate, lastPaidDate);

    return monthsDiff > 0 ? monthsDiff : 0;
  }

  /**
   * 特定クライアントの請求書をプレビュー（保存せず）
   */
  private async previewInvoiceForClient(
    client: Client,
    year: number,
    month: number
  ): Promise<Invoice> {
    const now = new Date().toISOString();

    // 会社設定を取得
    const company = await this.companyService.get();
    const invoiceSettings = company?.invoiceSettings;

    // 請求書番号を生成（INV-YYYYMM-CLIENTNAME-XXXX）
    const invoiceNumber = await this.generateInvoiceNumber(client, year, month);

    // 発行日（設定に基づく）
    const issueDate = getInvoiceIssueDate(year, month, invoiceSettings).toISOString();

    // 支払期限（設定に基づく）
    const dueDate = getPaymentDueDate(year, month, invoiceSettings).toISOString();

    // 料金適用期間（前月1日〜前月末日）
    const billingPeriod = getBillingPeriod(year, month);
    let feeStartDate = billingPeriod.startDate.toISOString();
    let feeEndDate = billingPeriod.endDate.toISOString();

    // 未請求月数を計算
    const unpaidMonths = this.calculateUnpaidMonths(client, year, month);

    // 未請求月数が2ヶ月以上の場合、開始日を調整
    if (unpaidMonths > 1) {
      const adjustedStartDate = addMonths(billingPeriod.startDate, -(unpaidMonths - 1));
      feeStartDate = startOfMonth(adjustedStartDate).toISOString();
    }

    // この月の管理費を取得（請求対象期間の開始日時点の金額）
    let baseFee = this.clientService.getManagementFeeAt(client, billingPeriod.startDate);

    // 年払いの場合は11ヶ月分（1ヶ月サービス）、月次の場合は未請求月数分
    const managementFee = client.billingFrequency === 'yearly'
      ? baseFee * 11
      : baseFee * unpaidMonths;

    // 初回請求の場合は制作費を含める
    let adjustmentAmount = 0;
    let adjustmentNote = '';

    if (!client.hasInvoicedProduction && client.initialProductionCost) {
      adjustmentAmount = client.initialProductionCost;
      adjustmentNote = 'サイト制作費を含む';
    }

    // 累積過不足金を調整（過払いならマイナス、不足ならプラス）
    if (client.accumulatedDifference && client.accumulatedDifference !== 0) {
      adjustmentAmount -= client.accumulatedDifference;

      if (adjustmentNote) {
        adjustmentNote += '、';
      }

      if (client.accumulatedDifference > 0) {
        adjustmentNote += `前回過払い分${Math.abs(client.accumulatedDifference).toLocaleString()}円を調整`;
      } else {
        adjustmentNote += `前回不足分${Math.abs(client.accumulatedDifference).toLocaleString()}円を調整`;
      }
    }

    // 金額計算
    const subtotal = managementFee + adjustmentAmount;
    const taxAmount = 0; // 免税事業者のため消費税は0
    const totalAmount = subtotal + taxAmount;

    // PDFファイルパス
    const pdfPath = `output/${year}-${String(month).padStart(2, '0')}/${invoiceNumber}.pdf`;

    const invoice: Invoice = {
      id: uuidv4(),
      invoiceNumber,
      clientId: client.id,
      clientName: client.clientName,
      billingYear: year,
      billingMonth: month,
      issueDate,
      dueDate,
      managementFee,
      quantity: unpaidMonths,
      feeStartDate,
      feeEndDate,
      adjustmentAmount,
      subtotal,
      taxAmount,
      totalAmount,
      pdfPath,
      status: 'issued',
      notes: this.generateInvoiceNotes(client, unpaidMonths, adjustmentNote),
      createdAt: now,
      updatedAt: now,
    };

    // プレビューなので保存しない
    return invoice;
  }

  /**
   * 特定クライアントの請求書を生成
   */
  private async generateInvoiceForClient(
    client: Client,
    year: number,
    month: number,
    customDates?: CustomInvoiceDates
  ): Promise<Invoice> {
    const now = new Date().toISOString();

    // 会社設定を取得
    const company = await this.companyService.get();
    const invoiceSettings = company?.invoiceSettings;

    // 請求書番号を生成（INV-YYYYMM-CLIENTNAME-XXXX）
    const invoiceNumber = await this.generateInvoiceNumber(client, year, month);

    // 発行日（カスタム日付があればそれを使用、なければ設定に基づく）
    const issueDate = customDates?.issueDate || getInvoiceIssueDate(year, month, invoiceSettings).toISOString();

    // 支払期限（カスタム日付があればそれを使用、なければ設定に基づく）
    const dueDate = customDates?.dueDate || getPaymentDueDate(year, month, invoiceSettings).toISOString();

    // 料金適用期間（前月1日〜前月末日）
    const billingPeriod = getBillingPeriod(year, month);
    let feeStartDate = billingPeriod.startDate.toISOString();
    let feeEndDate = billingPeriod.endDate.toISOString();

    // 未請求月数を計算
    const unpaidMonths = this.calculateUnpaidMonths(client, year, month);

    // 未請求月数が2ヶ月以上の場合、開始日を調整
    if (unpaidMonths > 1) {
      const adjustedStartDate = addMonths(billingPeriod.startDate, -(unpaidMonths - 1));
      feeStartDate = startOfMonth(adjustedStartDate).toISOString();
    }

    // この月の管理費を取得（請求対象期間の開始日時点の金額）
    let baseFee = this.clientService.getManagementFeeAt(client, billingPeriod.startDate);

    // 年払いの場合は11ヶ月分（1ヶ月サービス）、月次の場合は未請求月数分
    const managementFee = client.billingFrequency === 'yearly'
      ? baseFee * 11
      : baseFee * unpaidMonths;

    // 初回請求の場合は制作費を含める
    let adjustmentAmount = 0;
    let adjustmentNote = '';

    if (!client.hasInvoicedProduction && client.initialProductionCost) {
      adjustmentAmount = client.initialProductionCost;
      adjustmentNote = 'サイト制作費を含む';
    }

    // 累積過不足金を調整（過払いならマイナス、不足ならプラス）
    if (client.accumulatedDifference && client.accumulatedDifference !== 0) {
      adjustmentAmount -= client.accumulatedDifference;

      if (adjustmentNote) {
        adjustmentNote += '、';
      }

      if (client.accumulatedDifference > 0) {
        adjustmentNote += `前回過払い分${Math.abs(client.accumulatedDifference).toLocaleString()}円を調整`;
      } else {
        adjustmentNote += `前回不足分${Math.abs(client.accumulatedDifference).toLocaleString()}円を調整`;
      }
    }

    // 金額計算
    const subtotal = managementFee + adjustmentAmount;
    const taxAmount = 0; // 免税事業者のため消費税は0
    const totalAmount = subtotal + taxAmount;

    // PDFファイルパス
    const pdfPath = `output/${year}-${String(month).padStart(2, '0')}/${invoiceNumber}.pdf`;

    const invoice: Invoice = {
      id: uuidv4(),
      invoiceNumber,
      clientId: client.id,
      clientName: client.clientName,
      billingYear: year,
      billingMonth: month,
      issueDate,
      dueDate,
      managementFee,
      quantity: unpaidMonths,
      feeStartDate,
      feeEndDate,
      adjustmentAmount,
      subtotal,
      taxAmount,
      totalAmount,
      pdfPath,
      status: 'issued',
      notes: this.generateInvoiceNotes(client, unpaidMonths, adjustmentNote),
      createdAt: now,
      updatedAt: now,
    };

    // 請求書を保存
    await this.storage.append(invoice);

    // 初回制作費を請求した場合、フラグを更新
    if (!client.hasInvoicedProduction && client.initialProductionCost) {
      await this.clientService.markProductionInvoiced(client.id);
    }

    // 過不足金を調整した場合、累積過不足金をリセット
    if (client.accumulatedDifference && client.accumulatedDifference !== 0) {
      await this.clientService.update(client.id, {
        accumulatedDifference: 0,
      });
    }

    return invoice;
  }

  /**
   * 請求書のnotesを生成
   */
  private generateInvoiceNotes(client: Client, unpaidMonths: number, adjustmentNote: string): string | undefined {
    const notes: string[] = [];

    // 複数月請求
    if (unpaidMonths > 1) {
      notes.push(`${unpaidMonths}ヶ月分まとめて請求`);
    }

    // 年払い
    if (client.billingFrequency === 'yearly') {
      notes.push('年払い（1ヶ月サービス適用）');
    }

    // 調整項目
    if (adjustmentNote) {
      notes.push(adjustmentNote);
    }

    return notes.length > 0 ? notes.join('、') : undefined;
  }

  /**
   * 請求書を生成すべきか判定
   */
  private shouldGenerateInvoice(client: Client, year: number, month: number): boolean {
    const targetDate = new Date(year, month - 1, 1);
    const sitePublishDate = new Date(client.sitePublishDate);

    // サイト公開日以降である必要がある
    if (targetDate < sitePublishDate) {
      return false;
    }

    // 契約終了日を過ぎている場合は生成しない
    if (client.contractEndDate) {
      const contractEndDate = new Date(client.contractEndDate);
      if (targetDate > contractEndDate) {
        return false;
      }
    }

    // 年次請求の場合、サイト公開月のみ生成
    if (client.billingFrequency === 'yearly') {
      const publishMonth = sitePublishDate.getMonth() + 1;
      return month === publishMonth;
    }

    // 月次請求の場合は毎月生成
    return true;
  }

  /**
   * 請求書番号を生成
   */
  private async generateInvoiceNumber(
    client: Client,
    year: number,
    month: number
  ): Promise<string> {
    const yearMonth = `${year}${String(month).padStart(2, '0')}`;

    // 同じ月の全請求書数をカウント（全クライアント含む）
    const existingInvoices = await this.storage.find(
      inv => inv.billingYear === year && inv.billingMonth === month
    );

    const sequence = String(existingInvoices.length + 1).padStart(3, '0');

    return `INV-${yearMonth}-${sequence}`;
  }

  /**
   * 請求書を削除
   */
  async delete(id: string): Promise<boolean> {
    return await this.storage.deleteById(id);
  }

  /**
   * 請求書ステータスを更新（入金処理）
   */
  async updateStatus(
    id: string,
    status: 'issued' | 'paid' | 'overdue' | 'cancelled',
    paidAmount?: number
  ): Promise<Invoice | null> {
    const invoice = await this.getById(id);
    if (!invoice) return null;

    const now = new Date().toISOString();
    const updateData: Partial<Invoice> = {
      status,
      updatedAt: now,
    };

    // 入金済みにした場合
    if (status === 'paid') {
      if (paidAmount === undefined) {
        throw new Error('入金額が指定されていません');
      }

      // 過不足金を計算（totalAmount - paidAmount）
      const paymentDifference = invoice.totalAmount - paidAmount;

      updateData.paidAmount = paidAmount;
      updateData.paymentDifference = paymentDifference;
      updateData.paidDate = now;
    }

    const updatedInvoice = await this.storage.updateById(id, updateData);

    // 入金済みにした場合、クライアント情報を更新
    if (status === 'paid' && updatedInvoice && paidAmount !== undefined) {
      // 請求対象期間の終了月を計算（実際に請求している期間）
      const billingPeriod = getBillingPeriod(invoice.billingYear, invoice.billingMonth);
      const endYear = billingPeriod.endDate.getFullYear();
      const endMonth = billingPeriod.endDate.getMonth() + 1;
      const lastPaidPeriod = `${endYear}-${String(endMonth).padStart(2, '0')}`;

      await this.clientService.updateLastPaidPeriod(invoice.clientId, lastPaidPeriod);

      // 累積過不足金を更新
      const client = await this.clientService.getById(invoice.clientId);
      if (client) {
        const newAccumulatedDifference = (client.accumulatedDifference || 0) + updatedInvoice.paymentDifference!;
        await this.clientService.update(client.id, {
          accumulatedDifference: newAccumulatedDifference,
        });
      }
    }

    return updatedInvoice;
  }
}
