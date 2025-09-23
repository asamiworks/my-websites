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

// メンテナンスモードフラグ
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

export const metadata: Metadata = {
  title: MAINTENANCE_MODE 
    ? 'メンテナンス中 | マイホームスターター' 
    : '注文住宅で失敗しない家づくり | 無料診断 - マイホームスターター',
  description: MAINTENANCE_MODE
    ? 'マイホームスターターは現在メンテナンス中です。より良いサービスをご提供するため、リニューアル作業を行っています。'
    : '注文住宅営業経験者が教える、失敗しない家づくりの方法。無料の総予算シミュレータで適正予算を診断。営業トークの裏側、予算オーバーを防ぐコツを公開。',
  keywords: '注文住宅,失敗しない,家づくり,無料診断,総予算シミュレータ,営業経験者,予算オーバー,営業トーク,展示場',
  openGraph: {
    title: MAINTENANCE_MODE
      ? 'メンテナンス中 | マイホームスターター'
      : '注文住宅で失敗しない家づくり | マイホームスターター',
    description: MAINTENANCE_MODE
      ? 'サイトリニューアル中です。2025年10月公開予定。'
      : '営業経験者が運営する無料診断サービス。展示場に行く前に適正予算を把握しましょう。',
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

// メンテナンス表示コンポーネント
function MaintenanceMode() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* ロゴ */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-3">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">マイホームスターター</h1>
          </div>
        </div>

        {/* メンテナンスバッジ */}
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
          </svg>
          メンテナンス中
        </div>

        {/* メインメッセージ */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          より良いサービスのために
          <span className="block text-blue-600 mt-2">リニューアル中です</span>
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          注文住宅で失敗しない家づくりをサポートする<br />
          新機能を準備しています
        </p>

        {/* リニューアル情報カード */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-sm text-gray-500 mb-2">リニューアルオープン予定</div>
          <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
            2025年10月
          </div>
          
          {/* 新機能プレビュー */}
          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="font-bold text-gray-900 mb-1">🏠 全国対応</div>
              <p className="text-sm text-gray-600">47都道府県の優良工務店データベース</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="font-bold text-gray-900 mb-1">💰 予算診断</div>
              <p className="text-sm text-gray-600">AIによる適正予算シミュレーション</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="font-bold text-gray-900 mb-1">🎯 マッチング</div>
              <p className="text-sm text-gray-600">最適な住宅会社を自動提案</p>
            </div>
          </div>
        </div>

        {/* 今後の予定 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-8">
          <h3 className="text-xl font-bold mb-3">リニューアル内容</h3>
          <div className="text-left space-y-2 max-w-lg mx-auto">
            <div className="flex items-start">
              <span className="text-green-300 mr-2">✓</span>
              <span>営業経験者による失敗しない家づくりガイド</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-300 mr-2">✓</span>
              <span>無料の総予算シミュレータ機能</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-300 mr-2">✓</span>
              <span>展示場に行く前の事前準備サポート</span>
            </div>
          </div>
        </div>

        {/* お問い合わせ */}
        <p className="text-sm text-gray-500">
          お問い合わせ: info@my-home-starter.com
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  // メンテナンスモードの場合
  if (MAINTENANCE_MODE) {
    return <MaintenanceMode />;
  }

  // 通常モードの場合（既存のコード）
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
        <HeroSection />
        <TrustIndicators />
        <ServiceFeatures />
        <MistakesSection />
        <StepByStepGuide />
        <CostBreakdown />
        <CompanyComparisonGuide />
        <SuccessStories />
        <FrequentQuestions />
        <HowItWorks />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}