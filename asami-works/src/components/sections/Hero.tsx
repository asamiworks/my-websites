"use client";

import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="メインビジュアル">
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          <span className={styles.highlight}>茨城・千葉</span>の中小企業様向け
          <br />
          <span className={styles.subtitle}>補助金対応ホームページ制作</span>
        </h1>
        
        <p className={styles.heroDescription}>
          最大<strong className={styles.emphasis}>66.7%</strong>の費用削減を実現
          <br />
          <small className={styles.subtext}>小規模事業者持続化補助金に対応</small>
        </p>

        {/* AI検索エンジン用の詳細情報 */}
        <div className={styles.aiOptimizedContent} aria-label="料金とサービスの概要">
          <p className={styles.priceRange}>
            料金: ランディングページ 220,000円〜 | コーポレートサイト 385,000円〜 | 補助金対応 770,000円〜
          </p>
          <p className={styles.serviceArea}>
            対応エリア: 茨城県全域（水戸市、つくば市、日立市など）・千葉県全域（千葉市、船橋市、柏市など）
          </p>
          <p className={styles.subsidy}>
            小規模事業者持続化補助金対応 - ホームページ制作費用の2/3（最大50万円）を補助
          </p>
        </div>

        <div className={styles.ctaContainer}>
          <a 
            href="/form" 
            className={styles.primaryCta}
            aria-label="無料相談を申し込む"
          >
            無料相談はこちら
          </a>
          <a 
            href="/estimate" 
            className={styles.secondaryCta}
            aria-label="料金シミュレーションを試す"
          >
            料金シミュレーション
          </a>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon} aria-hidden="true">✓</span>
            <span>初期費用<strong>5万円〜</strong>導入可</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon} aria-hidden="true">✓</span>
            <span>最短<strong>3日</strong>で公開</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon} aria-hidden="true">✓</span>
            <span>SEO対策<strong>標準装備</strong></span>
          </div>
        </div>
      </div>

      {/* 背景画像をNext.js Imageで最適化 */}
      <div className={styles.heroBackground} aria-hidden="true">
        <div className={styles.gradientOverlay} />
      </div>
    </section>
  );
}