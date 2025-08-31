import Link from "next/link";
import styles from "./ServicePlans.module.css";

const originalServices = [
  {
    id: "lp",
    title: "ランディングページ制作",
    price: "220,000円〜",
    description: "コンバージョン特化の1ページ完結型サイト。A/Bテスト対応で成果を最大化",
    features: [
      "高速表示の実現",
      "完全レスポンシブ対応",
      "A/Bテスト対応",
      "最短2週間で納品"
    ],
    href: "/services/original/lp",
    recommended: false
  },
  {
    id: "corporate",
    title: "コーポレートサイト制作",
    price: "385,000円〜",
    description: "企業の信頼性を高める本格的なWebサイト。4ページ構成・内部SEO基本対策込み",
    features: [
      "基本4ページ構成",
      "お問い合わせフォーム標準装備",
      "内部SEO対策込み",
      "SSL証明書設定"
    ],
    href: "/services/original/corporate",
    recommended: false
  },
  {
    id: "grant",
    title: "小規模事業者持続化補助金対応サイト制作",
    price: "770,000円〜",
    description: "補助金を活用して最大50万円（インボイス特例適用で最大100万円）の費用削減",
    features: [
      "WordPress導入（自社更新可能）",
      "申請書類作成サポート",
      "要件適合保証",
      "採択後フォロー"
    ],
    href: "/services/original/grant",
    recommended: true,
    badge: "おすすめ"
  }
];

export default function ServicePlans() {
  return (
    <section className={styles.services}>
      <div className={styles.servicesContent}>
        <h2 className={styles.sectionTitle}>選べる3つの制作プラン</h2>
        <p className={styles.sectionDescription}>
          目的と予算に応じて、最適なプランをお選びいただけます
        </p>

        <div className={styles.serviceGrid}>
          {originalServices.map((service) => (
            <article 
              key={service.id} 
              className={`${styles.serviceCard} ${service.recommended ? styles.recommended : ""}`}
            >
              {service.badge && (
                <span className={styles.badge}>{service.badge}</span>
              )}
              
              <div className={styles.serviceHeader}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.servicePrice}>{service.price}</p>
              </div>

              <p className={styles.serviceDescription}>{service.description}</p>

              <ul className={styles.featureList}>
                {service.features.map((feature, index) => (
                  <li key={index} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={service.href} className={styles.serviceLink}>
                詳細を見る
                <span className={styles.arrow}>→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}