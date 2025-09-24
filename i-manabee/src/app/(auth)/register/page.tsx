'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card, Alert } from '@/components/ui';
import { useGuestOnly } from '@/hooks/useAuth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    ageConfirm: false,
    coppaConsent: false,
    childAge: ''
  });
  const [localError, setLocalError] = useState('');
  const [showCoppaConsent, setShowCoppaConsent] = useState(false);

  const auth = useGuestOnly();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 子どもの年齢が13歳未満の場合、COPPA同意を表示
    if (name === 'childAge') {
      const age = parseInt(value);
      setShowCoppaConsent(age < 13 && age > 0);
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.displayName) {
      setLocalError('すべての必須項目を入力してください');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('パスワードが一致しません');
      return false;
    }

    if (formData.password.length < 8) {
      setLocalError('パスワードは8文字以上で入力してください');
      return false;
    }

    // メールアドレス形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError('有効なメールアドレスを入力してください');
      return false;
    }

    if (!formData.agreeToTerms || !formData.agreeToPrivacy || !formData.ageConfirm) {
      setLocalError('すべての同意項目にチェックを入れてください');
      return false;
    }

    // COPPA対応：13歳未満の子どもがいる場合の追加チェック
    if (showCoppaConsent && !formData.coppaConsent) {
      setLocalError('13歳未満のお子様についての同意事項にチェックを入れてください');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) return;

    try {
      await auth.register(formData.email, formData.password, formData.displayName);
      // 成功時はuseGuestOnlyで自動リダイレクト
    } catch (err: any) {
      setLocalError(err.message || 'アカウントの作成に失敗しました');
    }
  };

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4 animate-bee-flying">🐝</div>
        <h1 className="text-2xl font-bold text-text-main mb-2">アカウント作成</h1>
        <p className="text-text-sub">まなびー先生と一緒に学習を始めましょう</p>
      </div>

      {/* エラー表示：認証エラーまたはローカルエラー */}
      {(auth.error || localError) && (
        <Alert
          variant="error"
          className="mb-6"
          dismissible
          onDismiss={() => setLocalError('')}
        >
          {localError || auth.error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-main mb-2">
            メールアドレス <span className="text-error-red">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input-base"
            placeholder="保護者の方のメールアドレス"
            required
          />
          <p className="text-xs text-text-sub mt-1">
            確認メールを送信しますので、受信可能なメールアドレスをご入力ください
          </p>
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-text-main mb-2">
            お名前 <span className="text-error-red">*</span>
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleInputChange}
            className="input-base"
            placeholder="保護者の方のお名前"
            required
          />
          <p className="text-xs text-text-sub mt-1">
            子どもへのメッセージで使用されます
          </p>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-main mb-2">
            パスワード <span className="text-error-red">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="input-base"
            placeholder="8文字以上のパスワード"
            required
          />
          <p className="text-xs text-text-sub mt-1">
            英数字を含む8文字以上で設定してください
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-main mb-2">
            パスワード確認 <span className="text-error-red">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="input-base"
            placeholder="パスワードを再入力"
            required
          />
        </div>

        {/* 子どもの年齢確認 */}
        <div className="bg-blue-50 border border-kids-blue rounded-lg p-4">
          <h3 className="font-semibold text-text-main mb-3">👶 お子様の年齢確認</h3>
          <div className="mb-3">
            <label htmlFor="childAge" className="block text-sm font-medium text-text-main mb-2">
              ご利用予定のお子様の年齢
            </label>
            <select
              id="childAge"
              name="childAge"
              value={formData.childAge}
              onChange={handleInputChange}
              className="input-base"
              required
            >
              <option value="">年齢を選択してください</option>
              {Array.from({length: 13}, (_, i) => i + 6).map(age => (
                <option key={age} value={age}>{age}歳</option>
              ))}
            </select>
          </div>

          {/* COPPA同意（13歳未満の場合のみ表示） */}
          {showCoppaConsent && (
            <div className="bg-warning-yellow bg-opacity-20 border border-warning-yellow rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-text-main mb-2 flex items-center">
                <span className="mr-2">🛡️</span>
                COPPA準拠の追加同意（13歳未満のお子様）
              </h4>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="coppaConsent"
                  checked={formData.coppaConsent}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-honey-yellow focus:ring-honey-yellow mt-1"
                  required
                />
                <span className="text-sm text-text-main">
                  私は13歳未満の子どもの保護者として、以下に同意します：<br/>
                  • 子どもの個人情報収集・利用に同意します<br/>
                  • 学習履歴・対話内容の記録に同意します<br/>
                  • 安全性向上のためのデータ分析に同意します<br/>
                  • <Link href="/legal/coppa" className="text-honey-yellow hover:underline" target="_blank">
                    児童保護方針
                  </Link>を確認し同意します
                </span>
              </label>
            </div>
          )}
        </div>

        {/* 年齢確認 */}
        <div className="bg-yellow-50 border border-warning-yellow rounded-lg p-4">
          <h3 className="font-semibold text-text-main mb-3">📋 保護者年齢確認（重要）</h3>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="ageConfirm"
              checked={formData.ageConfirm}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-honey-yellow focus:ring-honey-yellow mt-1"
              required
            />
            <span className="text-sm text-text-main">
              私は18歳以上の保護者であり、お子様のためにこのアカウントを作成することを確認します。
            </span>
          </label>
        </div>

        {/* 同意事項 */}
        <div className="space-y-3">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-honey-yellow focus:ring-honey-yellow mt-1"
              required
            />
            <span className="text-sm text-text-main">
              <Link href="/legal/terms" className="text-honey-yellow hover:underline" target="_blank">
                利用規約
              </Link>
              に同意します <span className="text-error-red">*</span>
            </span>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="agreeToPrivacy"
              checked={formData.agreeToPrivacy}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-honey-yellow focus:ring-honey-yellow mt-1"
              required
            />
            <span className="text-sm text-text-main">
              <Link href="/legal/privacy" className="text-honey-yellow hover:underline" target="_blank">
                プライバシーポリシー
              </Link>
              に同意します <span className="text-error-red">*</span>
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={auth.isLoading}
          className="bg-gradient-to-r from-honey-yellow to-warning-yellow"
        >
          {auth.isLoading ? 'アカウント作成中...' : 'アカウント作成'}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-text-sub">
          すでにアカウントをお持ちの方は{' '}
          <Link
            href="/login"
            className="text-honey-yellow hover:text-yellow-600 font-semibold transition-colors"
          >
            ログイン
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-start space-x-2 text-xs text-text-sub">
          <span>🛡️</span>
          <div>
            <p className="font-semibold mb-1">安全性について</p>
            <ul className="space-y-1">
              <li>• お子様の個人情報は適切に保護されます</li>
              <li>• AI応答は安全性チェックを通過したもののみ表示</li>
              <li>• 不適切な内容を検出した場合は保護者に通知</li>
              <li>• COPPA（児童オンラインプライバシー保護法）に準拠</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}