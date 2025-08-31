import React from 'react';
import styles from './ServiceFeatures.module.css';

const ServiceFeatures = () => {
  const features = [
    {
      title: "最適なマッチング",
      description: "お客様の要望を詳しく分析し、理想の家づくりに最適な住宅会社をご紹介します。"
    },
    {
      title: "プロのサポート",
      description: "元住宅会社の営業マンが家づくりの疑問や不安に寄り添い、最後までサポートします。"
    },
    {
      title: "安心・安全",
      description: "厳選された優良住宅会社のみが登録。個人情報も安全に管理します。"
    },
    {
      title: "完全無料",
      description: "施主様は一切費用がかかりません。安心してご利用いただけます。"
    },
    {
      title: "透明性の高い情報",
      description: "各社の実績、価格帯、得意分野など、比較検討に必要な情報を提供します。"
    },
    {
      title: "中立的な立場",
      description: "特定の住宅会社に偏らず、お客様に最適な選択をサポートします。"
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            マイホームスターターが選ばれる理由
          </h2>
          <p className={styles.subtitle}>
            家づくりは人生の大きな決断。私たちは、その大切な選択を全力でサポートします。
          </p>
        </div>
        
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <h3 className={styles.featureTitle}>
                {feature.title}
              </h3>
              <p className={styles.featureDescription}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceFeatures;