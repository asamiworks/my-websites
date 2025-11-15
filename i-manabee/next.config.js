/** @type {import('next').NextConfig} */
const nextConfig = {
  // 本番環境での最適化設定
  compress: true,
  poweredByHeader: false,

  // 静的エクスポートの設定（Firebase Hosting用）
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',

  // 実験的機能
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // 画像最適化の設定
  images: {
    unoptimized: true, // Firebase Hostingでは外部画像最適化を使用
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      }
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // 環境変数の設定
  env: {
    CUSTOM_KEY: 'i-manabee',
    BUILD_TIME: new Date().toISOString(),
  },

  // セキュリティヘッダー（middleware.tsで追加設定）
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // リダイレクト設定
  async redirects() {
    return [
      {
        source: '/chat.html',
        destination: '/chat',
        permanent: true,
      },
      {
        source: '/login.html',
        destination: '/login',
        permanent: true,
      },
    ];
  },

  // 書き換え設定（API Routes用）
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // TypeScript設定
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint設定
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Webpack設定
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Bundle Analyzer（開発時のみ）
    if (!dev && !isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: '../bundle-analyzer-report.html',
        })
      );
    }

    // クライアントサイドでのNode.js専用モジュールの処理
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // SVG処理
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // パフォーマンス最適化
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            enforce: true,
          },
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            name: 'firebase',
            priority: 20,
            enforce: true,
          },
          ui: {
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            priority: 15,
            enforce: true,
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;