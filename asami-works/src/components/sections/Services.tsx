"use client";

import styles from "./Services.module.css";

export default function Services() {
  const services = [
    {
      id: "original",
      title: "オリジナル制作",
      price: "22万円〜",
      description: "完全オーダーメイドで、ブランドに最適なWebサイトを制作",
      features: [
        "独自デザインで差別化",
        "細部までカスタマイズ可能",
        "SEO対策・高速表示を標準装備",
        "補助金活用で最大100万円削減"
      ],
      href: "/services/original",
      badge: "おすすめ"
    },
    {
      id: "webapp",
      title: "WEBアプリ開発",
      price: "60万円〜（要見積）",
      description: "業務効率化やサービス提供に最適なWEBアプリケーションを開発",
      features: [
        "完全カスタマイズ開発",
        "業務フローに最適化",
        "高いセキュリティ",
        "保守・運用サポート"
      ],
      href: "/services/webapp",
      badge: "NEW"
    }
  ];

  return (
    <section id="services" className={styles.services} aria-label="サービス一覧">
      <div className={styles.container}>
        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <article
              key={service.id}
              className={`${styles.serviceCard} ${service.badge === "おすすめ" ? styles.recommended : ""} ${service.badge === "NEW" ? styles.newService : ""}`}
              itemScope
              itemType="https://schema.org/Service"
            >
              {service.badge && (
                <span
                  className={`${styles.badge} ${service.badge === "NEW" ? styles.newBadge : ""}`}
                  aria-label={service.badge === "NEW" ? "新サービス" : "推奨プラン"}
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