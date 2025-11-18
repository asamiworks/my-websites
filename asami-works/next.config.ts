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
  // ESLint をビルド時にスキップ
  eslint: {
    ignoreDuringBuilds: true
  },
  // フォントの自動最適化を無効化
  optimizeFonts: false,
  // 自動プリフェッチを無効化（プリロード警告対策）
  experimental: {
    optimizePackageImports: [],
    // CSSチャンクの最適化を無効化
    optimizeCss: false,
  },
  // WebpackでCSSプリロードを制御
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアント側でのプリロードリンクの生成を制限
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
            priority: 20,
          },
        },
      };
    }
    return config;
  },
}

export default nextConfig