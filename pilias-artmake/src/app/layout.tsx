import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { getPageMetadata } from '@/lib/seo/metadata'
import { generateJsonLd } from '@/lib/seo/schema'

// フォント設定（パフォーマンス最適化）
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-noto-serif',
  display: 'swap',
  preload: true,
  fallback: ['serif'],
})

// ビューポート設定
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#F5F5F0',
}

// メタデータ設定（拡張版）
export const metadata: Metadata = {
  ...getPageMetadata('home'),
  metadataBase: new URL('https://pilias-artmake.com'),
  alternates: {
    canonical: 'https://pilias-artmake.com',
    languages: {
      'ja': 'https://pilias-artmake.com',
    },
  },
  verification: {
    // Google Search Console - 取得後に設定してください
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code', 
    // yahoo: 'your-yahoo-verification-code',
  },
  category: '医療・美容',
  classification: '医療アートメイク',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light',
  creator: 'PILIAS ARTMAKE',
  publisher: 'PILIAS ARTMAKE',
  applicationName: 'PILIAS ARTMAKE',
  generator: 'Next.js',
  authors: [
    { name: 'PILIAS ARTMAKE', url: 'https://pilias-artmake.com' }
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#F5F5F0',
      },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-TileColor': '#F5F5F0',
    'msapplication-config': '/browserconfig.xml',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'PILIAS ARTMAKE',
    'format-detection': 'telephone=no',
  },
}

// 構造化データの生成
const generateStructuredData = () => {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': 'https://pilias-artmake.com/#organization',
    name: 'PILIAS ARTMAKE',
    alternateName: 'ピリアスアートメイク',
    url: 'https://pilias-artmake.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://pilias-artmake.com/logo.png',
      width: 240,
      height: 150,
    },
    image: 'https://pilias-artmake.com/og-image.jpg',
    description: '医療アートメイクとパラメディカルアートメイクの専門クリニック。銀座・柏・横浜で展開。',

    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
      addressRegion: '東京都',
    },
    sameAs: [
      'https://www.instagram.com/asuka_artmake_para/',
      'https://line.me/R/ti/p/@209fsxqv',
    ],
    medicalSpecialty: [
      'PlasticSurgery',
      'Dermatology'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '施術メニュー',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MedicalProcedure',
            name: '眉毛アートメイク',
            description: '自然な眉毛を演出する医療アートメイク',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MedicalProcedure',
            name: 'リップアートメイク',
            description: '血色感のある美しい唇を演出',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MedicalProcedure',
            name: 'パラメディカルアートメイク',
            description: '傷跡・白斑・ストレッチマークの改善',
          },
        },
      ],
    },
    // レビュー情報は実際のレビューが集まり次第追加してください
    // aggregateRating: {
    //   '@type': 'AggregateRating',
    //   ratingValue: '4.8',
    //   reviewCount: '256',
    //   bestRating: '5',
    //   worstRating: '1'
    // },
  }

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://pilias-artmake.com/#website',
    url: 'https://pilias-artmake.com',
    name: 'PILIAS ARTMAKE',
    description: '医療アートメイク・パラメディカルアートメイク専門クリニック',
    publisher: {
      '@id': 'https://pilias-artmake.com/#organization'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://pilias-artmake.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'ja-JP'
  }

  return [organizationData, websiteData]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = generateStructuredData()

  return (
    <html 
      lang="ja" 
      className={`${notoSansJP.variable} ${notoSerifJP.variable}`}
      prefix="og: http://ogp.me/ns#"
    >
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* PWA設定 */}
        <meta name="application-name" content="PILIAS ARTMAKE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PILIAS ARTMAKE" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#F5F5F0" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#F5F5F0" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* 構造化データ */}
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
      </head>
      
      <body className={`${notoSansJP.className} bg-cream text-charcoal`}>
        {/* Google Tag Manager (noscript) - 実装時は有効化してください */}
        {/* <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript> */}
        
        {/* Skip to main content (アクセシビリティ) */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-4 py-2 rounded-md shadow-lg z-50"
        >
          メインコンテンツへスキップ
        </a>
        
        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          <Footer />
        </div>
        
        {/* SNSフローティングボタン（モバイルのみ） */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 md:hidden" role="complementary" aria-label="ソーシャルメディアリンク">
          {/* Instagram ボタン - 公式カラーグラデーション */}
          <a
            href="https://www.instagram.com/asuka_artmake_para/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            style={{
              background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)'
            }}
            aria-label="Instagramをフォロー"
          >
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
            </svg>
          </a>
          
          {/* LINE ボタン */}
          <a
            href="https://line.me/R/ti/p/@209fsxqv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#06C755] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="LINEで予約"
          >
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
          </a>
        </div>

        {/* Google Tag Manager - 実装時はGTM-XXXXXXを実際のIDに置き換えてください */}
        {/* <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXX');
            `,
          }}
        /> */}

        {/* Google Analytics 4 - 実装時はG-XXXXXXXXXXを実際のIDに置き換えてください */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
              send_page_view: true
            });
          `}
        </Script> */}

        {/* Facebook Pixel - 実装時はYOUR_PIXEL_IDを実際のIDに置き換えてください */}
        {/* <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
            alt=""
          />
        </noscript> */}

        {/* LINE Tag - 実装時はYOUR_LINE_TAG_IDを実際のIDに置き換えてください */}
        {/* <Script id="line-tag" strategy="afterInteractive">
          {`
            (function(g,d,o){
              g._ltq=g._ltq||[];g._lt=g._lt||function(){g._ltq.push(arguments)};
              var h=location.protocol==='https:'?'https://d.line-scdn.net':'http://d.line-cdn.net';
              var s=d.createElement('script');s.async=1;
              s.src=o||h+'/n/line_tag/public/release/v1/lt.js';
              var t=d.getElementsByTagName('script')[0];t.parentNode.insertBefore(s,t);
            })(window, document);
            _lt('init', {
              customerType: 'lap',
              tagId: 'YOUR_LINE_TAG_ID'
            });
            _lt('send', 'pv', ['YOUR_LINE_TAG_ID']);
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://tr.line.me/tag.gif?c_t=lap&t_id=YOUR_LINE_TAG_ID&e=pv&noscript=1" 
            alt=""
          />
        </noscript> */}
      </body>
    </html>
  )
}