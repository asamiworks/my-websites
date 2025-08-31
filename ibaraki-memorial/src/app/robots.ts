import { MetadataRoute } from 'next'

// 静的出力用の設定
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
          '/api/',
          '/form/thanks', // サンクスページは検索結果に表示不要
          '/*.json$',
          '/*?*', // パラメータ付きURLを制限
          '/*/feed.xml',
        ],
        crawlDelay: 1, // クローラーへの配慮
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/', 
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/images/',
        disallow: '/private/',
      },
      // 不要なボットをブロック
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://ibaraki-memorial.com/sitemap.xml',
    host: 'https://ibaraki-memorial.com',
  }
}