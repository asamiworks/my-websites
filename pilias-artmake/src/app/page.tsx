import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import MenuCards from '@/components/home/MenuCards'
import GallerySection from '@/components/home/GallerySection'
import ClinicsSection from '@/components/home/ClinicsSection'
import FAQSection from '@/components/home/FAQSection'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      {/* ヒーローセクション */}
      <HeroSection />

      {/* アートメイクとは */}
      <AboutSection />

      {/* 施術メニュー */}
      <MenuCards />

      {/* 症例写真 */}
      <GallerySection />

      {/* 提携院情報 */}
      <ClinicsSection />

      {/* よくある質問 */}
      <FAQSection />

      {/* CTA */}
      <CTASection />
    </>
  )
}