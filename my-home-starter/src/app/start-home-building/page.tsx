import { Metadata } from 'next';
import StartHomeBuildingClient from './StartHomeBuildingClient';

export const metadata: Metadata = {
  title: '家づくり総予算シミュレーター | 3分で無料診断 - マイホームスターター',
  description: '注文住宅の適正予算を5分で無料診断。営業経験者が作った本当に使える総予算計算ツール。年収から無理のない予算を算出し、展示場で失敗しない家づくりをサポート。',
  keywords: '家づくり,総予算,シミュレーター,無料診断,注文住宅,予算計算,適正予算,失敗しない,展示場,営業経験者',
  openGraph: {
    title: '家づくり総予算シミュレーター（無料3分診断） | マイホームスターター',
    description: '展示場に行く前に必須！営業マンが教えない本当の適正予算を診断。予算オーバーを防ぐ。',
    type: 'website',
    url: 'https://my-home-starter.com/start-home-building',
    images: [
      {
        url: 'https://my-home-starter.com/images/budget-simulator-og.jpg',
        width: 1200,
        height: 630,
        alt: '家づくり総予算シミュレーター',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '家づくり総予算シミュレーター | 無料3分診断',
    description: '展示場に行く前に適正予算を把握。営業経験者が作った本当に使える診断ツール。',
  },
  alternates: {
    canonical: 'https://my-home-starter.com/start-home-building',
  },
};

export default function StartHomeBuildingPage() {
  return (
    <>
      <StartHomeBuildingClient />
      
      {/* 構造化データ - HowToSchema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "注文住宅の適正予算を診断する方法",
            "description": "家づくりで失敗しないための総予算シミュレーターの使い方",
            "image": "https://my-home-starter.com/images/budget-simulator.jpg",
            "estimatedCost": {
              "@type": "MonetaryAmount",
              "currency": "JPY",
              "value": "0"
            },
            "supply": [],
            "tool": [
              {
                "@type": "HowToTool",
                "name": "総予算シミュレーター"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "text": "年収・貯蓄額を入力",
                "name": "基本情報の入力"
              },
              {
                "@type": "HowToStep",
                "text": "生活費・将来支出を確認",
                "name": "支出の確認"
              },
              {
                "@type": "HowToStep",
                "text": "無理のない総予算を確認",
                "name": "診断結果の確認"
              }
            ],
            "totalTime": "PT3M"
          })
        }}
      />
      
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
                "name": "なぜ展示場に行く前に総予算診断が必要なのですか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "展示場の営業マンは契約を取ることが仕事なので、『大丈夫です』『皆さんこれくらいです』と予算を超えた提案をすることがあります。事前に適正予算を知っておくことで、冷静な判断ができ、予算オーバーを防げます。"
                }
              },
              {
                "@type": "Question",
                "name": "総予算シミュレーターは本当に無料ですか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "はい、完全無料です。営業電話もありません。注文住宅営業経験者が、多くの方に失敗しない家づくりをしてほしいという想いで提供しています。"
                }
              },
              {
                "@type": "Question",
                "name": "診断にかかる時間はどれくらいですか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "約3分で診断が完了します。年収や貯蓄額など、基本的な情報を入力するだけで、適正な総予算が算出されます。"
                }
              }
            ]
          })
        }}
      />
    </>
  );
}