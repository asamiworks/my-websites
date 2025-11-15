'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Invoice } from '@/lib/types';
import type { Company } from '@/lib/types/company';

export default function GenerateInvoicePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [previewInvoices, setPreviewInvoices] = useState<Invoice[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [invoiceDates, setInvoiceDates] = useState<{
    issueDate: string;
    dueDate: string;
    closingDate: string;
  } | null>(null);
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  // デフォルトは今月（本日の日付）
  const defaultMonth = format(new Date(), 'yyyy-MM');
  const [targetMonth, setTargetMonth] = useState(defaultMonth);

  // プレビューと日付情報を読み込む
  useEffect(() => {
    loadPreview();
    loadInvoiceDates();
  }, [targetMonth]);

  const loadInvoiceDates = async () => {
    try {
      const response = await fetch(`/api/invoices/dates?targetMonth=${targetMonth}`);

      if (!response.ok) {
        console.error('Failed to load invoice dates:', response.status);
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        setInvoiceDates({
          closingDate: data.data.closingDate,
          issueDate: data.data.issueDate,
          dueDate: data.data.dueDate,
        });
      } else {
        console.error('Invalid response:', data);
      }
    } catch (err) {
      console.error('Failed to load invoice dates:', err);
    }
  };

  const loadPreview = async () => {
    setIsLoadingPreview(true);
    setError(null);
    setPreviewInvoices([]);

    try {
      const response = await fetch('/api/invoices/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetMonth }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'プレビューの取得に失敗しました');
      }

      setPreviewInvoices(data.data.invoices || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プレビューの取得に失敗しました');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDateChange = (field: 'issueDate' | 'dueDate' | 'closingDate', value: string) => {
    if (invoiceDates) {
      setInvoiceDates({
        ...invoiceDates,
        [field]: new Date(value).toISOString(),
      });
    }
  };

  const handleGenerate = async () => {
    if (previewInvoices.length === 0) {
      setError('生成する請求書がありません');
      return;
    }

    const confirmed = window.confirm(
      `${previewInvoices.length}件の請求書を一括生成します。よろしいですか？`
    );

    if (!confirmed) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetMonth,
          customDates: invoiceDates, // カスタム日付を送信
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || '生成に失敗しました');
      }

      setResult(data.data);
      setPreviewInvoices([]); // プレビューをクリア
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkDownloadPDF = async () => {
    if (!result || !result.invoices || result.invoices.length === 0) {
      alert('ダウンロードする請求書がありません');
      return;
    }

    setIsDownloadingPDF(true);

    try {
      const invoiceIds = result.invoices.map((inv: Invoice) => inv.id);

      const response = await fetch('/api/invoices/bulk-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceIds }),
      });

      if (!response.ok) {
        throw new Error('PDFの一括ダウンロードに失敗しました');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // ダウンロード日をファイル名に使用
      const now = new Date();
      const dateStr = now.toLocaleDateString('ja-JP').replace(/\//g, '-');
      a.download = `invoices-${dateStr}.zip`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'PDFの一括ダウンロードに失敗しました');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーションバー */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                ローカル請求書システム
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                ダッシュボード
              </Link>
              <Link
                href="/clients"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                クライアント管理
              </Link>
              <Link
                href="/invoices"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100"
              >
                請求書管理
              </Link>
              <Link
                href="/settings"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                設定
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            請求書一括生成
          </h2>
          <p className="text-gray-600">
            対象月を選択して、発行予定の請求書を確認してから一括生成します
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800 font-semibold mb-2">
              生成完了: {result.successCount}件成功 / {result.errorCount}件失敗
            </p>
            {result.errors && result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-red-600">エラー詳細:</p>
                {result.errors.map((err: any, index: number) => (
                  <p key={index} className="text-sm text-red-600">
                    - {err.clientName}: {err.error}
                  </p>
                ))}
              </div>
            )}
            <div className="mt-4 flex space-x-3">
              {result.successCount > 0 && (
                <button
                  onClick={handleBulkDownloadPDF}
                  disabled={isDownloadingPDF}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloadingPDF ? 'ダウンロード中...' : `生成した${result.successCount}件をZIPダウンロード`}
                </button>
              )}
              <Link
                href="/invoices"
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
              >
                請求書一覧を表示
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              対象月 <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              value={targetMonth}
              onChange={(e) => setTargetMonth(e.target.value)}
              disabled={isGenerating || isLoadingPreview}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              この月の請求書を生成します
            </p>
          </div>

          {/* 請求書日付プレビュー */}
          {invoiceDates && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  請求書日付プレビュー
                </h3>
                <button
                  onClick={() => setIsEditingDates(!isEditingDates)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {isEditingDates ? '編集完了' : '日付を編集'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 締め日 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-xs font-medium text-blue-600 mb-1">締め日</div>
                  {isEditingDates ? (
                    <input
                      type="date"
                      value={format(new Date(invoiceDates.closingDate), 'yyyy-MM-dd')}
                      onChange={(e) => handleDateChange('closingDate', e.target.value)}
                      className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                    />
                  ) : (
                    <>
                      <div className="text-lg font-bold text-blue-900">
                        {format(new Date(invoiceDates.closingDate), 'yyyy年MM月dd日')}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {format(new Date(invoiceDates.closingDate), '(E)', { locale: ja })}
                      </div>
                    </>
                  )}
                </div>

                {/* 発行日 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-xs font-medium text-green-600 mb-1">発行日</div>
                  {isEditingDates ? (
                    <input
                      type="date"
                      value={format(new Date(invoiceDates.issueDate), 'yyyy-MM-dd')}
                      onChange={(e) => handleDateChange('issueDate', e.target.value)}
                      className="w-full px-2 py-1 border border-green-300 rounded text-sm"
                    />
                  ) : (
                    <>
                      <div className="text-lg font-bold text-green-900">
                        {format(new Date(invoiceDates.issueDate), 'yyyy年MM月dd日')}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {format(new Date(invoiceDates.issueDate), '(E)', { locale: ja })}
                      </div>
                    </>
                  )}
                </div>

                {/* 支払い期限 */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-xs font-medium text-orange-600 mb-1">支払い期限</div>
                  {isEditingDates ? (
                    <input
                      type="date"
                      value={format(new Date(invoiceDates.dueDate), 'yyyy-MM-dd')}
                      onChange={(e) => handleDateChange('dueDate', e.target.value)}
                      className="w-full px-2 py-1 border border-orange-300 rounded text-sm"
                    />
                  ) : (
                    <>
                      <div className="text-lg font-bold text-orange-900">
                        {format(new Date(invoiceDates.dueDate), 'yyyy年MM月dd日')}
                      </div>
                      <div className="text-xs text-orange-600 mt-1">
                        {format(new Date(invoiceDates.dueDate), '(E)', { locale: ja })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <Link href="/settings/company" className="text-blue-600 hover:text-blue-800 underline">
                  設定ページ
                </Link>
                で請求書の日付設定を変更できます
              </div>
            </div>
          )}
        </div>

        {/* プレビュー一覧 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              発行予定の請求書一覧
              {!isLoadingPreview && previewInvoices.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  （{previewInvoices.length}件）
                </span>
              )}
            </h3>
          </div>

          {isLoadingPreview ? (
            <div className="px-6 py-12 text-center text-gray-500">
              読み込み中...
            </div>
          ) : previewInvoices.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <p className="text-lg mb-2">発行する請求書がありません</p>
              <p className="text-sm">
                対象月を変更するか、クライアント情報を確認してください
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        クライアント名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        請求期間
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        管理費
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        調整額
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        請求額
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        備考
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewInvoices.map((invoice, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.clientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {format(new Date(invoice.feeStartDate), 'yyyy/MM/dd')} 〜{' '}
                          {format(new Date(invoice.feeEndDate), 'yyyy/MM/dd')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          ¥{invoice.managementFee.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {invoice.adjustmentAmount !== 0 ? (
                            <span className={invoice.adjustmentAmount > 0 ? 'text-blue-600' : 'text-red-600'}>
                              {invoice.adjustmentAmount > 0 ? '+' : ''}¥{invoice.adjustmentAmount.toLocaleString()}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                          ¥{invoice.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {invoice.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        合計請求額:
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                        ¥{previewInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <Link
                  href="/invoices"
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  戻る
                </Link>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || previewInvoices.length === 0}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? '生成中...' : `${previewInvoices.length}件の請求書を一括生成`}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
