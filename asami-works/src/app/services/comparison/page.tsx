"use client";

import styles from "./Comparison.module.css";

export default function ServicesComparison() {
  const services = [
    {
      id: "original",
      title: "オリジナルサイト制作",
      price: "12万円〜",
      description: "完全オーダーメイドで、ブランドに最適なWebサイトを制作",
      features: [
        "LP 12万円〜 / HP 60万円〜",
        "独自デザインで差別化",
        "WordPress導入・決済機能も対応可",
        "補助金活用で最大100万円削減可能"
      ],
      href: "/services/original",
      badge: "おすすめ",
      details: {
        lp: {
          price: "120,000円〜",
          delivery: "2週間〜",
          features: ["コンバージョン特化", "A/Bテスト対応"]
        },
        corporate: {
          price: "600,000円〜",
          delivery: "3週間〜",
          features: ["4ページ構成", "お問合せフォーム標準"]
        },
        grant: {
          price: "700,000円〜",
          delivery: "1ヶ月〜",
          features: ["補助金申請サポート", "WordPress標準装備"]
        }
      }
    },
    {
      id: "webapp",
      title: "WEBアプリ開発",
      price: "60万円〜",
      description: "業務効率化やサービス提供に最適なWEBアプリケーションを開発",
      features: [
        "初期開発費60万円〜",
        "完全カスタマイズ開発",
        "高いセキュリティ・保守サポート",
        "業務フローに最適化"
      ],
      href: "/services/webapp",
      badge: "DX推進"
    }
  ];

  return (
    <section id="services" className={styles.services} aria-label="サービス一覧">
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            選べる<span className={styles.highlight}>2つのサービス</span>
          </h2>
          <p className={styles.sectionDescription}>
            お客様のニーズと予算に合わせて、最適なプランをご提案します
          </p>
          <p className={styles.serviceDifference}>
            オリジナルサイトは「見せる」ためのホームページ、WEBアプリは「使う」ための業務システムです
          </p>
        </header>

        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <article
              key={service.id}
              className={`${styles.serviceCard} ${
                service.badge === "おすすめ" ? styles.recommended : ""
              } ${
                service.badge === "DX推進" ? styles.newService : ""
              }`}
              itemScope
              itemType="https://schema.org/Service"
            >
              {service.badge && (
                <span
                  className={`${styles.badge} ${
                    service.badge === "DX推進" ? styles.newBadge : ""
                  }`}
                  aria-label={
                    service.badge === "DX推進" ? "DX推進サービス" : "推奨プラン"
                  }
                >
                  {service.badge}
                </span>
              )}

              <div className={styles.serviceContent}>
                <h3 className={styles.serviceTitle} itemProp="name">
                  {service.title}
                </h3>
                
                <p className={styles.servicePrice}>
                  <span className={styles.priceValue} itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span itemProp="price">{service.price}</span>
                    <meta itemProp="priceCurrency" content="JPY" />
                  </span>
                </p>

                <p className={styles.serviceDescription} itemProp="description">
                  {service.description}
                </p>

                <ul className={styles.featureList} aria-label="主な特徴">
                  {service.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <span className={styles.checkIcon} aria-hidden="true">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a 
                  href={service.href} 
                  className={styles.serviceLink}
                  aria-label={`${service.title}の詳細を見る`}
                >
                  詳細を見る
                  <span className={styles.arrow} aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.comparisonSection}>
          <h3 className={styles.comparisonTitle}>どのサービスが最適？</h3>
          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCard}>
              <h4 className={styles.comparisonCardTitle}>オリジナルサイト制作</h4>
              <p className={styles.comparisonSubtitle}>こんな方におすすめ</p>
              <ul className={styles.comparisonList}>
                <li>独自デザインでブランディングしたい</li>
                <li>SEO対策で集客力を高めたい</li>
                <li>補助金を活用したい</li>
                <li>高機能なサイトが必要</li>
              </ul>
              <div className={styles.comparisonDetails}>
                <p><strong>納期：</strong>2週間〜1ヶ月</p>
                <p><strong>価格：</strong>12万円〜70万円</p>
              </div>
            </div>

            <div className={styles.comparisonCard}>
              <h4 className={styles.comparisonCardTitle}>WEBアプリ開発</h4>
              <p className={styles.comparisonSubtitle}>こんな方におすすめ</p>
              <ul className={styles.comparisonList}>
                <li>業務を効率化したい</li>
                <li>独自システムが必要</li>
                <li>完全カスタマイズしたい</li>
                <li>DXを推進したい</li>
              </ul>
              <div className={styles.comparisonDetails}>
                <p><strong>納期：</strong>1〜3ヶ月</p>
                <p><strong>価格：</strong>初期60万円〜</p>
              </div>
            </div>
          </div>
        </div>

        {/* 価格比較表を追加 */}
        <div className={styles.priceComparisonSection}>
          <h3 className={styles.comparisonTitle}>料金プラン比較表</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>オリジナルサイト制作</th>
                  <th>WEBアプリ開発</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>初期費用</td>
                  <td>12万円〜70万円</td>
                  <td>60万円〜</td>
                </tr>
                <tr>
                  <td>月額費用</td>
                  <td>6,600円〜</td>
                  <td>別途見積</td>
                </tr>
                <tr>
                  <td>納期</td>
                  <td>2週間〜1ヶ月</td>
                  <td>1〜3ヶ月</td>
                </tr>
                <tr>
                  <td>デザイン</td>
                  <td><strong>完全オーダーメイド</strong></td>
                  <td><strong>完全カスタマイズ</strong></td>
                </tr>
                <tr>
                  <td>更新作業</td>
                  <td>自社更新可能<br/><small>（WordPress選択時）</small></td>
                  <td>管理画面で簡単更新</td>
                </tr>
                <tr>
                  <td>補助金対応</td>
                  <td><strong>◎</strong><br/><small>（小規模事業者持続化補助金）</small></td>
                  <td><strong>◎</strong><br/><small>（IT導入補助金）</small></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>
            どのサービスがお客様に最適か、<strong>無料でご相談</strong>いただけます
          </p>
          <div className={styles.ctaButtons}>
            <a href="/form" className={styles.ctaButton}>
              無料相談を予約する
            </a>
            <a href="/estimate" className={styles.ctaButtonSecondary}>
              料金シミュレーション
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}