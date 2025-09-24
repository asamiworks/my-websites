'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card, ManabeeButton } from '@/components/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-cream to-yellow-50">
      {/* ヘッダー */}
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl animate-bee-flying">🐝</div>
            <div>
              <h1 className="text-2xl font-bold text-honey-yellow">i-manabee</h1>
              <p className="text-sm text-text-sub">あいまなびー</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/pricing" className="text-text-main hover:text-honey-yellow transition-colors">
              料金プラン
            </Link>
            <Link href="/about" className="text-text-main hover:text-honey-yellow transition-colors">
              まなびーについて
            </Link>
            <Link href="/contact" className="text-text-main hover:text-honey-yellow transition-colors">
              お問い合わせ
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                ログイン
              </Button>
            </Link>
            <Link href="/register">
              <ManabeeButton size="sm">
                無料で始める
              </ManabeeButton>
            </Link>
          </nav>

          {/* モバイルメニューボタン */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-8xl mb-6 animate-bee-flying inline-block">
              🐝
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-text-main mb-4">
              AI体験は
              <span className="text-honey-yellow">「まなびー」</span>
            </h2>
            <p className="text-xl sm:text-2xl text-text-sub mb-8 max-w-2xl mx-auto">
              6-18歳の子どもたちに「安心して使えるAI学習体験」を提供します
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <ManabeeButton size="lg" className="w-full sm:w-auto px-8 py-4">
                無料で始める
              </ManabeeButton>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4">
                デモを見る
              </Button>
            </Link>
          </div>

          {/* 特徴カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2 text-text-main">安心・安全</h3>
              <p className="text-text-sub">
                COPPA準拠の安全性設計で、保護者の方も安心してご利用いただけます
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2 text-text-main">年齢別最適化</h3>
              <p className="text-text-sub">
                小学生・中学生・高校生それぞれに最適化されたUIとAI応答
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 text-text-main">学習分析</h3>
              <p className="text-text-sub">
                週次レポートで学習状況を保護者の方と共有
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 料金プランプレビュー */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white bg-opacity-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-main mb-12">
            料金プラン
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 無料プラン */}
            <Card className="p-6 text-center">
              <h3 className="text-lg font-semibold text-free-gray mb-2">無料プラン</h3>
              <div className="text-3xl font-bold text-text-main mb-4">¥0</div>
              <ul className="text-sm text-text-sub space-y-2 mb-6">
                <li>5回/期まで利用</li>
                <li>1人まで</li>
                <li>基本AI応答</li>
              </ul>
              <Button variant="outline" size="sm" fullWidth>
                今すぐ始める
              </Button>
            </Card>

            {/* まなびーキッズ */}
            <Card className="p-6 text-center border-kids-blue">
              <h3 className="text-lg font-semibold text-kids-blue mb-2">まなびーキッズ</h3>
              <div className="text-3xl font-bold text-text-main mb-4">¥480</div>
              <ul className="text-sm text-text-sub space-y-2 mb-6">
                <li>4,000トークン/期</li>
                <li>小学3年生まで</li>
                <li>教科別AI</li>
              </ul>
              <Button variant="primary" size="sm" fullWidth className="bg-kids-blue">
                選択する
              </Button>
            </Card>

            {/* まなびーフレンズ */}
            <Card className="p-6 text-center border-friends-purple border-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-friends-purple text-white px-3 py-1 rounded-full text-xs font-semibold">
                  人気
                </span>
              </div>
              <h3 className="text-lg font-semibold text-friends-purple mb-2">まなびーフレンズ</h3>
              <div className="text-3xl font-bold text-text-main mb-4">¥880</div>
              <ul className="text-sm text-text-sub space-y-2 mb-6">
                <li>8,000トークン/期</li>
                <li>3人まで</li>
                <li>週次レポート</li>
              </ul>
              <Button variant="primary" size="sm" fullWidth className="bg-friends-purple">
                選択する
              </Button>
            </Card>

            {/* まなびープレミアム */}
            <Card className="p-6 text-center border-premium-gold">
              <h3 className="text-lg font-semibold text-premium-gold mb-2">まなびープレミアム</h3>
              <div className="text-3xl font-bold text-text-main mb-4">¥1,540</div>
              <ul className="text-sm text-text-sub space-y-2 mb-6">
                <li>無制限利用</li>
                <li>5人まで</li>
                <li>優先サポート</li>
              </ul>
              <Button variant="primary" size="sm" fullWidth className="bg-premium-gold">
                選択する
              </Button>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing" className="text-honey-yellow hover:text-yellow-600 font-semibold">
              すべての料金プランを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA セクション */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-main mb-4">
            今すぐまなびー先生と学習を始めよう！
          </h2>
          <p className="text-lg text-text-sub mb-8">
            無料プランでお試しいただけます。クレジットカード不要です。
          </p>
          <Link href="/register">
            <ManabeeButton size="lg" className="px-8 py-4">
              無料で始める
            </ManabeeButton>
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🐝</span>
                <span className="text-xl font-bold text-honey-yellow">i-manabee</span>
              </div>
              <p className="text-gray-400">
                安心して使えるAI学習体験を提供します
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">サービス</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">まなびーについて</Link></li>
                <li><Link href="/pricing" className="hover:text-white">料金プラン</Link></li>
                <li><Link href="/features" className="hover:text-white">機能</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">サポート</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">ヘルプ</Link></li>
                <li><Link href="/contact" className="hover:text-white">お問い合わせ</Link></li>
                <li><Link href="/faq" className="hover:text-white">よくある質問</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">法的情報</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/legal/terms" className="hover:text-white">利用規約</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white">プライバシーポリシー</Link></li>
                <li><Link href="/legal/coppa" className="hover:text-white">児童保護方針</Link></li>
                <li><Link href="/legal/sct" className="hover:text-white">特商法表記</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AsamiWorks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}