"use client";

import styles from "./Access.module.css";

export default function AccessPage() {
  return (
    <main>
      <div className={styles.hero}>
        <h1 className={styles.title}>アクセス</h1>
        <div className={styles.titleDecoration}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.infoSection}>
            <div className={styles.infoBlock}>
              <h2 className={styles.sectionTitle}>所在地</h2>
              <p className={styles.address}>
                〒301-0847<br />
                茨城県龍ケ崎市松ヶ丘4丁目4番1号
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h2 className={styles.sectionTitle}>営業時間</h2>
              <p className={styles.businessHours}>
                9:00〜17:00<br />
                （定休日：土曜・日曜・祝日）
              </p>
            </div>
          </div>

          <div className={styles.mapSection}>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3230.4706980008386!2d140.20854749999998!3d35.9354538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60226561fb841d55%3A0x3ceae4a12b1c988d!2z44CSMzAxLTA4NTMg6Iyo5Z-O55yM6b6N44Kx5bSO5biC5p2-44Kx5LiY77yU5LiB55uu77yU4oiS77yR!5e0!3m2!1sja!2sjp!4v1745655438993!5m2!1sja!2sjp"
                className={styles.map}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="株式会社足立電機の所在地"
              />
            </div>
          </div>
        </div>
      </div>

      <section className={styles.accessInfo}>
        <h2 className={styles.sectionTitle}>交通アクセス</h2>
        <div className={styles.accessList}>
          <div className={styles.accessItem}>
            <h3 className={styles.accessMethod}>お車でお越しの場合</h3>
            <p>駐車場完備しております。</p>
          </div>
          <div className={styles.accessItem}>
            <h3 className={styles.accessMethod}>公共交通機関でお越しの場合</h3>
            <p>JR常磐線「龍ケ崎市駅」より車で約15分</p>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className={styles.ctaSection}>
        <p className={styles.ctaText}>
          法人様向けの電気工事・設備工事に関するご相談はお気軽にお問い合わせください
        </p>
        <a 
          href="https://jh-ad.jp/contact/form.html" 
          className={styles.ctaButton}
          target="_blank" 
          rel="noopener noreferrer"
        >
          お問い合わせフォーム
        </a>
      </section>
    </main>
  );
}