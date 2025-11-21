import { Metadata } from "next";
import ServicePlans from "./components/ServicePlans";
import Pricing from "./components/Pricing";
import Flow from "./components/Flow";
import styles from "./original.module.css";

export const metadata: Metadata = {
  title: "WEBサイト制作プラン詳細 | AsamiWorks",
  description: "完全オーダーメイドのWeb制作サービス。コーポレートサイト、ランディングページ、補助金対応サイトまで、お客様のニーズに合わせた最適なWebサイトを制作いたします。",
  keywords: ["Web制作", "ホームページ制作", "オーダーメイド", "コーポレートサイト", "ランディングページ", "補助金対応"],
  openGraph: {
    title: "WEBサイト制作プラン詳細 | AsamiWorks",
    description: "完全オーダーメイドのWeb制作サービス",
    url: "https://asami-works.com/services/original",
    siteName: "AsamiWorks",
    type: "website",
  },
};

export default function OriginalServicesPage() {
  return (
    <main className={styles.container}>
      {/* ヒーローセクション */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            WEBサイト制作プラン詳細
            <span className={styles.heroSubtitle}>完全オーダーメイドのWeb制作</span>
          </h1>
          <p className={styles.heroDescription}>
            お客様のビジネスに最適な、世界に一つだけのWebサイトを制作いたします。
            <br />
            デザインから機能まで、すべてご要望に合わせてカスタマイズ可能です。
          </p>
        </div>
      </section>

      {/* サービス一覧セクション（コンポーネント化） */}
      <ServicePlans />
      
      {/* 料金詳細セクション */}
      <Pricing />

      {/* 料金詳細セクション */}
      <Flow />

      
    </main>
  );
}