"use client";

import Link from "@/components/Link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // フッターを非表示にするページのパス
  const hideFooterPaths = ['/form', '/estimate', '/contact'];
  
  // 現在のページが非表示対象の場合は何も表示しない
  if (hideFooterPaths.includes(pathname)) {
    return null;
  }

  const siteMap = {
    package: {
      title: "パッケージプラン",
      links: [
        { href: "/services/package/demo/lp", label: "LPプラン" },
        { href: "/services/package/demo/corporate", label: "HPプラン" }
      ]
    },
    original: {
      title: "オリジナルサイト制作",
      links: [
        { href: "/services/original/lp", label: "LPプラン" },
        { href: "/services/original/corporate", label: "HPプラン" },
        { href: "/services/original/grant", label: "補助金対応プラン" }
      ]
    },
    services: {
      title: "その他制作",
      links: [
        { href: "/services/webapp", label: "WEBアプリ開発" },

        { href: "/pr", label: "広告ページ制作" }  // ← ここに追加
      ]
    },
    support: {
      title: "サポート",
      links: [
        { href: "/support/email-setup", label: "メール設定ガイド" },
        { href: "/#faq", label: "よくある質問" },
     
      ]
    },
    company: {
      title: "サービス概要",
      links: [
        { href: "/about", label: "制作実績" },
        { href: "/estimate", label: "依頼フォーム（簡易見積もり）" }
       
      ]
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* サイトマップセクション */}
        <div className={styles.siteMapSection}>
          <div className={styles.siteMapGrid}>
            {Object.entries(siteMap).map(([key, section]) => (
              <div key={key} className={styles.siteMapColumn}>
                <h3 className={styles.siteMapTitle}>{section.title}</h3>
                <ul className={styles.siteMapList}>
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.siteMapLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 会社情報セクション */}
        <div className={styles.companyInfo}>
          <div className={styles.companyDetails}>
            <h2 className={styles.companyName}>AsamiWorks</h2>
            <p className={styles.tagline}>茨城・千葉の中小企業様向け補助金対応ホームページ制作</p>
            <div className={styles.contactInfo}>
              <p>営業時間: 10:00〜20:00（不定休）</p>
              <p>対応エリア: 全国</p>
            </div>
          </div>
          
          {/* CTAボタン */}
          <div className={styles.footerCta}>
            <Link href="/form" className={styles.ctaButton}>
              無料相談はこちら
            </Link>
          </div>
        </div>

        {/* コピーライトセクション */}
        <div className={styles.copyright}>
          <p>&copy; {currentYear} AsamiWorks. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>
              プライバシーポリシー
            </Link>
            <span className={styles.separator}>|</span>
            <Link href="/terms" className={styles.legalLink}>
              利用規約
            </Link>
            <span className={styles.separator}>|</span>
            <Link href="/tokushoho" className={styles.legalLink}>
              特定商取引法に基づく表記
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}