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
  }
}

export default nextConfig