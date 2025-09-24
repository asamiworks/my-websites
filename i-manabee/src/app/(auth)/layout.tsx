'use client';

import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-cream to-yellow-50 flex flex-col">
      {/* シンプルなヘッダー */}
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-3 w-fit">
            <div className="text-3xl animate-bee-flying">🐝</div>
            <div>
              <h1 className="text-2xl font-bold text-honey-yellow">i-manabee</h1>
              <p className="text-sm text-text-sub">あいまなびー</p>
            </div>
          </Link>
        </div>
      </header>

      {/* メインコンテンツエリア */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* フッター */}
      <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-text-sub mb-4 sm:mb-0">
              &copy; 2025 AsamiWorks. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link href="/legal/terms" className="text-text-sub hover:text-honey-yellow transition-colors">
                利用規約
              </Link>
              <Link href="/legal/privacy" className="text-text-sub hover:text-honey-yellow transition-colors">
                プライバシーポリシー
              </Link>
              <Link href="/legal/coppa" className="text-text-sub hover:text-honey-yellow transition-colors">
                児童保護方針
              </Link>
              <Link href="/contact" className="text-text-sub hover:text-honey-yellow transition-colors">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}