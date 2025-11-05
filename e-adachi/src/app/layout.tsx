import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

// 基本メタデータ
export const metadata: Metadata = {
  metadataBase: new URL('https://jh-ad.jp'),
  title: {
    default: '株式会社足立電機 | 茨城県龍ケ崎市の電気工事・設備工事',
    template: '%s | 株式会社足立電機'
  },
  description: '茨城県龍ケ崎市の電気工事・設備工事なら株式会社足立電機。確かな技術力と豊富な実績で、お客様のニーズに合わせた最適なソリューションをご提供します。',
  keywords: ['電気工事', '設備工事', '茨城県', '龍ケ崎市', '法人向け', 'BtoB', '電気設備'],
  authors: [{ name: '株式会社足立電機' }],
  creator: 'AsamiWorks',
  publisher: '株式会社足立電機',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // OGP設定
  openGraph: {
    title: '株式会社足立電機 | 茨城県龍ケ崎市の電気工事・設備工事',
    description: '茨城県龍ケ崎市の電気工事・設備工事なら株式会社足立電機。確かな技術力と豊富な実績で、お客様のニーズに合わせた最適なソリューションをご提供します。',
    url: 'https://jh-ad.jp',
    siteName: '株式会社足立電機',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: 'https://jh-ad.jp/og-image.jpg', // 絶対URLで指定
        width: 1200,
        height: 630,
        alt: '株式会社足立電機 - 確かな技術力で未来を照らす',
        type: 'image/jpeg',
      }
    ],
  },
  // Twitter Card設定
  twitter: {
    card: 'summary_large_image',
    title: '株式会社足立電機 | 茨城県龍ケ崎市の電気工事・設備工事',
    description: '茨城県龍ケ崎市の電気工事・設備工事なら株式会社足立電機。',
    images: ['https://jh-ad.jp/og-image.jpg'], // 絶対URLで指定
  },
  // その他のメタ情報
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://jh-ad.jp',
  },
}

// 構造化データ（JSON-LD）
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ElectricalContractor',
  name: '株式会社足立電機',
  description: '茨城県龍ケ崎市の電気工事・設備工事会社',
  url: 'https://jh-ad.jp',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '松ヶ丘4丁目4番1号',
    addressLocality: '龍ケ崎市',
    addressRegion: '茨城県',
    postalCode: '301-0853',
    addressCountry: 'JP'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 35.9111, // 実際の緯度を設定
    longitude: 140.1833 // 実際の経度を設定
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:30',
    closes: '17:00'
  },
  areaServed: {
    '@type': 'State',
    name: '茨城県'
  },
  priceRange: '法人向け',
  paymentAccepted: ['現金', '銀行振込'],
  currenciesAccepted: 'JPY'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}