"use client";

import Link from "@/components/Link";
import { usePathname } from "next/navigation";
import styles from "./Breadcrumb.module.css";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // パスからパンくずリストを生成
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(path => path !== '');
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'ホーム', href: '/' }
    ];

    // パスマッピング
    const pathLabels: { [key: string]: string } = {
      'services': 'サービス',
      'lp': 'ランディングページ制作',
      'corporate': 'コーポレートサイト制作',
      'grant': '補助金対応サイト制作',
      'webapp': 'WEBアプリ開発',
      'subsidy': '補助金・助成金情報',
      'estimate': '料金シミュレーション',
      'form': 'お問い合わせ',
      'contact': 'お問い合わせ',
      'privacy': 'プライバシーポリシー',
      'package': 'パッケージ',
      'original': 'オリジナル',
      'terms': '利用規約'
    };

    // パスを順番に処理
    paths.forEach((path, index) => {
      const label = pathLabels[path] || path;
      const href = index === paths.length - 1 ? undefined : '/' + paths.slice(0, index + 1).join('/');
      breadcrumbs.push({ label, href });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // ホームページや特定のページではパンくずリストを表示しない
  if (
    pathname === '/' ||
    pathname === '/form' ||
    pathname === '/estimate' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/mypage')
  ) {
    return null;
  }

  // 構造化データ
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://asami-works.com${item.href}` : undefined
    }))
  };

  return (
    <nav className={styles.breadcrumb} aria-label="パンくずリスト">
      <div className={styles.breadcrumbContainer}>
        <ol className={styles.breadcrumbList}>
          {breadcrumbs.map((item, index) => (
            <li key={index} className={styles.breadcrumbItem}>
              {item.href ? (
                <>
                  <Link href={item.href} className={styles.breadcrumbLink}>
                    {item.label}
                  </Link>
                  <span className={styles.breadcrumbSeparator} aria-hidden="true">
                    &gt;
                  </span>
                </>
              ) : (
                <span className={styles.breadcrumbCurrent} aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </nav>
  );
}