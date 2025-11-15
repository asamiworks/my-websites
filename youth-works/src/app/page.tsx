'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Client, Invoice } from '@/lib/types';

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // クライアントデータを取得
      const clientsResponse = await fetch('/api/clients');
      const clientsData = await clientsResponse.json();
      if (clientsData.success) {
        setClients(clientsData.data || []);
      }

      // 請求書データを取得
      const invoicesResponse = await fetch('/api/invoices');
      const invoicesData = await invoicesResponse.json();
      if (invoicesData.success) {
        setInvoices(invoicesData.data || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // アクティブなクライアント数
  const activeClientsCount = clients.filter(c => c.status === 'active').length;

  // 今月の請求書
  const currentMonth = format(new Date(), 'yyyy-MM');
  const currentMonthInvoices = invoices.filter(inv => {
    const invoiceMonth = format(new Date(inv.issueDate), 'yyyy-MM');
    return invoiceMonth === currentMonth;
  });

  // 今月の総請求額
  const currentMonthTotal = currentMonthInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  // 最近の請求書（最新5件）
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100"
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ダッシュボード
          </h2>
          <p className="text-gray-600">
            システムの統計情報と最近の活動を表示します
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">
              アクティブクライアント数
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {isLoading ? '-' : activeClientsCount}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">
              今月の請求書
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {isLoading ? '-' : currentMonthInvoices.length}件
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">
              今月の総請求額
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {isLoading ? '-' : `¥${currentMonthTotal.toLocaleString()}`}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">
              ステータス
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <div className="text-lg font-semibold text-gray-900">正常</div>
            </div>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            クイックアクション
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/clients/new"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              新規クライアント登録
            </Link>
            <Link
              href="/invoices/generate"
              className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              請求書一括生成
            </Link>
            <Link
              href="/settings/company"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              会社情報設定
            </Link>
          </div>
        </div>

        {/* 最近の活動 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            最近の請求書
          </h3>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : recentInvoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              まだ請求書がありません
            </div>
          ) : (
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {invoice.clientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.invoiceNumber} • {format(new Date(invoice.issueDate), 'yyyy/MM/dd')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ¥{invoice.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {invoice.status === 'paid' ? '入金済み' :
                       invoice.status === 'overdue' ? '期限超過' :
                       invoice.status === 'cancelled' ? 'キャンセル' : '発行済み'}
                    </div>
                  </div>
                </div>
              ))}
              {invoices.length > 5 && (
                <div className="pt-2">
                  <Link
                    href="/invoices"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    すべての請求書を見る →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
