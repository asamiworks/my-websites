"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

// 新しいセクション構成
import HeroSection from "../components/sections/HeroSection";
import ConceptSection from "../components/sections/ConceptSection";
import CourseOverview from "../components/sections/CourseOverview";
import HowToUseSection from "../components/sections/HowToUseSection";
import PricingSection from "../components/sections/PricingSection";
import SafetySection from "../components/sections/SafetySection";
// InstagramSection を削除
import CTASection from "../components/sections/CTASection";
import AccessSection from "../components/sections/AccessSection";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Header />

      <main>
        {/* 1. ヒーローセクション - インパクトのあるファーストビュー */}
        <HeroSection />

        {/* 2. コンセプト - 3つの特徴（広さ、4コース、無人受付） */}
        <ConceptSection />

        {/* 3. コース紹介 - 4つのコースを統合して紹介 */}
        <CourseOverview />

        {/* 4. 利用方法 - 無人受付の使い方 */}
        <HowToUseSection />

        {/* 5. 料金 - シンプルな料金表 */}
        <PricingSection />

        {/* 6. 安心・安全 - 防犯カメラなどの説明 */}
        <SafetySection />

        {/* 7. Instagram セクションを削除 */}

        {/* 8. CTA - 来場を促すセクション */}
        <CTASection />

        {/* 9. アクセス - 地図と基本情報 */}
        <AccessSection />
      </main>

      <Footer />
    </div>
  );
}