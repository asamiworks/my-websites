'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Invoice } from '@/lib/types';
import { format } from 'date-fns';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'データの取得に失敗しました');
      }

      // 最新順にソート
      const sortedInvoices = (result.data || []).sort(
        (a: Invoice, b: Invoice) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setInvoices(sortedInvoices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日');
    } catch {
      return dateString;
    }
  };

  const openPaymentModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaidAmount(invoice.totalAmount.toString());
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setSelectedInvoice(null);
    setPaidAmount('');
    setShowPaymentModal(false);
  };

  const handleMarkAsPaid = async () => {
    if (!selectedInvoice) return;

    const amount = parseFloat(paidAmount);
    if (isNaN(amount) || amount < 0) {
      alert('有効な入金額を入力してください');
      return;
    }

    try {
      const response = await fetch(`/api/invoices/${selectedInvoice.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid', paidAmount: amount }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'ステータス更新に失敗しました');
      }

      // モーダルを閉じて請求書一覧を再取得
      closePaymentModal();
      await fetchInvoices();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      issued: { label: '発行済み', class: 'bg-blue-100 text-blue-800' },
      paid: { label: '支払済み', class: 'bg-green-100 text-green-800' },
      overdue: { label: '期限切れ', class: 'bg-red-100 text-red-800' },
      cancelled: { label: 'キャンセル', class: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.issued;

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const handleSavePDF = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'PDFの保存に失敗しました');
      }

      alert(`PDFを保存しました: ${result.data.filePath}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'PDFの保存に失敗しました');
    }
  };

  const handleBulkDownloadPDF = async () => {
    if (selectedInvoiceIds.size === 0) {
      alert('請求書を選択してください');
      return;
    }

    try {
      const response = await fetch('/api/invoices/bulk-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceIds: Array.from(selectedInvoiceIds) }),
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

      // 選択をクリア
      setSelectedInvoiceIds(new Set());
    } catch (err) {
      alert(err instanceof Error ? err.message : 'PDFの一括ダウンロードに失敗しました');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedInvoiceIds.size === 0) {
      alert('請求書を選択してください');
      return;
    }

    try {
      const response = await fetch('/api/invoices/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceIds: Array.from(selectedInvoiceIds) }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || '請求書の削除に失敗しました');
      }

      // 削除完了メッセージ
      const { successCount, errorCount } = result.data;
      if (errorCount > 0) {
        alert(`${successCount}件の請求書を削除しました。${errorCount}件は削除できませんでした。`);
      } else {
        alert(`${successCount}件の請求書を削除しました。`);
      }

      // モーダルを閉じて選択をクリア
      setShowDeleteModal(false);
      setSelectedInvoiceIds(new Set());

      // 請求書一覧を再取得
      await fetchInvoices();
    } catch (err) {
      alert(err instanceof Error ? err.message : '請求書の削除に失敗しました');
    }
  };

  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoiceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(invoiceId)) {
        newSet.delete(invoiceId);
      } else {
        newSet.add(invoiceId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedInvoiceIds.size === invoices.length) {
      setSelectedInvoiceIds(new Set());
    } else {
      setSelectedInvoiceIds(new Set(invoices.map(inv => inv.id)));
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              請求書管理
            </h2>
            <p className="text-gray-600">
              請求書の生成・管理・PDF出力を行います
            </p>
          </div>
          <div className="flex space-x-3">
            {selectedInvoiceIds.size > 0 && (
              <>
                <button
                  onClick={handleBulkDownloadPDF}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                >
                  選択中の{selectedInvoiceIds.size}件をZIPダウンロード
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                >
                  選択中の{selectedInvoiceIds.size}件を削除
                </button>
              </>
            )}
            <Link
              href="/invoices/generate"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              請求書生成
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 請求書一覧 */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                読み込み中...
              </div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">請求書が生成されていません</p>
                <p className="text-sm">
                  「請求書生成」ボタンから請求書を作成してください
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={invoices.length > 0 && selectedInvoiceIds.size === invoices.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      請求書番号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      クライアント
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      請求月
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      金額
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedInvoiceIds.has(invoice.id)}
                          onChange={() => toggleInvoiceSelection(invoice.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(invoice.issueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.billingYear}年{invoice.billingMonth}月
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleSavePDF(invoice.id, invoice.invoiceNumber)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          保存
                        </button>
                        {invoice.status === 'issued' && (
                          <button
                            onClick={() => openPaymentModal(invoice)}
                            className="text-green-600 hover:text-green-900"
                          >
                            入金確認
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 統計情報 */}
        {invoices.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">
                総請求書数
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {invoices.length}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">
                今月の請求書
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {invoices.filter(inv => {
                  const now = new Date();
                  return inv.billingYear === now.getFullYear() &&
                         inv.billingMonth === now.getMonth() + 1;
                }).length}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">
                総請求額
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(
                  invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 入金確認モーダル */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              入金確認
            </h3>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                請求書番号: {selectedInvoice.invoiceNumber}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                クライアント: {selectedInvoice.clientName}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                請求額: {formatCurrency(selectedInvoice.totalAmount)}
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                入金額を入力してください
              </label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="入金額"
                autoFocus
              />

              {paidAmount && !isNaN(parseFloat(paidAmount)) && (
                <div className="mt-2 text-sm">
                  {parseFloat(paidAmount) === selectedInvoice.totalAmount ? (
                    <span className="text-green-600">過不足なし</span>
                  ) : parseFloat(paidAmount) > selectedInvoice.totalAmount ? (
                    <span className="text-blue-600">
                      過払い: {formatCurrency(parseFloat(paidAmount) - selectedInvoice.totalAmount)}
                      （次回請求で調整）
                    </span>
                  ) : (
                    <span className="text-red-600">
                      不足: {formatCurrency(selectedInvoice.totalAmount - parseFloat(paidAmount))}
                      （次回請求で調整）
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closePaymentModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                onClick={handleMarkAsPaid}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                入金確認
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              請求書の削除
            </h3>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                選択した{selectedInvoiceIds.size}件の請求書を削除します。
              </p>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  <strong>警告:</strong> この操作は取り消せません。PDFファイルも同時に削除されます。
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
