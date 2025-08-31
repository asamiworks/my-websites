import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/my-page/',
        '/check-email',
        '/verify-email',
        '/create-account',
        '/login',
      ],
    },
    sitemap: 'https://my-home-starter.com/sitemap.xml',
  }
}