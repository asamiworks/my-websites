/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pilias-artmake.com',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    changefreq: 'weekly',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: [
      '/api/*',
      '/404',
      '/500',
    ],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/'],
        },
      ],
      additionalSitemaps: [
        'https://pilias-artmake.com/sitemap.xml',
      ],
    },
    transform: async (config, path) => {
      // ページごとの優先度設定
      const priorityMap = {
        '/': 1.0,
        '/pricing': 0.9,
        '/artmake-features': 0.9,
        '/paramedical': 0.9,
        '/clinics': 0.8,
        '/gallery': 0.8,
        '/flow': 0.7,
        '/about': 0.6,
      }
      
      const priority = priorityMap[path] || 0.7
      
      return {
        loc: path,
        changefreq: config.changefreq,
        priority: priority,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        alternateRefs: config.alternateRefs ?? [],
      }
    },
  }