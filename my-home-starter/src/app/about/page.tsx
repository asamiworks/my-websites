import { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';
import Header from "../../components/Header";

export const metadata: Metadata = {
  title: 'マイホームスターターについて | 注文住宅営業経験者が運営する家づくり無料相談',
  description: '注文住宅で失敗する人を減らしたい。営業経験者だから知っている家づくりの真実、予算オーバーの原因、営業トークの裏側を公開。無料の総予算シミュレータで適正予算を診断。',
  keywords: '注文住宅,営業経験者,家づくり,失敗,予算オーバー,営業トーク,無料相談,総予算診断',
  openGraph: {
    title: '営業経験者が教える注文住宅で失敗しない方法 | マイホームスターター',
    description: '住宅営業の裏側を知る私たちが、本当に必要な家づくりの知識を提供します。',
    type: 'website',
    url: 'https://my-home-starter.com/about',
  },
  alternates: {
    canonical: 'https://my-home-starter.com/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <AboutPageClient />
      
      {/* 構造化データ - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "マイホームスターター",
            "description": "注文住宅営業経験者が運営する、家づくり無料相談サービス",
            "url": "https://my-home-starter.com",
            "foundingDate": "2025",
            "founder": {
              "@type": "Person",
              "name": "注文住宅営業経験者チーム"
            },
            "knowsAbout": ["注文住宅", "家づくり", "住宅ローン", "土地選び", "住宅会社選び"],
            "slogan": "注文住宅で失敗しない家づくりを"
          })
        }}
      />
      
      {/* 構造化データ - Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "なぜ注文住宅で失敗する人が多いのか - 営業経験者が語る真実",
            "description": "住宅営業経験者が、家づくりで失敗する原因と対策を解説。知識格差、感情的な意思決定、予算オーバーを防ぐ方法。",
            "author": {
              "@type": "Organization",
              "name": "マイホームスターター"
            },
            "publisher": {
              "@type": "Organization",
              "name": "マイホームスターター",
              "logo": {
                "@type": "ImageObject",
                "url": "https://my-home-starter.com/logo.png"
              }
            },
            "datePublished": "2025-01-01",
            "dateModified": "2025-06-23"
          })
        }}
      />
    </>
  );
}