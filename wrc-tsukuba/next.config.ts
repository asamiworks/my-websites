import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: "export",  // Firebase Hosting 用の静的エクスポート
  reactStrictMode: true,
  images: {
    unoptimized: true, // Next.js の画像最適化を無効化
  }
};

export default nextConfig;
