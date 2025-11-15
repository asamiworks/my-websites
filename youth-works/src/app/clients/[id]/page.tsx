'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Client, ClientFormData, Invoice } from '@/lib/types';

interface ClientDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ClientFormData | null>(null);

  useEffect(() => {
    const initializeParams = async () => {
      const { id } = await params;
      setClientId(id);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      try {
        // クライアント情報を取得
        const clientResponse = await fetch(`/api/clients/${clientId}`);
        const clientResult = await clientResponse.json();

        if (clientResult.success) {
          setClient(clientResult.data);

          // このクライアントの請求書を取得
          const invoicesResponse = await fetch('/api/invoices');
          const invoicesResult = await invoicesResponse.json();

          if (invoicesResult.success) {
            // このクライアントの請求書のみをフィルタリング、最新順
            const clientInvoices = (invoicesResult.data || [])
              .filter((inv: Invoice) => inv.clientId === clientId)
              .sort((a: Invoice, b: Invoice) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            setInvoices(clientInvoices);
          }
        } else {
          setError(clientResult.error?.message || 'クライアント情報の取得に失敗しました');
        }
      } catch (err) {
        setError('クライアント情報の取得に失敗しました');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const handleEdit = () => {
    if (client) {
      setFormData({
        clientName: client.clientName,
        siteName: client.siteName,
        siteUrl: client.siteUrl || '',
        postalCode: client.postalCode,
        address1: client.address1,
        address2: client.address2 || '',
        sitePublishDate: client.sitePublishDate.split('T')[0],
        initialProductionCost: client.initialProductionCost,
        billingFrequency: client.billingFrequency,
        currentManagementFee: client.currentManagementFee,
        contractStartDate: client.contractStartDate.split('T')[0],
        contractEndDate: client.contractEndDate ? client.contractEndDate.split('T')[0] : '',
        notes: client.notes || '',
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(null);
    setError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!formData) return;

    const { name, value, type } = e.target;

    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: type === 'number' ? (value ? parseFloat(value) : undefined) : value,
      };
    });
  };

  const handleSave = async () => {
    if (!clientId || !formData) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || '更新に失敗しました');
      }

      setClient(result.data);
      setIsEditing(false);
      setFormData(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-12">読み込み中...</div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error || 'クライアントが見つかりません'}
        </div>
        <button
          onClick={() => router.push('/clients')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          クライアント一覧に戻る
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{client.clientName}</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                編集
              </button>
              <button
                onClick={() => router.push('/clients')}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                一覧に戻る
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* 基本情報 */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">基本情報</h2>
        </div>
        <div className="px-6 py-4 grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              クライアント名
            </label>
            {isEditing && formData ? (
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{client.clientName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              サイト名
            </label>
            {isEditing && formData ? (
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{client.siteName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              郵便番号
            </label>
            {isEditing && formData ? (
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{client.postalCode}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              住所
            </label>
            {isEditing && formData ? (
              <>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  required
                  placeholder="都道府県市区町村"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder="建物名・部屋番号"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            ) : (
              <p className="text-gray-900">
                {client.address1}
                {client.address2 && <span className="block">{client.address2}</span>}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              サイトURL
            </label>
            {isEditing && formData ? (
              <input
                type="url"
                name="siteUrl"
                value={formData.siteUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : client.siteUrl ? (
              <a
                href={client.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {client.siteUrl}
              </a>
            ) : (
              <p className="text-gray-500">未設定</p>
            )}
          </div>
        </div>

        {/* 契約情報 */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 border-t">
          <h2 className="text-xl font-semibold text-gray-900">契約情報</h2>
        </div>
        <div className="px-6 py-4 grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              サイト公開日（管理開始日）
            </label>
            {isEditing && formData ? (
              <input
                type="date"
                name="sitePublishDate"
                value={formData.sitePublishDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formatDate(client.sitePublishDate)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              契約開始日
            </label>
            {isEditing && formData ? (
              <input
                type="date"
                name="contractStartDate"
                value={formData.contractStartDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formatDate(client.contractStartDate)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              契約終了日
            </label>
            {isEditing && formData ? (
              <input
                type="date"
                name="contractEndDate"
                value={formData.contractEndDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : client.contractEndDate ? (
              <p className="text-gray-900">{formatDate(client.contractEndDate)}</p>
            ) : (
              <p className="text-gray-500">未設定</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <p className="text-gray-900">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {client.isActive ? 'アクティブ' : '非アクティブ'}
              </span>
            </p>
          </div>
        </div>

        {/* 料金情報 */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 border-t">
          <h2 className="text-xl font-semibold text-gray-900">料金情報</h2>
        </div>
        <div className="px-6 py-4 grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              初回制作費
            </label>
            {isEditing && formData ? (
              <input
                type="number"
                name="initialProductionCost"
                value={formData.initialProductionCost || ''}
                onChange={handleChange}
                min="0"
                step="1000"
                placeholder="100000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : client.initialProductionCost ? (
              <p className="text-gray-900">
                {formatCurrency(client.initialProductionCost)}
                {client.hasInvoicedProduction && (
                  <span className="ml-2 text-xs text-gray-500">(請求済み)</span>
                )}
              </p>
            ) : (
              <p className="text-gray-500">未設定</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              現在の管理費
            </label>
            {isEditing && formData ? (
              <input
                type="number"
                name="currentManagementFee"
                value={formData.currentManagementFee || ''}
                onChange={handleChange}
                required
                min="0"
                step="100"
                placeholder="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">
                {formatCurrency(client.currentManagementFee)}/
                {client.billingFrequency === 'monthly' ? '月' : '年'}
                {client.billingFrequency === 'yearly' && (
                  <span className="block text-sm text-gray-500 mt-1">
                    実際の年間請求額: {formatCurrency(client.currentManagementFee * 11)}
                    <span className="text-xs ml-1">(1ヶ月サービス)</span>
                  </span>
                )}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              請求頻度
            </label>
            {isEditing && formData ? (
              <select
                name="billingFrequency"
                value={formData.billingFrequency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">月次</option>
                <option value="yearly">年次</option>
              </select>
            ) : (
              <p className="text-gray-900">
                {client.billingFrequency === 'monthly' ? '月次請求' : '年次請求（年1回）'}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              入金状況
            </label>
            <p className="text-gray-900">
              {client.lastPaidPeriod ? (
                <>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                    入金済み
                  </span>
                  {client.lastPaidPeriod.replace('-', '年')}月分まで
                </>
              ) : (
                <>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                    未入金
                  </span>
                  {client.billingFrequency === 'yearly' && '（年払い予定）'}
                </>
              )}
            </p>
          </div>
        </div>

        {/* 請求書発行履歴 */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 border-t">
          <h2 className="text-xl font-semibold text-gray-900">請求書発行履歴</h2>
        </div>
        {invoices.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>まだ請求書が発行されていません</p>
          </div>
        ) : (
          <div className="px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">請求書番号</th>
                    <th className="pb-3">発行日</th>
                    <th className="pb-3">請求期間</th>
                    <th className="pb-3 text-right">請求額</th>
                    <th className="pb-3 text-right">入金額</th>
                    <th className="pb-3 text-right">過不足</th>
                    <th className="pb-3 text-center">ステータス</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="text-sm">
                      <td className="py-3 font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="py-3 text-gray-600">
                        {formatDate(invoice.issueDate)}
                      </td>
                      <td className="py-3 text-gray-600">
                        {invoice.billingYear}年{invoice.billingMonth}月
                      </td>
                      <td className="py-3 text-right text-gray-900">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="py-3 text-right text-gray-900">
                        {invoice.paidAmount ? formatCurrency(invoice.paidAmount) : '-'}
                      </td>
                      <td className="py-3 text-right">
                        {invoice.paymentDifference !== undefined && invoice.paymentDifference !== null ? (
                          <span className={invoice.paymentDifference === 0 ? 'text-gray-600' : invoice.paymentDifference > 0 ? 'text-blue-600' : 'text-red-600'}>
                            {invoice.paymentDifference === 0 ? '-' : (invoice.paymentDifference > 0 ? '+' : '') + formatCurrency(Math.abs(invoice.paymentDifference))}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'issued' ? 'bg-blue-100 text-blue-800' :
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status === 'paid' ? '入金済み' :
                           invoice.status === 'issued' ? '発行済み' :
                           invoice.status === 'overdue' ? '期限超過' : 'キャンセル'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 備考 */}
        {(client.notes || isEditing) && (
          <>
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 border-t">
              <h2 className="text-xl font-semibold text-gray-900">備考</h2>
            </div>
            <div className="px-6 py-4">
              {isEditing && formData ? (
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="特記事項があれば入力してください"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">{client.notes}</p>
              )}
            </div>
          </>
        )}

        {/* メタ情報 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">作成日時:</span>{' '}
              {formatDate(client.createdAt)}
            </div>
            <div>
              <span className="font-medium">更新日時:</span>{' '}
              {formatDate(client.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
