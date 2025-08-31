import styles from './CTASection.module.css';

const CTASection = () => {
  return (
    <section className={styles.ctaSection}>
      {/* 背景装飾 */}
      <div className={styles.backgroundShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
        <div className={styles.shape4}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            <span className={styles.titleLine1}>今すぐ</span>
            <span className={styles.titleLine2}>ラジコンを楽しもう！</span>
          </h2>
          
          <p className={styles.description}>
            無人受付のため、ご予約不要でご来場いただけます
          </p>
          <p className={styles.subDescription}>
            スタッフ不在でも安心してご利用いただけます
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v10l3 3"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span>いつでも利用可能</span>
            </div>
            <div className={styles.feature}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="10" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span>無人受付</span>
            </div>
            <div className={styles.feature}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>現金決済</span>
            </div>
          </div>

          <a 
            href="https://maps.google.com/maps?q=WRC-Tsukuba" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            今すぐ場所を確認
          </a>

          
        </div>
      </div>
    </section>
  );
};

export default CTASection;