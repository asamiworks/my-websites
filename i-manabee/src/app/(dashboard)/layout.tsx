'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Firebase ログアウト実装
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-bg-cream">
      {/* ダッシュボードヘッダー */}
      <header className="bg-white shadow-manabee-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* ロゴ */}
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="text-2xl animate-bee-flying">🐝</div>
              <div>
                <h1 className="text-xl font-bold text-honey-yellow">i-manabee</h1>
                <p className="text-xs text-text-sub">ダッシュボード</p>
              </div>
            </Link>

            {/* ナビゲーション */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-text-main hover:text-honey-yellow transition-colors"
              >
                ホーム
              </Link>
              <Link
                href="/dashboard/profile"
                className="text-text-main hover:text-honey-yellow transition-colors"
              >
                プロファイル
              </Link>
              <Link
                href="/chat"
                className="text-text-main hover:text-honey-yellow transition-colors"
              >
                チャット
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-text-main hover:text-honey-yellow transition-colors"
              >
                設定
              </Link>
            </nav>

            {/* ユーザーメニュー */}
            <div className="flex items-center space-x-4">
              {/* 通知ベル */}
              <button className="p-2 text-text-sub hover:text-honey-yellow transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 17a2 2 0 01-2-2V7a2 2 0 012-2h0a2 2 0 012 2v8a2 2 0 01-2 2z" />
                </svg>
              </button>

              {/* ログアウト */}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                ログアウト
              </Button>

              {/* モバイルメニュー */}
              <button className="md:hidden p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}