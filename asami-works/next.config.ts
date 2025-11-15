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
    buildActivityPosition: 'bottom-right',
  }
}

export default nextConfig