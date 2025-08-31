import { Metadata } from 'next';
import HousingConciergeClient from './HousingConciergeClient';
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: '家づくりアドバイス・無料診断 | 注文住宅で失敗しない方法 - マイホームスターター',
  description: '注文住宅営業経験者が教える失敗しない家づくり。総予算シミュレータで適正予算を無料診断。営業トークの裏側、土地選びのコツ、予算オーバーを防ぐ方法を公開。',
  keywords: '注文住宅,失敗しない,家づくり,無料診断,総予算シミュレータ,営業経験者,予算オーバー,土地選び,住宅会社選び',
  openGraph: {
    title: '注文住宅で失敗しない家づくり無料診断 | マイホームスターター',
    description: '営業経験者が教える家づくりの真実。総予算シミュレータで適正予算を診断。',
    type: 'website',
    url: 'https://my-home-starter.com/Housing-concierge',
  },
  alternates: {
    canonical: 'https://my-home-starter.com/Housing-concierge',
  },
};

export default function HousingConciergePage() {
  return (
    <>
      <Header />
      <HousingConciergeClient />
      
      {/* 構造化データ - FAQSchema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "なぜ注文住宅で失敗する人が多いのですか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "初めて家を建てる方と住宅営業マンの間に圧倒的な知識差があるためです。営業トークに流されて予算オーバーしたり、重要な確認事項を見落としたりすることが主な原因です。"
                }
              },
              {
                "@type": "Question",
                "name": "家づくりの総予算シミュレータとは何ですか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "年収や生活費から、無理のない住宅購入予算を算出する無料診断ツールです。通常は住宅会社の営業マンに聞かないとわからない情報を、展示場に行く前に把握できます。"
                }
              },
              {
                "@type": "Question",
                "name": "営業経験者のアドバイスはなぜ価値があるのですか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "営業手法の裏側を知っているため、『今だけ特別価格』などの営業トークの真実や、見積もりに含まれない隠れたコストなど、通常は教えてもらえない情報を提供できるからです。"
                }
              }
            ]
          })
        }}
      />
      
      {/* 構造化データ - ServiceSchema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "家づくり無料診断・アドバイスサービス",
            "provider": {
              "@type": "Organization",
              "name": "マイホームスターター"
            },
            "serviceType": "住宅購入コンサルティング",
            "areaServed": "日本全国",
            "description": "注文住宅で失敗しない家づくりをサポート。総予算診断から土地選び、住宅会社選びまで営業経験者がアドバイス。",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "JPY"
            }
          })
        }}
      />
    </>
  );
}