import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import Script from 'next/script'
import "../styles/globals.css"
import Header from "../components/Header"
import Footer from "../components/Footer"

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  // metadataBaseを追加
  metadataBase: new URL('https://ibaraki-memorial.com'),
  
  // 基本メタデータ - 茨城メモリアルパークを前方配置
  title: {
    default: '茨城メモリアルパーク【公式】土浦市藤沢のリース型永代供養墓',
    template: '%s | 茨城メモリアルパーク【公式】'
  },
  description: '茨城メモリアルパーク（茨城県土浦市藤沢1535）は月1万円から始められるリース型永代供養墓。継承不要・墓じまい不要で個別供養。神宮寺とカツミ石材の信頼のパートナーシップ。見学随時受付中。TEL:090-3068-5360',
  
  // キーワード（検索エンジン向け）- 茨城メモリアルパーク関連を強化
  keywords: [
    '茨城メモリアルパーク', '茨城メモリアルパーク 土浦', '茨城メモリアルパーク 藤沢',
    '茨城メモリアルパーク 永代供養', '茨城メモリアルパーク 料金', '茨城メモリアルパーク 見学',
    '茨城メモリアルパーク アクセス', '茨城メモリアルパーク 評判', '茨城メモリアルパーク 口コミ',
    '茨城', '土浦市', '藤沢', 'リース型永代供養', '永代供養墓', '墓地', '霊園',
    '継承不要', '墓じまい不要', '個別供養', '月1万円', '神宮寺 土浦',
    'カツミ石材', '茨城県 永代供養', 'お墓 土浦', '供養 茨城', '無縁墓対策',
    '090-3068-5360', '300-4116', 'つくば市 永代供養', '牛久市 永代供養', '阿見町 永代供養'
  ],

  // Open Graph (SNS最適化)
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://ibaraki-memorial.com',
    title: '茨城メモリアルパーク【公式】土浦市のリース型永代供養墓',
    description: '茨城メモリアルパークは茨城県土浦市藤沢のリース型永代供養墓。月1万円から始められ、継承や墓じまいの心配がない現代型のお墓。個別供養で安心してご利用いただけます。TEL:090-3068-5360',
    siteName: '茨城メモリアルパーク',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '茨城メモリアルパーク - 土浦市藤沢のリース型永代供養墓',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: '茨城メモリアルパーク【公式】月1万円から始める永代供養墓',
    description: '茨城メモリアルパークは月1万円から始められるリース型永代供養墓。継承不要で安心、個別供養で合祀に抵抗がある方にもおすすめ。茨城県土浦市藤沢 TEL:090-3068-5360',
    images: ['/images/og-image.jpg'],
  },

  // 地域SEO・構造化データ向け
  other: {
    'geo.region': 'JP-08',
    'geo.placename': '茨城県土浦市藤沢',
    'geo.position': '36.1244637;140.1540584', // 神宮寺の正確な座標
    'ICBM': '36.1244637, 140.1540584',
  },

  // robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': 'large',
      'max-image-preview': 'large',
      'max-snippet': 320,
    },
  },

  // canonical URL
  alternates: {
    canonical: 'https://ibaraki-memorial.com',
  },

  // アプリアイコン
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },

  // その他
  manifest: '/site.webmanifest',
  // Google Search Console認証コード - 登録時に設定してください
  // verification: {
  //   google: 'your-google-verification-code',
  // },
}

// 構造化データ（JSON-LD）- 茨城メモリアルパークの詳細情報
const cemeteryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Cemetery',
  '@id': 'https://ibaraki-memorial.com/#cemetery',
  name: '茨城メモリアルパーク',
  alternateName: ['茨城メモリアルパーク永代供養墓', '茨城メモリアルパーク土浦', '茨城メモリアルパーク藤沢'],
  description: '茨城メモリアルパークは茨城県土浦市藤沢のリース型永代供養墓。月1万円から始められ、継承不要で個別供養を行う現代型の墓地施設です。',
  url: 'https://ibaraki-memorial.com',
  telephone: '090-3068-5360',
  email: 'info@ibaraki-memorial.com',
  image: [
    {
      '@type': 'ImageObject',
      url: 'https://ibaraki-memorial.com/images/facility.jpg',
      caption: '茨城メモリアルパーク施設外観'
    },
    {
      '@type': 'ImageObject',
      url: 'https://ibaraki-memorial.com/images/hero1.jpg',
      caption: '茨城メモリアルパーク永代供養墓'
    }
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'JP',
    addressRegion: '茨城県',
    addressLocality: '土浦市',
    streetAddress: '藤沢1535',
    postalCode: '300-4116'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 36.1244637,
    longitude: 140.1540584
  },
  hasMap: 'https://maps.google.com/maps?cid=13305663077073506183',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '17:00'
    }
  ],
  amenityFeature: [
    {
      '@type': 'LocationFeatureSpecification',
      name: '駐車場完備',
      value: true
    },
    {
      '@type': 'LocationFeatureSpecification',
      name: '個別供養',
      value: true
    },
    {
      '@type': 'LocationFeatureSpecification',
      name: 'バリアフリー対応',
      value: true
    }
  ],
  serviceArea: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 36.1244637,
      longitude: 140.1540584
    },
    geoRadius: '50km',
    description: '茨城メモリアルパークは土浦市、つくば市、牛久市、阿見町、かすみがうら市、石岡市、龍ケ崎市、稲敷市など茨城県南部全域からアクセス可能'
  },
  priceRange: '年間12万円〜',
  currenciesAccepted: 'JPY',
  paymentAccepted: ['現金', '銀行振込'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '090-3068-5360',
    contactType: 'customer service',
    availableLanguage: 'Japanese',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '17:00'
    }
  },
  // 運営組織情報
  provider: [
    {
      '@type': 'Organization',
      name: '神宮寺',
      description: '茨城メモリアルパークの供養を担う寺院',
      address: {
        '@type': 'PostalAddress',
        addressLocality: '土浦市',
        addressRegion: '茨城県'
      }
    },
    {
      '@type': 'Organization', 
      name: '有限会社カツミ石材',
      description: '茨城メモリアルパークの施工・管理を担う石材店',
      address: {
        '@type': 'PostalAddress',
        addressLocality: '土浦市',
        addressRegion: '茨城県'
      }
    }
  ],
  // サイト制作情報
  author: {
    '@type': 'Organization',
    name: 'Asami Works',
    url: 'https://asami-works.com/',
    description: 'ウェブサイト制作・SEO対策'
  },
  sameAs: [
    'https://maps.google.com/maps?cid=13305663077073506183'
  ]
}

// ウェブサイトの構造化データ
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://ibaraki-memorial.com/#website',
  url: 'https://ibaraki-memorial.com',
  name: '茨城メモリアルパーク【公式サイト】',
  description: '茨城メモリアルパーク公式ウェブサイト。土浦市藤沢のリース型永代供養墓のご案内。',
  publisher: {
    '@id': 'https://ibaraki-memorial.com/#cemetery'
  },
  inLanguage: 'ja',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://ibaraki-memorial.com/?s={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
}

// パンくずリストの構造化データ
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '茨城メモリアルパーク',
      item: 'https://ibaraki-memorial.com'
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 環境変数からGoogle Analytics IDを取得
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="ja" className={notoSansJP.className}>
      <head>
        {/* 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(cemeteryJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Preload critical resources - JPGに変更 */}
        <link rel="preload" href="/images/hero1.jpg" as="image" />
        
        {/* 追加のメタタグ for 茨城メモリアルパーク */}
        <meta name="author" content="茨城メモリアルパーク（神宮寺・カツミ石材）" />
        <meta name="copyright" content="茨城メモリアルパーク" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={notoSansJP.className}>
        {/* スキップリンク（アクセシビリティ） */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 z-50"
        >
          メインコンテンツへスキップ
        </a>
        
        <Header />
        <div id="root">
          <main id="main-content">{children}</main>
        </div>
        <Footer />

        {/* Google Analytics - 環境変数が設定されている場合のみ読み込み */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  // プライバシー保護設定
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false,
                  // 地域ビジネス向けカスタム設定
                  custom_map: {
                    dimension1: 'ibaraki_memorial_park',
                    dimension2: 'cemetery_tsuchiura'
                  }
                });
                
                // ページ読み込み完了イベント
                gtag('event', 'page_view', {
                  page_title: document.title,
                  page_location: window.location.href,
                  content_group1: 'Ibaraki Memorial Park Website',
                  business_name: '茨城メモリアルパーク'
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}