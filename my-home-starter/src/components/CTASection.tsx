import React from 'react';
import styles from './CTASection.module.css';

const CTASection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          理想の家づくりを始めましょう
        </h2>
        <p className={styles.description}>
          5分の診断で、あなたにぴったりの住宅会社が見つかります。
          今すぐ無料診断を始めて、夢のマイホームへの第一歩を踏み出しましょう。
        </p>
        
        <div className={styles.buttonGroup}>
          <a
            href="/start-home-building"
            className={styles.primaryButton}
          >
            無料診断を始める
          </a>
          <a
            href="/about"
            className={styles.secondaryButton}
          >
            サービス詳細を見る
          </a>
        </div>
        
        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            ※ 診断は無料です。お気軽にお試しください。
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;