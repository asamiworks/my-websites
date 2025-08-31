import Link from "next/link";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* コピーライト */}
        <p className={styles.copy}>
          © {new Date().getFullYear()} 茨城メモリアルパーク
        </p>
        
        {/* ナビゲーションリンク */}
        <nav className={styles.links}>
          <Link href="/about-us">私たちについて</Link>
          <Link href="/privacy-policy">プライバシーポリシー</Link>
        </nav>
        
        {/* サイト制作クレジット */}
        <div className={styles.credit}>
          <p>
            サイト制作代行：
            <a 
              href="https://asami-works.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.creditLink}
              aria-label="Asami Works ウェブサイト制作会社（新しいタブで開く）"
            >
              Asami Works
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}