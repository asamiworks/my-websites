// src/app/sitemap.ts
import { MetadataRoute } from 'next'

// 静的エクスポート用の設定
export const dynamic = 'force-static'
export const revalidate = false

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://asami-works.com'
  // 静的な日付を使用（ビルド時の日付）
  const currentDate = new Date('2025-08-07')

  return [
    // メインページ
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    
    // 会社情報
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // メインサービスページ
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    
    // 主要サービスページ
    {
      url: `${baseUrl}/services/webapp`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // パッケージプラン
    {
      url: `${baseUrl}/services/package`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
    // オリジナルプラン
    {
      url: `${baseUrl}/services/original`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/original/lp`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/original/corporate`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/original/grant`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // パッケージデモページ - コーポレート
    {
      url: `${baseUrl}/services/package/demo/corporate`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/services/package/demo/corporate/consulting`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/services/package/demo/corporate/logistics`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/services/package/demo/corporate/manufacturing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/services/package/demo/corporate/medical`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    
    // パッケージデモページ - LP
    {
      url: `${baseUrl}/services/package/demo/lp`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/services/package/demo/lp/beauty`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/services/package/demo/lp/education`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/services/package/demo/lp/food`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/services/package/demo/lp/medical`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    
    // 補助金・助成金
    {
      url: `${baseUrl}/subsidy`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    
    // フォーム・お問い合わせ
    {
      url: `${baseUrl}/estimate`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/form`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    
    // 法的ページ
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/tokushoho`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}