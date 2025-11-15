'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Client } from '@/lib/types';
import { format } from 'date-fns';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'データの取得に失敗しました');
      }

      setClients(result.data || []);
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
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100"
              >
                クライアント管理
              </Link>
              <Link
                href="/invoices"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
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
              クライアント管理
            </h2>
            <p className="text-gray-600">
              クライアント情報の登録・編集・管理を行います
            </p>
          </div>
          <Link
            href="/clients/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            新規登録
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* クライアント一覧 */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                読み込み中...
              </div>
            </div>
          ) : clients.length === 0 ? (
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">クライアントが登録されていません</p>
                <p className="text-sm">
                  「新規登録」ボタンから最初のクライアントを登録してください
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      クライアント名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      サイト名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      公開日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      管理費
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
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {client.clientName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client.siteName}
                        </div>
                        {client.siteUrl && (
                          <div className="text-xs text-gray-500">
                            {client.siteUrl}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(client.sitePublishDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(client.currentManagementFee)}/{client.billingFrequency === 'monthly' ? '月' : '年'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {client.isActive ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            有効
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            無効
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/clients/${client.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          詳細
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 統計情報 */}
        {clients.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">
                総クライアント数
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {clients.length}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">
                アクティブ
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {clients.filter(c => c.isActive).length}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">
                月間総管理費
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(
                  clients
                    .filter(c => c.isActive)
                    .reduce((sum, c) => sum + c.currentManagementFee, 0)
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
