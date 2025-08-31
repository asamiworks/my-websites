import React from 'react';
import styles from './TrustIndicators.module.css';

const TrustIndicators = () => {
  const indicators = [
    {
      label: "サービス利用料",
      value: "0円",
      subtext: "無料で利用可能"
    },
    {
      label: "情報収集を",
      value: "効率化",
      subtext: "最短5分で完了"
    },
    {
      label: "営業経験を活かした",
      value: "プロの視点",
      subtext: "失敗を防ぐ"
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>選ばれる3つの理由</h2>
        </div>
        <div className={styles.indicatorsGrid}>
          {indicators.map((indicator, index) => (
            <div key={index} className={styles.indicatorCard}>
              <div className={styles.value}>{indicator.value}</div>
              <div className={styles.label}>{indicator.label}</div>
              <div className={styles.subtext}>{indicator.subtext}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;