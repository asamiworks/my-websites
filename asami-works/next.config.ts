import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  // CSS プリロード警告を抑制
  experimental: {
    optimizeCss: false
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
  }
}

export default nextConfig