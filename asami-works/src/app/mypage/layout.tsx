"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import styles from "./layout.module.css";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ユーザーメニューの外側クリック検知
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('ログアウトエラー:', error);
      alert('ログアウトに失敗しました。もう一度お試しください。');
    }
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'ユーザー';
  };

  return (
    <div className={styles.pageWrapper}>
      {/* シンプルなヘッダー */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>AsamiWorks</span>
          </Link>

          {user && (
            <div className={styles.userMenu} ref={userMenuRef}>
              <button
                className={styles.userMenuButton}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-expanded={isUserMenuOpen}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 10c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className={styles.userName}>{getUserDisplayName()}</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" className={styles.dropdownArrowIcon}>
                  <path d="M5 6L0 0h10L5 6z"/>
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className={styles.userMenuDropdown}>
                  <Link href="/" className={styles.userMenuItem} onClick={() => setIsUserMenuOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                    ホームに戻る
                  </Link>
                  <button className={styles.userMenuItem} onClick={handleLogout} type="button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        {children}
      </main>

      {/* シンプルなフッター */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.copyright}>© 2025 AsamiWorks. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/privacy" className={styles.footerLink}>プライバシーポリシー</Link>
            <span className={styles.separator}>|</span>
            <Link href="/terms" className={styles.footerLink}>利用規約</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
