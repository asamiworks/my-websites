import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  // 本番ビルド時の最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // プリフェッチの最適化
  devIndicators: {
    position: 'bottom-right',
  },
  // ESLint をビルド時にスキップ（Next.js 15 の既知の問題を回避）
  eslint: {
    ignoreDuringBuilds: true
  },
  // フォントの自動最適化を無効化
  optimizeFonts: false,
  // CSS・JSの自動プリロードを無効化
  experimental: {
    optimizePackageImports: [],
  },
  // Link ヘッダーのプリロードを無効化
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '',
          },
        ],
      },
    ]
  },
}

export default nextConfig