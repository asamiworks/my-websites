"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "../utils/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const [nickname, setNickname] = useState("ゲスト");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) {
      setNickname(storedNickname);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || storedNickname || "ゲスト";
        setNickname(displayName);
        setIsLoggedIn(true);
      } else {
        setNickname("ゲスト");
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("ログアウトしました");
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* ロゴエリア */}
          <Link href="/" className={styles.logoArea}>
            <div className={styles.logoIcon}>
              <span>H</span>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoSubtext}>
                注文住宅で家を建てるなら
              </span>
              <h1 className={styles.logoTitle}>
                マイホームスターター
              </h1>
            </div>
          </Link>

          {/* 中央エリア - デスクトップナビゲーション */}
          <nav className={styles.desktopNav}>
            <Link href="/about" className={styles.navLink}>
              <span>私たちについて</span>
              <div className={styles.navUnderline}></div>
            </Link>
            
            <Link href="/Housing-concierge" className={styles.navLink}>
              <span>当サイトの強み</span>
              <div className={styles.navUnderline}></div>
            </Link>
            
            {/* ログイン中のみマイページリンクを表示 */}
            {isLoggedIn && (
              <Link href="/my-page" className={styles.navLink}>
                <span>マイページ</span>
                <div className={styles.navUnderline}></div>
              </Link>
            )}
          </nav>

          {/* 右側エリア - ユーザー情報とアクション */}
          <div className={styles.rightArea}>
            {/* ユーザー名表示 - ログイン中はクリック可能 */}
            {isLoggedIn ? (
              <Link href="/my-page" className={styles.userInfoLink}>
                <div className={styles.userInfo}>
                  <div className={`${styles.statusDot} ${styles.online}`}></div>
                  <span className={styles.userName}>
                    {nickname}様
                  </span>
                </div>
              </Link>
            ) : (
              <div className={styles.userInfo}>
                <div className={`${styles.statusDot} ${styles.offline}`}></div>
                <span className={styles.userName}>
                  {nickname}様
                </span>
              </div>
            )}

            {/* ログイン/ログアウトボタン - デスクトップ */}
            <div className={styles.desktopAuthBtn}>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className={styles.logoutBtn}
                >
                  ログアウト
                </button>
              ) : (
                <Link href="/login" className={styles.loginBtn}>
                  ログイン
                </Link>
              )}
            </div>

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={styles.mobileMenuBtn}
              aria-label="メニュー"
            >
              <div className={styles.hamburger}>
                <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
                <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
                <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <Link href="/about" className={styles.mobileNavLink}>
              私たちについて
            </Link>
            
            <Link href="/Housing-concierge" className={styles.mobileNavLink}>
              当サイトの強み
            </Link>

            {/* ログイン中のみマイページリンクを表示 - モバイル */}
            {isLoggedIn && (
              <Link href="/my-page" className={styles.mobileNavLink}>
                マイページ
              </Link>
            )}

            <div className={styles.mobileAuthSection}>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className={styles.mobileLogoutBtn}
                >
                  ログアウト
                </button>
              ) : (
                <Link href="/login" className={styles.mobileLoginBtn}>
                  ログイン
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}