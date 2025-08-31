import { Metadata } from "next";
import styles from "./page.module.css";

// このページは顧客の広告ページの例
export const metadata: Metadata = {
  title: "期間限定キャンペーン | テスト企業",
  description: "テスト企業の特別キャンペーンのご案内",
  robots: {
    index: true, // 顧客のページは基本的にindex許可
    follow: true,
  },
};

export default function TestCampaignPage() {
  return (
    <div className={styles.container}>
      {/* 顧客企業名のシンプルなヘッダー */}
      <header className={styles.header}>
        <div className={styles.logo}>テスト企業</div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            期間限定特別キャンペーン
            <span className={styles.highlight}>最大50%OFF</span>
          </h1>
          <p className={styles.subtitle}>
            2025年9月30日まで
          </p>
        </section>

        <section className={styles.content}>
          <h2>サービスの特徴</h2>
          <ul className={styles.features}>
            <li>高品質な商品をお届け</li>
            <li>迅速な対応</li>
            <li>安心のアフターサポート</li>
          </ul>
        </section>

        <section className={styles.cta}>
          <p className={styles.ctaText}>お問い合わせはこちら</p>
          <a href="tel:000-0000-0000" className={styles.telButton}>
            📞 000-0000-0000
          </a>
          <a href="mailto:test@example.com" className={styles.emailButton}>
            ✉️ メールで問い合わせ
          </a>
        </section>

        <section className={styles.info}>
          <h2>企業情報</h2>
          <dl className={styles.infoList}>
            <dt>会社名</dt>
            <dd>テスト企業株式会社</dd>
            <dt>所在地</dt>
            <dd>茨城県○○市○○町1-2-3</dd>
            <dt>営業時間</dt>
            <dd>9:00〜18:00（土日祝休み）</dd>
          </dl>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 テスト企業</p>
        <p className={styles.credit}>
          <small>
            Powered by <a href="https://asami-works.com" target="_blank" rel="noopener">AsamiWorks</a>
          </small>
        </p>
      </footer>
    </div>
  );
}
