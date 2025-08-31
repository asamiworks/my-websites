"use client";

import styles from "./About.module.css";

export default function AboutPage() {
  return (
    <main>
      <div className={styles.hero}>
        <h1 className={styles.title}>会社概要</h1>
        <div className={styles.titleDecoration}></div>
      </div>
      
      <div className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>基本情報</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>会社名</span>
              <span className={styles.value}>株式会社足立電機</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>所在地</span>
              <span className={styles.value}>〒301-0847 茨城県龍ケ崎市松ヶ丘4丁目4番1号</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>創業</span>
              <span className={styles.value}>昭和15年</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>設立</span>
              <span className={styles.value}>昭和47年8月21日</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>資本金</span>
              <span className={styles.value}>3,000万円</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>従業員数</span>
              <span className={styles.value}>13名</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>役員</h2>
          <div className={styles.executiveList}>
            <div className={styles.executive}>
              <span className={styles.position}>代表取締役会長</span>
              <span className={styles.name}>足立 彬</span>
            </div>
            <div className={styles.executive}>
              <span className={styles.position}>代表取締役社長</span>
              <span className={styles.name}>足立 顕徳</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>資格保有者</h2>
          <ul className={styles.qualificationList}>
            <li>監理技術者 2名</li>
            <li>1級電気工事施工管理技士 2名</li>
            <li>第一種電気工事士 8名</li>
            <li>第二種電気工事士 1名</li>
            <li>高所作業車取扱者 7名</li>
            <li>職長・安全衛生責任者 4名</li>
            <li>2級管工事施工管理技士 1名</li>
            <li>1級配管技能士 1名</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>許認可</h2>
          <div className={styles.licenseBox}>
            <p className={styles.licenseTitle}>建設業許可</p>
            <p className={styles.licenseNumber}>茨城県知事許可 第031515号（電気工事業）</p>
          </div>
        </section>
      </div>

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