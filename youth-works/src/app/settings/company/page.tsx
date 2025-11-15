'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Company, CompanyFormData } from '@/lib/types';

export default function CompanySettingsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    postalCode: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    taxNumber: '',
    businessNumber: '',
    representative: '',
    bankInfo: {
      bankName: '',
      branchName: '',
      accountType: '普通',
      accountNumber: '',
      accountHolder: '',
    },
    paymentTerms: 30,
    invoiceSettings: {
      closingDayType: 'end_of_month',
      issueDayType: 'first_of_next_month',
      dueDateType: 'end_of_issue_month',
      adjustDueDateForHolidays: true,
    },
  });

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch('/api/company');
      const result = await response.json();

      if (result.success && result.data) {
        setFormData(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch company info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || '保存に失敗しました');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith('bankInfo.')) {
      const bankField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bankInfo: {
          ...prev.bankInfo,
          [bankField]: value,
        },
      }));
    } else if (name.startsWith('invoiceSettings.')) {
      const settingField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        invoiceSettings: {
          ...prev.invoiceSettings,
          [settingField]: type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : settingField.includes('Day') || settingField.includes('Days')
            ? parseInt(value) || undefined
            : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'paymentTerms' ? parseInt(value) || 30 : value,
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

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
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                請求書管理
              </Link>
              <Link
                href="/settings"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100"
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
            会社情報設定
          </h2>
          <p className="text-gray-600">
            請求書に表示される会社情報を設定します
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800">会社情報を保存しました</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {/* 基本情報 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  会社名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  代表者名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="representative"
                  value={formData.representative}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                    電話番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="03-1234-5678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  住所 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="東京都渋谷区..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="info@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ウェブサイト
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    事業者番号
                  </label>
                  <input
                    type="text"
                    name="businessNumber"
                    value={formData.businessNumber}
                    onChange={handleChange}
                    placeholder="T1234567890123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    支払期限（日数）
                  </label>
                  <input
                    type="number"
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 銀行口座情報 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">銀行口座情報</h3>

            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    銀行名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankInfo.bankName"
                    value={formData.bankInfo.bankName}
                    onChange={handleChange}
                    required
                    placeholder="○○銀行"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    支店名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankInfo.branchName"
                    value={formData.bankInfo.branchName}
                    onChange={handleChange}
                    required
                    placeholder="○○支店"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    口座種別 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bankInfo.accountType"
                    value={formData.bankInfo.accountType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="普通">普通</option>
                    <option value="当座">当座</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    口座番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankInfo.accountNumber"
                    value={formData.bankInfo.accountNumber}
                    onChange={handleChange}
                    required
                    placeholder="1234567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  口座名義 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bankInfo.accountHolder"
                  value={formData.bankInfo.accountHolder}
                  onChange={handleChange}
                  required
                  placeholder="カブシキガイシャ○○"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 請求書設定 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">請求書設定</h3>

            <div className="grid grid-cols-1 gap-6">
              {/* 締め日設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  締め日 <span className="text-red-500">*</span>
                </label>
                <select
                  name="invoiceSettings.closingDayType"
                  value={formData.invoiceSettings.closingDayType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="end_of_month">月末</option>
                  <option value="specific_day">指定日</option>
                </select>
                {formData.invoiceSettings.closingDayType === 'specific_day' && (
                  <input
                    type="number"
                    name="invoiceSettings.closingDay"
                    value={formData.invoiceSettings.closingDay || ''}
                    onChange={handleChange}
                    min="1"
                    max="31"
                    placeholder="日にち（1-31）"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* 発行日設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  発行日 <span className="text-red-500">*</span>
                </label>
                <select
                  name="invoiceSettings.issueDayType"
                  value={formData.invoiceSettings.issueDayType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="next_day">締め日の翌日</option>
                  <option value="first_of_next_month">翌月1日</option>
                  <option value="specific_day">指定日</option>
                </select>
                {formData.invoiceSettings.issueDayType === 'specific_day' && (
                  <input
                    type="number"
                    name="invoiceSettings.issueDay"
                    value={formData.invoiceSettings.issueDay || ''}
                    onChange={handleChange}
                    min="1"
                    max="31"
                    placeholder="日にち（1-31）"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                <p className="mt-1 text-sm text-gray-500">
                  現在の設定: 締め日{formData.invoiceSettings.closingDayType === 'end_of_month' ? '月末' : `${formData.invoiceSettings.closingDay}日`}の
                  {formData.invoiceSettings.issueDayType === 'next_day' ? '翌日' :
                   formData.invoiceSettings.issueDayType === 'first_of_next_month' ? '翌月1日' :
                   `翌月${formData.invoiceSettings.issueDay}日`}に発行
                </p>
              </div>

              {/* 支払い期限設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  支払い期限 <span className="text-red-500">*</span>
                </label>
                <select
                  name="invoiceSettings.dueDateType"
                  value={formData.invoiceSettings.dueDateType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="end_of_issue_month">発行月の月末</option>
                  <option value="days_after_issue">発行日からN日後</option>
                  <option value="specific_day">指定日</option>
                </select>
                {formData.invoiceSettings.dueDateType === 'days_after_issue' && (
                  <input
                    type="number"
                    name="invoiceSettings.dueDateDays"
                    value={formData.invoiceSettings.dueDateDays || ''}
                    onChange={handleChange}
                    min="1"
                    placeholder="日数"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                {formData.invoiceSettings.dueDateType === 'specific_day' && (
                  <input
                    type="number"
                    name="invoiceSettings.dueDateDay"
                    value={formData.invoiceSettings.dueDateDay || ''}
                    onChange={handleChange}
                    min="1"
                    max="31"
                    placeholder="日にち（1-31）"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                <p className="mt-1 text-sm text-gray-500">
                  例: 11/1発行の場合、支払い期限は
                  {formData.invoiceSettings.dueDateType === 'end_of_issue_month' ? '11/30' :
                   formData.invoiceSettings.dueDateType === 'days_after_issue' ? `発行日から${formData.invoiceSettings.dueDateDays || 'N'}日後` :
                   `11/${formData.invoiceSettings.dueDateDay || 'XX'}`}
                </p>
              </div>

              {/* 土日祝日前倒し（支払い期限のみ） */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="invoiceSettings.adjustDueDateForHolidays"
                    checked={formData.invoiceSettings.adjustDueDateForHolidays}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    支払い期限が土日祝日の場合は前倒しする
                  </span>
                </label>
                <p className="mt-1 ml-6 text-xs text-gray-500">
                  ※ 発行日は土日祝日でも変更されません
                </p>
              </div>
            </div>
          </div>

          {/* フォームアクション */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/settings"
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              戻る
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
