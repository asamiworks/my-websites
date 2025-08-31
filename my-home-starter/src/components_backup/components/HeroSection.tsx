import React from 'react';
import Link from 'next/link';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* 信頼性バッジ */}
          <div className="mb-6">
            <span className={styles.trustBadge}>
              注文住宅営業経験者が運営 / 現場で培った実践的アドバイス
            </span>
          </div>
          
          {/* メインタイトル */}
          <h1 className={styles.mainTitle}>
            失敗しない家づくりを
            <span className={styles.highlight}>完全無料でサポート</span>
          </h1>
          
          {/* サブタイトル */}
          <p className={styles.subtitle}>
            予算オーバー、間取りの後悔、住宅会社選びの失敗...
            <br />
            <span className="font-semibold">67%の人が経験する家づくりの失敗を、専門家のサポートで防ぎます</span>
          </p>
          
          {/* サービスの約束 */}
          <div className={styles.promiseSection}>
            <h2 className={styles.promiseTitle}>私たちのお約束</h2>
            <ul className={styles.promiseList}>
              <li>✓ お客様の個人情報は厳重に管理します</li>
              <li>✓ しつこい営業は一切いたしません</li>
              <li>✓ 中立的な立場でアドバイスいたします</li>
              <li>✓ ご利用は完全無料です</li>
            </ul>
          </div>
          
          {/* CTA */}
          <div className={styles.ctaWrapper}>
            <Link
              href="/start-home-building"
              className={styles.primaryButton}
            >
              無料診断を始める
            </Link>
            <Link
              href="#mistakes-section"
              className={styles.secondaryButton}
            >
              よくある失敗を見る
            </Link>
          </div>
          
          {/* 追加情報 */}
          <p className={styles.disclaimer}>
            ※ 診断結果はすぐに確認できます。お気軽にお試しください。
          </p>
        </div>
      </div>
      
      {/* 装飾的な要素 */}
      <div className={styles.decorativeGradient}></div>
    </section>
  );
};

export default HeroSection;