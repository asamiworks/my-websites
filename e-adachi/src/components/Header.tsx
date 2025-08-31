"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Twitter, Instagram, Facebook } from "lucide-react";
import styles from "./Header.module.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          {/* ロゴ */}
          <div className={styles.logo}>
            <Link href="/">
              <Image src="/logo.png" alt="株式会社足立電機" width={240} height={40} priority />
            </Link>
          </div>

          {/* PC用ナビゲーション */}
          <nav className={styles.navArea}>
            <div className={styles.topRow}>
              <div className={styles.businessInfo}>
                <span>営業時間: 9:00〜17:00（土日祝休）</span>
              </div>
              {/* SNSリンク */}
              <div className={styles.socialLinks}>
                <a href="https://x.com/adachidenki1940?s=11" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <Twitter size={20} />
                </a>
                <a href="https://www.instagram.com/adachidenki1940?igsh=MTl1Nnl3MjliMGNtdw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://www.facebook.com/adachidenki8939/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
            <ul className={styles.navLinks}>
              <li><Link href="/about">会社案内</Link></li>
              <li><Link href="/message">代表挨拶</Link></li>
              <li><Link href="/access">アクセス</Link></li>
              <li>
                <Link href="https://jh-ad.jp/contact/form.html">
                  お問合せ
                </Link>
              </li>
            </ul>
          </nav>

          {/* モバイル用ハンバーガー */}
          <button className={styles.hamburger} onClick={toggleMenu} aria-label="メニューを開く">
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* スマホ用オーバーレイメニュー */}
      {isOpen && (
        <>
          <div className={styles.mobileMenuBackdrop} onClick={closeMenu} />
          <div className={styles.mobileMenuOverlay}>
            <button className={styles.closeButton} onClick={closeMenu} aria-label="メニューを閉じる">
              <X size={32} />
            </button>
            <nav className={styles.mobileNav}>
              <ul className={styles.mobileNavLinks}>
                <li><Link href="/about" onClick={closeMenu}>会社案内</Link></li>
                <li><Link href="/message" onClick={closeMenu}>代表挨拶</Link></li>
                <li><Link href="/access" onClick={closeMenu}>アクセス</Link></li>
                <li>
                  <Link href="https://jh-ad.jp/contact/form.html" onClick={closeMenu}>
                    お問合せ
                  </Link>
                </li>
              </ul>
              
              {/* モバイルメニュー内の営業時間表示とSNSリンク */}
              <div className={styles.mobileMenuInfo}>
                <p className={styles.businessHoursDetail}>
                  営業時間: 9:00〜17:00（土日祝休）
                </p>
                {/* モバイル用SNSリンク */}
                <div className={styles.mobileSocialLinks}>
                  <a href="https://x.com/adachidenki1940?s=11" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                    <Twitter size={24} />
                  </a>
                  <a href="https://www.instagram.com/adachidenki1940?igsh=MTl1Nnl3MjliMGNtdw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram size={24} />
                  </a>
                  <a href="https://www.facebook.com/adachidenki8939/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook size={24} />
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;