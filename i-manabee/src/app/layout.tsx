import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/styles/variables.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'i-manabee（あいまなびー）',
    template: '%s | i-manabee（あいまなびー）'
  },
  description: '6-18歳向けの安心して使える学習AI。まなびー先生と一緒に楽しく学ぼう！🐝',
  keywords: ['AI', '学習', '教育', '子ども', 'まなびー', 'i-manabee', '安全'],
  authors: [{ name: 'AsamiWorks', url: 'https://github.com/asamiworks' }],
  creator: 'AsamiWorks（浅見洋輔）',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://i-manabee.com',
    title: 'i-manabee（あいまなびー）',
    description: '6-18歳向けの安心して使える学習AI',
    siteName: 'i-manabee',
    images: [
      {
        url: '/images/manabee-og-image.png',
        width: 1200,
        height: 630,
        alt: 'i-manabee（あいまなびー）'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'i-manabee（あいまなびー）',
    description: '6-18歳向けの安心して使える学習AI',
    creator: '@asamiworks',
    images: ['/images/manabee-twitter-card.png']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-search-console-verification-code'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Security headers (X-Frame-Options and X-Content-Type-Options are set via HTTP headers in middleware) */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Viewport and responsive */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FFB300" />
        <meta name="msapplication-TileColor" content="#FFB300" />

        {/* PWA関連（将来的に追加予定） */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="まなびー" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'i-manabee（あいまなびー）',
              description: '6-18歳向けの安心して使える学習AI',
              url: 'https://i-manabee.com',
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'JPY'
              },
              author: {
                '@type': 'Organization',
                name: 'AsamiWorks',
                founder: {
                  '@type': 'Person',
                  name: '浅見洋輔'
                }
              },
              audience: {
                '@type': 'PeopleAudience',
                suggestedMinAge: 6,
                suggestedMaxAge: 18
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-bg-cream text-text-main`}>
        {/* Skip to main content (アクセシビリティ) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-honey-yellow text-white px-4 py-2 rounded-md z-50"
        >
          メインコンテンツへスキップ
        </a>

        {/* メインコンテンツ */}
        <div id="main-content" className="min-h-screen">
          {children}
        </div>

        {/* Development tools */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50 p-2 bg-black bg-opacity-75 text-white text-xs rounded">
            🔧 開発モード
          </div>
        )}

        {/* Analytics (本番環境で追加予定) */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              async
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}