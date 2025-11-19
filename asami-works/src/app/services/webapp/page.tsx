import styles from "./WebAppService.module.css";
import RelatedLinks from "@/components/RelatedLinks";

export const metadata = {
  title: "WEBアプリ開発 | 業務効率化・カスタムシステム構築 - AsamiWorks",
  description: "業務効率化やサービス提供に最適なWEBアプリケーションを開発。完全カスタマイズで業務フローに最適化したシステムを構築します。茨城県・千葉県を中心に全国対応。",
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
    "areaServed": "JP"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.heroLabel}>Web Application Development</span>
            <h1 className={styles.heroTitle}>WEBアプリ開発</h1>
            <p className={styles.heroLead}>
              日々の業務をシステム化することで、<br className={styles.brDesktop} />
              手作業の負担を減らし、情報を一元管理できます。
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Overview</span>
              <h2 className={styles.sectionTitle}>WEBアプリとは</h2>
            </div>
            <div className={styles.overviewContent}>
              <p className={styles.paragraph}>
                WEBアプリとは、ブラウザ上で動作する業務システムのことです。
                ホームページが「情報を見せる」ためのものであるのに対し、
                WEBアプリは「作業を行う」ためのものです。
              </p>
              <p className={styles.paragraph}>
                データの入力、検索、集計、出力といった作業を、
                手作業ではなくシステムで処理することで、
                業務の効率化とミスの削減を実現します。
              </p>
              <div className={styles.comparisonBox}>
                <div className={styles.comparisonItem}>
                  <span className={styles.comparisonBadge}>見せる</span>
                  <h3 className={styles.comparisonTitle}>ホームページ</h3>
                  <p className={styles.comparisonText}>
                    会社案内、商品紹介、お知らせの掲載
                  </p>
                </div>
                <div className={styles.comparisonDivider} />
                <div className={styles.comparisonItem}>
                  <span className={styles.comparisonBadge}>使う</span>
                  <h3 className={styles.comparisonTitle}>WEBアプリ</h3>
                  <p className={styles.comparisonText}>
                    顧客管理、予約受付、在庫管理、日報入力
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Use Cases</span>
              <h2 className={styles.sectionTitle}>開発できるシステムの例</h2>
            </div>
            <div className={styles.cardGrid}>
              <article className={styles.card}>
                <span className={styles.cardLabel}>CRM</span>
                <h3 className={styles.cardTitle}>顧客管理システム</h3>
                <p className={styles.cardText}>
                  顧客情報、商談履歴、契約状況を一元管理。
                  担当者や条件で絞り込み、必要な情報にすぐアクセスできます。
                </p>
              </article>
              <article className={styles.card}>
                <span className={styles.cardLabel}>Booking</span>
                <h3 className={styles.cardTitle}>予約管理システム</h3>
                <p className={styles.cardText}>
                  お客様がオンラインで空き状況を確認し予約。
                  自動でカレンダーに反映され、電話対応の手間を削減します。
                </p>
              </article>
              <article className={styles.card}>
                <span className={styles.cardLabel}>Inventory</span>
                <h3 className={styles.cardTitle}>在庫管理システム</h3>
                <p className={styles.cardText}>
                  入出庫を記録すると在庫数を自動計算。
                  発注タイミングの通知で、在庫切れや過剰在庫を防ぎます。
                </p>
              </article>
              <article className={styles.card}>
                <span className={styles.cardLabel}>Reporting</span>
                <h3 className={styles.cardTitle}>業務報告システム</h3>
                <p className={styles.cardText}>
                  現場からスマートフォンで報告を入力。
                  事務所への戻りや転記作業が不要になります。
                </p>
              </article>
              <article className={styles.card}>
                <span className={styles.cardLabel}>Billing</span>
                <h3 className={styles.cardTitle}>請求書発行システム</h3>
                <p className={styles.cardText}>
                  取引データから請求書を自動生成。
                  発行履歴の管理や入金状況の確認も一画面で行えます。
                </p>
              </article>
              <article className={styles.card}>
                <span className={styles.cardLabel}>Custom</span>
                <h3 className={styles.cardTitle}>その他のシステム</h3>
                <p className={styles.cardText}>
                  業務内容に合わせて必要な機能を設計します。
                  既存の業務フローを整理するところからお手伝いします。
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className={styles.sectionDark}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabelLight}>Security</span>
              <h2 className={styles.sectionTitleLight}>安全性と信頼性</h2>
              <p className={styles.sectionSubLight}>
                業務データを安心して預けていただくために
              </p>
            </div>
            <div className={styles.securityList}>
              <div className={styles.securityItem}>
                <span className={styles.securityLabel}>Encryption</span>
                <h3 className={styles.securityTitle}>通信の暗号化</h3>
                <p className={styles.securityText}>
                  SSL/TLSによる暗号化通信で、データの傍受を防止
                </p>
              </div>
              <div className={styles.securityItem}>
                <span className={styles.securityLabel}>Access Control</span>
                <h3 className={styles.securityTitle}>アクセス制御</h3>
                <p className={styles.securityText}>
                  ユーザーごとの権限設定で、情報の閲覧・編集を制限
                </p>
              </div>
              <div className={styles.securityItem}>
                <span className={styles.securityLabel}>Backup</span>
                <h3 className={styles.securityTitle}>データのバックアップ</h3>
                <p className={styles.securityText}>
                  定期バックアップで、障害時のデータ復旧に対応
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Process</span>
              <h2 className={styles.sectionTitle}>開発の進め方</h2>
            </div>
            <div className={styles.processGrid}>
              <div className={styles.processItem}>
                <span className={styles.processNumber}>01</span>
                <div className={styles.processContent}>
                  <h3 className={styles.processTitle}>ヒアリング</h3>
                  <p className={styles.processText}>
                    現在の業務フローと課題をお聞きします。
                    どの部分をシステム化すべきか一緒に整理します。
                  </p>
                </div>
              </div>
              <div className={styles.processItem}>
                <span className={styles.processNumber}>02</span>
                <div className={styles.processContent}>
                  <h3 className={styles.processTitle}>要件定義・設計</h3>
                  <p className={styles.processText}>
                    必要な機能を洗い出し、画面構成を設計します。
                    この段階で仕様を確定させます。
                  </p>
                </div>
              </div>
              <div className={styles.processItem}>
                <span className={styles.processNumber}>03</span>
                <div className={styles.processContent}>
                  <h3 className={styles.processTitle}>開発・テスト</h3>
                  <p className={styles.processText}>
                    設計に基づいて開発を進めます。
                    途中段階での確認も行います。
                  </p>
                </div>
              </div>
              <div className={styles.processItem}>
                <span className={styles.processNumber}>04</span>
                <div className={styles.processContent}>
                  <h3 className={styles.processTitle}>導入・運用支援</h3>
                  <p className={styles.processText}>
                    操作方法の説明と初期データの移行を行います。
                    運用開始後の調整にも対応します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaInner}>
            <span className={styles.ctaLabel}>Contact</span>
            <h2 className={styles.ctaTitle}>ご相談ください</h2>
            <p className={styles.ctaText}>
              「このような業務はシステム化できるか」という段階からご相談いただけます。<br className={styles.brDesktop} />
              業務内容をお聞きした上で、最適な方法をご提案します。
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
