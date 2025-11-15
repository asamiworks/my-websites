'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClientFormData } from '@/lib/types';

export default function NewClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ClientFormData>({
    clientName: '',
    siteName: '',
    siteUrl: '',
    postalCode: '',
    address1: '',
    address2: '',
    sitePublishDate: '',
    initialProductionCost: undefined,
    billingFrequency: 'monthly',
    currentManagementFee: 0,
    contractStartDate: '',
    contractEndDate: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || '登録に失敗しました');
      }

      // 成功したらクライアント一覧に戻る
      router.push('/clients');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : undefined) : value,
    }));
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            新規クライアント登録
          </h2>
          <p className="text-gray-600">
            新しいクライアントの情報を入力してください
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {/* 基本情報 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  クライアント名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サイト名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サイトURL
                </label>
                <input
                  type="url"
                  name="siteUrl"
                  value={formData.siteUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 住所情報 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">住所情報</h3>

            <div className="grid grid-cols-1 gap-6">
              <div className="md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  郵便番号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  placeholder="123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  住所1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  required
                  placeholder="都道府県市区町村"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  住所2
                </label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder="建物名・部屋番号"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 契約・料金情報 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">契約・料金情報</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サイト公開日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="sitePublishDate"
                  value={formData.sitePublishDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  毎月この日付に請求書が自動生成されます
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  初回制作費用（円）
                </label>
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
                <p className="text-sm text-gray-500 mt-1">
                  初回請求書に含める制作費
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  月額管理費（円） <span className="text-red-500">*</span>
                </label>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  請求サイクル
                </label>
                <select
                  name="billingFrequency"
                  value={formData.billingFrequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">月次</option>
                  <option value="yearly">年次</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  契約開始日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="contractStartDate"
                  value={formData.contractStartDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  契約終了日
                </label>
                <input
                  type="date"
                  name="contractEndDate"
                  value={formData.contractEndDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 備考 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              備考
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="特記事項があれば入力してください"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* フォームアクション */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/clients"
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '登録中...' : '登録'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
