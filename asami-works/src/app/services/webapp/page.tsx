import styles from "./WebAppService.module.css";
import RelatedLinks from "@/components/RelatedLinks";

export const metadata = {
  title: "WEBアプリ開発 | 業務効率化・カスタムシステム構築 - AsamiWorks",
  description: "業務効率化やサービス提供に最適なWEBアプリケーションを開発。完全カスタマイズで業務フローに最適化したシステムを構築します。初期費用60万円〜。茨城県・千葉県を中心に全国対応。",
  keywords: "WEBアプリ開発,業務効率化,カスタムシステム,業務アプリ,DX,デジタルトランスフォーメーション,システム開発,茨城,千葉,AsamiWorks",
  openGraph: {
    title: "WEBアプリ開発 | AsamiWorks",
    description: "業務効率化やサービス提供に最適なWEBアプリケーションを開発。完全カスタマイズで業務フローに最適化。",
    type: "website",
    url: "https://asami-works.com/services/webapp",
    images: [{
      url: "https://asami-works.com/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "WEBアプリ開発サービス"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "WEBアプリ開発 | AsamiWorks",
    description: "業務効率化やサービス提供に最適なWEBアプリケーションを開発。完全カスタマイズで業務フローに最適化。"
  }
};

export default function WebAppService() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "WEBアプリ開発",
    "provider": {
      "@type": "Organization",
      "name": "AsamiWorks"
    },
    "description": "業務効率化やサービス提供に最適なWEBアプリケーションを開発。完全カスタマイズで業務フローに最適化したシステムを構築します。",
    "areaServed": "JP",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "WEBアプリ開発プラン",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "基本開発プラン",
          "price": "600000",
          "priceCurrency": "JPY",
          "description": "初期開発費用（要件定義・設計・開発・テスト・導入サポート含む）"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero} aria-label="WEBアプリ開発サービスの紹介">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              業務を、<br />
              アプリで革新する
            </h1>
            <p className={styles.heroDescription}>
              手作業を減らし、生産性を最大化。<br />
              あなたのビジネスに最適化されたWEBアプリケーションを開発します。
            </p>
            <div className={styles.buttonGroup}>
              <a href="/form" className={styles.primaryButton}>
                無料相談する
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>30%</div>
              <div className={styles.statLabel}>業務効率改善</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1-3ヶ月</div>
              <div className={styles.statLabel}>開発期間</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>60万円〜</div>
              <div className={styles.statLabel}>初期費用</div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="cases" className={styles.casesSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>こんなシステムを開発できます</h2>
            <div className={styles.casesGrid}>
              <div className={styles.caseCard}>
                <div className={styles.caseIcon}>📊</div>
                <h3 className={styles.caseTitle}>顧客管理</h3>
                <p className={styles.caseDescription}>
                  顧客情報の一元管理と商談履歴の記録
                </p>
              </div>
              <div className={styles.caseCard}>
                <div className={styles.caseIcon}>📅</div>
                <h3 className={styles.caseTitle}>予約管理</h3>
                <p className={styles.caseDescription}>
                  オンライン予約とスケジュール管理
                </p>
              </div>
              <div className={styles.caseCard}>
                <div className={styles.caseIcon}>📦</div>
                <h3 className={styles.caseTitle}>在庫管理</h3>
                <p className={styles.caseDescription}>
                  在庫の自動更新と発注アラート
                </p>
              </div>
              <div className={styles.caseCard}>
                <div className={styles.caseIcon}>📝</div>
                <h3 className={styles.caseTitle}>業務報告</h3>
                <p className={styles.caseDescription}>
                  日報入力と進捗管理の効率化
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>選ばれる3つの理由</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <div className={styles.featureNumber}>01</div>
                <h3 className={styles.featureTitle}>完全カスタマイズ</h3>
                <p className={styles.featureDescription}>
                  あなたの業務に完全に合わせた<br />
                  システムを構築します
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureNumber}>02</div>
                <h3 className={styles.featureTitle}>セキュア &amp; 安心</h3>
                <p className={styles.featureDescription}>
                  データ暗号化とアクセス制御で<br />
                  大切な情報を守ります
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureNumber}>03</div>
                <h3 className={styles.featureTitle}>成長をサポート</h3>
                <p className={styles.featureDescription}>
                  ビジネスの成長に合わせて<br />
                  柔軟に拡張できます
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className={styles.pricingSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>シンプルな料金体系</h2>
            <div className={styles.pricingCard}>
              <div className={styles.pricingMain}>
                <div className={styles.pricingAmount}>60万円〜</div>
                <div className={styles.pricingLabel}>初期開発費用</div>
              </div>
              <div className={styles.pricingIncludes}>
                <p>要件定義 / 設計 / 開発 / テスト / 導入サポート</p>
              </div>
            </div>
            <p className={styles.pricingNote}>
              ※保守・運用サポートは別途お見積り。まずは無料相談でお気軽にご相談ください。
            </p>
          </div>
        </section>

        {/* Flow Section */}
        <section className={styles.flowSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>3ステップで始める</h2>
            <div className={styles.flowGrid}>
              <div className={styles.flowItem}>
                <div className={styles.flowNumber}>01</div>
                <h3 className={styles.flowTitle}>相談</h3>
                <p className={styles.flowDescription}>
                  課題をヒアリングし<br />
                  最適なソリューションを提案
                </p>
              </div>
              <div className={styles.flowArrow}>→</div>
              <div className={styles.flowItem}>
                <div className={styles.flowNumber}>02</div>
                <h3 className={styles.flowTitle}>開発</h3>
                <p className={styles.flowDescription}>
                  要件定義から開発まで<br />
                  1〜3ヶ月で完成
                </p>
              </div>
              <div className={styles.flowArrow}>→</div>
              <div className={styles.flowItem}>
                <div className={styles.flowNumber}>03</div>
                <h3 className={styles.flowTitle}>運用</h3>
                <p className={styles.flowDescription}>
                  導入後も継続的に<br />
                  サポート＆改善
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              あなたのビジネスを<br />
              次のステージへ
            </h2>
            <p className={styles.ctaDescription}>
              まずは無料相談から始めましょう
            </p>
            <a href="/form" className={styles.ctaButton}>
              無料相談する
            </a>
          </div>
        </section>
      </div>
      
      <RelatedLinks />
    </>
  );
}