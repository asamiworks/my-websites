import { Metadata } from 'next';
import Hero from "../components/sections/Hero";
import Problems from "../components/sections/Problems";
import Solutions from "../components/sections/Solutions";
import WhyMe from "../components/sections/WhyMe";
import Works from "../components/sections/Works";
import Strengths from "../components/sections/Strengths";
import Process from "../components/sections/Process";
import FAQ from "../components/sections/FAQ";
import FlowCta from "../components/sections/FlowCta";

// SEO最適化されたメタデータ
export const metadata: Metadata = {
  title: 'AsamiWorks｜茨城・千葉の小規模事業者持続化補助金対応ホームページ制作',
  description: '茨城県・千葉県でホームページ制作をお探しなら AsamiWorks。小規模事業者持続化補助金を活用して最大66.7%の費用削減。SEO対策・スマホ対応・保守サポートまで一貫対応。地域の中小企業様のビジネス成長を支援します。',
  keywords: ['ホームページ制作', 'Web制作', '茨城県', '千葉県', '小規模事業者持続化補助金', '補助金対応', 'SEO対策', 'レスポンシブデザイン', '中小企業支援', 'AsamiWorks'],
  authors: [{ name: 'AsamiWorks' }],
  creator: 'AsamiWorks',
  publisher: 'AsamiWorks',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://asami-works.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AsamiWorks｜茨城・千葉の小規模事業者持続化補助金対応ホームページ制作',
    description: '小規模事業者持続化補助金を活用したWeb制作で最大66.7%の費用削減。地域密着型のきめ細かなサポートで、あなたのビジネスを成功に導きます。',
    url: 'https://asami-works.com',
    siteName: 'AsamiWorks',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AsamiWorks - 補助金対応ホームページ制作',
      }
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AsamiWorks｜小規模事業者持続化補助金対応のホームページ制作',
    description: '茨城・千葉の中小企業様向け。補助金活用で最大66.7%の費用削減も可能。まずは無料相談から。',
    images: ['/twitter-card.jpg'],
    creator: '@asamiworks',
  },
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
  verification: {
    google: 'your-google-verification-code', // Google Search Consoleの認証コード
  },
};

// 構造化データを生成する関数
function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebDesignAgency",
        "@id": "https://asami-works.com/#organization",
        "name": "AsamiWorks",
        "alternateName": "アサミワークス",
        "description": "茨城県・千葉県エリアに特化したホームページ制作会社。補助金・助成金を活用した費用対効果の高いWeb制作を提供。",
        "url": "https://asami-works.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://asami-works.com/logo.png",
          "width": 600,
          "height": 60
        },
        "image": "https://asami-works.com/og-image.jpg",
        "priceRange": "¥¥",
        "areaServed": [
          {
            "@type": "State",
            "name": "茨城県",
            "containedIn": {
              "@type": "Country",
              "name": "日本"
            }
          },
          {
            "@type": "State", 
            "name": "千葉県",
            "containedIn": {
              "@type": "Country",
              "name": "日本"
            }
          }
        ],
        "serviceType": ["ホームページ制作", "Web制作", "SEO対策", "補助金申請サポート"],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": "Japanese"
        },
        "sameAs": [
          "https://www.instagram.com/asamiworks_web/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://asami-works.com/#website",
        "url": "https://asami-works.com",
        "name": "AsamiWorks",
        "description": "茨城・千葉の補助金対応ホームページ制作",
        "publisher": {
          "@id": "https://asami-works.com/#organization"
        },
        "inLanguage": "ja"
      },
      {
        "@type": "WebPage",
        "@id": "https://asami-works.com/#webpage",
        "url": "https://asami-works.com",
        "name": "AsamiWorks｜茨城・千葉の補助金対応ホームページ制作 - 中小企業のデジタル化を支援",
        "isPartOf": {
          "@id": "https://asami-works.com/#website"
        },
        "about": {
          "@id": "https://asami-works.com/#organization"
        },
        "description": "茨城県・千葉県でホームページ制作をお探しなら AsamiWorks。補助金・助成金を活用した費用対効果の高いWeb制作で、地域の中小企業様のビジネス成長を支援します。",
        "inLanguage": "ja"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "ホーム",
            "item": "https://asami-works.com"
          }
        ]
      }
    ]
  };
}

export default function HomePage() {
  return (
    <>
      {/* 構造化データをscriptタグで追加 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />
      
      {/* ファーストビュー */}
      <Hero />
      
      {/* 課題提起 - 共感を生む */}
      <Problems />
      
      {/* ソリューション - 解決策の提示 */}
      <Solutions />
      
      
      {/* 個人事業主の強み - 大手との差別化 */}
      <WhyMe />
      
      {/* 制作実績 - 信頼性の証明 */}
      <Works />
      
      {/* AsamiWorksの強み - 選ばれる理由 */}
      <Strengths />

      {/* 制作の流れ - 安心感の提供 */}
      <Process />
      
      {/* よくある質問 - 不安の解消 */}
      <FAQ />

      {/* CTA - 行動喚起 */}
      <FlowCta />
    </>
  );
}
