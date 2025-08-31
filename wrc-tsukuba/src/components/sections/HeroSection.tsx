import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.backgroundAnimation}>
        {/* アニメーション背景要素 */}
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
        <div className={styles.zigzag}></div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.mainTitle}>
          <span className={styles.titleLine1}>日本最大級の</span>
          <span className={styles.titleLine2}>ラジコンサーキット場</span>
        </h1>
        
        <p className={styles.subTitle}>
          龍ヶ崎で本格的なラジコン体験を
        </p>

        <div className={styles.features}>
          <span className={styles.feature}>予約不要</span>
          <span className={styles.feature}>初心者OK</span>
          <span className={styles.feature}>無人受付</span>
        </div>

        <a href="#course-overview" className={styles.ctaButton}>
          コースを見る
          <svg className={styles.arrow} width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      <div className={styles.scrollIndicator}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M15 7V23M15 23L8 16M15 23L22 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;