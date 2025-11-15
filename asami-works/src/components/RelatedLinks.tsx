"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./RelatedLinks.module.css";

interface RelatedLink {
  href: string;
  title: string;
  description: string;
}

export default function RelatedLinks() {
  const pathname = usePathname();
  
  const allServices: RelatedLink[] = [
    {
      href: "/services/original/lp",
      title: "ランディングページ制作",
      description: "コンバージョン特化の1ページ完結型サイト"
    },
    {
      href: "/services/original/corporate",
      title: "コーポレートサイト制作",
      description: "企業の信頼性を高める本格的なWebサイト"
    },
    {
      href: "/services/original/grant",
      title: "補助金対応サイト制作",
      description: "補助金申請に最適化された高機能サイト"
    },
    {
      href: "/services/webapp",
      title: "WEBアプリ開発",
      description: "業務効率化・サービス提供に最適なカスタムシステムを構築"
    }
  ];
  
  const otherLinks: RelatedLink[] = [
    {
      href: "/subsidy",
      title: "補助金・助成金情報",
      description: "利用可能な補助金・助成金の詳細情報"
    },
    {
      href: "/estimate",
      title: "料金シミュレーション",
      description: "制作費用を簡単に試算できます"
    }
  ];
  
  // 現在のページを除外した関連サービス
  const relatedServices = allServices.filter(service => service.href !== pathname);
  
  // サービスページ以外では表示しない
  if (!pathname.startsWith('/services/')) {
    return null;
  }
  
  return (
    <section className={styles.relatedLinks}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>その他のサービス</h2>
        <div className={styles.linksGrid}>
          {relatedServices.map((link) => (
            <Link key={link.href} href={link.href} className={styles.linkCard}>
              <h3 className={styles.linkTitle}>{link.title}</h3>
              <p className={styles.linkDescription}>{link.description}</p>
              <span className={styles.linkArrow}>詳しく見る →</span>
            </Link>
          ))}
        </div>
        
        <div className={styles.additionalLinks}>
          <h3 className={styles.additionalTitle}>お役立ち情報</h3>
          <div className={styles.additionalGrid}>
            {otherLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.additionalLink}>
                <span className={styles.additionalLinkText}>{link.title}</span>
                <span className={styles.additionalArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
