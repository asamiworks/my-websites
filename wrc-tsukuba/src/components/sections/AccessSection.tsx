import styles from './AccessSection.module.css';

const AccessSection = () => {
  return (
    <section id="access" className={styles.accessSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>アクセス</h2>
          
        </div>

        <div className={styles.content}>
          <div className={styles.mapWrapper}>
            <div className={styles.mapContainer}>
              <iframe
                title="WRC-Tsukubaの地図"
                className={styles.map}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12921.741461900636!2d140.20502406957104!3d35.936318360093345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6022650062c7efdf%3A0xd1cb15b10d238652!2z44Ov44Kk44Or44OJ44OA44O844OIUkPjgaTjgY_jgbA!5e0!3m2!1sja!2sjp!4v1740330994635!5m2!1sja!2sjp"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          <div className={styles.infoWrapper}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>所在地</h3>
              <p>茨城県龍ケ崎市貝原塚町</p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3>営業形態</h3>
              <p>無人受付<br/>予約不要</p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="6" width="18" height="15" rx="2"/>
                  <circle cx="12" cy="13" r="3"/>
                  <circle cx="18" cy="10" r="1"/>
                </svg>
              </div>
              <h3>安心設備</h3>
              <p>防犯カメラ設置<br/>スタッフ不在でも安心</p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11H3v10h6M9 3h6v18h-6M21 11h-6v10h6M3 7l6-4v20l-6-4M21 7l-6-4v20l6-4"/>
                </svg>
              </div>
              <h3>駐車場</h3>
              <p>完備<br/>無料でご利用可能</p>
            </div>
          </div>
        </div>

        <div className={styles.notice}>
          <p>
            無人受付のため、ご予約不要でご来場いただけます。<br />
            スタッフ不在でも安心してご利用いただけます。
          </p>
        </div>

        <div className={styles.directions}>
          <a 
            href="https://maps.app.goo.gl/mduW7PckUrZ5DPUR7"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.directionsButton}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 7 9 4 15 7 21 4 21 17 15 20 9 17 3 20 3 7"/>
              <line x1="9" y1="4" x2="9" y2="17"/>
              <line x1="15" y1="7" x2="15" y2="20"/>
            </svg>
            Google マップで詳しく見る
          </a>
        </div>
      </div>
    </section>
  );
};

export default AccessSection;