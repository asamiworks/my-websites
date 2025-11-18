'use client';

import Link from '@/components/Link';
import { usePathname } from 'next/navigation';
import styles from './AdminNav.module.css';

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              AsamiWorks 会計・財務管理システム
            </h1>
          </div>
          <div className={styles.linksSection}>
            <Link
              href="/admin/dashboard"
              className={`${styles.navLink} ${isActive('/admin/dashboard') ? styles.navLinkActive : ''}`}
            >
              ダッシュボード
            </Link>
            <Link
              href="/admin/clients"
              className={`${styles.navLink} ${isActive('/admin/clients') ? styles.navLinkActive : ''}`}
            >
              クライアント管理
            </Link>
            <Link
              href="/admin/invoices"
              className={`${styles.navLink} ${isActive('/admin/invoices') ? styles.navLinkActive : ''}`}
            >
              請求書管理
            </Link>
            <Link
              href="/admin/payments"
              className={`${styles.navLink} ${isActive('/admin/payments') ? styles.navLinkActive : ''}`}
            >
              入金確認
            </Link>
            <Link
              href="/admin/expenses"
              className={`${styles.navLink} ${isActive('/admin/expenses') ? styles.navLinkActive : ''}`}
            >
              経費管理
            </Link>
            <Link
              href="/admin/financial"
              className={`${styles.navLink} ${isActive('/admin/financial') ? styles.navLinkActive : ''}`}
            >
              財務ダッシュボード
            </Link>
            <Link
              href="/admin/tax-return"
              className={`${styles.navLink} ${isActive('/admin/tax-return') ? styles.navLinkActive : ''}`}
            >
              確定申告
            </Link>
            <Link
              href="/admin/settings"
              className={`${styles.navLink} ${isActive('/admin/settings') ? styles.navLinkActive : ''}`}
            >
              設定
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
