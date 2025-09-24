'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card, Alert } from '@/components/ui';
import { useGuestOnly } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const auth = useGuestOnly();

  // ローカル状態での追加エラー管理
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // バリデーション
    if (!email || !password) {
      setLocalError('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      await auth.login(email, password);
      // 成功時はuseGuestOnlyで自動リダイレクト
    } catch (err: any) {
      setLocalError(err.message || 'ログインに失敗しました');
    }
  };

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4 animate-bee-flying">🐝</div>
        <h1 className="text-2xl font-bold text-text-main mb-2">ログイン</h1>
        <p className="text-text-sub">まなびー先生とお勉強を再開しましょう</p>
      </div>

      {/* エラー表示：認証エラーまたはローカルエラー */}
      {(auth.error || localError) && (
        <Alert
          variant="error"
          className="mb-6"
          dismissible
          onDismiss={() => {
            setLocalError('');
            // auth.errorはストア経由でクリアする必要がある場合があります
          }}
        >
          {localError || auth.error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-main mb-2">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base"
            placeholder="あなたのメールアドレス"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-main mb-2">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base"
            placeholder="パスワード"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 text-honey-yellow focus:ring-honey-yellow"
            />
            <span className="ml-2 text-sm text-text-sub">ログイン状態を保持</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm text-honey-yellow hover:text-yellow-600 transition-colors"
          >
            パスワードを忘れた方
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={auth.isLoading}
          className="bg-gradient-to-r from-honey-yellow to-warning-yellow"
        >
          {auth.isLoading ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-text-sub">
          アカウントをお持ちでない方は{' '}
          <Link
            href="/register"
            className="text-honey-yellow hover:text-yellow-600 font-semibold transition-colors"
          >
            こちらから無料登録
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-xs text-text-sub mb-4">
          ログインすることで、以下に同意したものとみなされます
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <Link
            href="/legal/terms"
            className="text-text-sub hover:text-honey-yellow transition-colors"
          >
            利用規約
          </Link>
          <Link
            href="/legal/privacy"
            className="text-text-sub hover:text-honey-yellow transition-colors"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/legal/coppa"
            className="text-text-sub hover:text-honey-yellow transition-colors"
          >
            児童保護方針
          </Link>
        </div>
      </div>
    </Card>
  );
}