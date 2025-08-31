import { Metadata } from 'next';
import Header from "@/components/Header";
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import '../styles/globals.css';

// AIO最適化されたコンポーネント
import MistakesSection from '../components/MistakesSection';
import StepByStepGuide from '../components/StepByStepGuide';
import CostBreakdown from '../components/CostBreakdown';
import CompanyComparisonGuide from '../components/CompanyComparisonGuide';
import FrequentQuestions from '../components/FrequentQuestions';
import SuccessStories from '../components/SuccessStories';
import TrustIndicators from '../components/TrustIndicators';
import ServiceFeatures from '../components/ServiceFeatures';
import HowItWorks from '../components/HowItWorks'; 
import CTASection from '../components/CTASection';

export const metadata: Metadata = {
  title: '注文住宅で失敗しない家づくり | 無料診断 - マイホームスターター',
  description: '注文住宅営業経験者が教える、失敗しない家づくりの方法。無料の総予算シミュレータで適正予算を診断。営業トークの裏側、予算オーバーを防ぐコツを公開。',
  keywords: '注文住宅,失敗しない,家づくり,無料診断,総予算シミュレータ,営業経験者,予算オーバー,営業トーク,展示場',
  openGraph: {
    title: '注文住宅で失敗しない家づくり | マイホームスターター',
    description: '営業経験者が運営する無料診断サービス。展示場に行く前に適正予算を把握しましょう。',
    type: 'website',
    url: 'https://my-home-starter.com/',
    images: [
      {
        url: 'https://my-home-starter.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '注文住宅で失敗しない家づくり',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '注文住宅で失敗しない家づくり | マイホームスターター',
    description: '営業経験者が教える、失敗しない家づくりの方法。無料診断で適正予算を把握。',
  },
  alternates: {
    canonical: 'https://my-home-starter.com/',
  },
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "マイホームスターター",
    "description": "失敗しない家づくりのための住宅会社マッチングサービス。専門家のサポートで理想の住宅会社を見つけます。",
    "url": "https://my-home-starter.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://my-home-starter.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "家づくりで最も多い失敗は何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "予算オーバー、間取りの後悔、住宅会社選びの失敗が最も多い失敗です。マイホームスターターでは、これらの失敗を防ぐための専門的なサポートを提供しています。"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      
      <div>
        <Header />
        
        {/* ヒーローセクション - 失敗しない家づくりを強調 */}
        <HeroSection />
        
        {/* 信頼性指標 - E-E-A-Tを強化 */}
        <TrustIndicators />
        
        {/* サービスの特徴 - 選ばれる理由を明確に */}
        <ServiceFeatures />
        
        {/* よくある失敗とその対策 - AIO最適化 */}
        <MistakesSection />
        
        {/* 失敗しない家づくりのステップガイド */}
        <StepByStepGuide />
        
        {/* 予算・費用の詳細解説 - 具体的な数値でAIO対策 */}
        <CostBreakdown />
        
        {/* 住宅会社の比較ガイド - 選び方の詳細 */}
        <CompanyComparisonGuide />
        
        
        {/* 成功事例 - 具体的なストーリー */}
        <SuccessStories />
        
        {/* よくある質問 - Q&A形式でAIO最適化 */}
        <FrequentQuestions />

        {/* サービスの利用方法 - 4ステップで簡単に説明 */}
        <HowItWorks />
        
        {/* CTAセクション */}
        <CTASection />
        
        <Footer />
      </div>
    </>
  );
}