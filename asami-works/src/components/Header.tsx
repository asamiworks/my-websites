"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownKey?: string;
  dropdownItems?: {
    label: string;
    href: string;
    badge?: string;
  }[];
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isMobilePackageOpen, setIsMobilePackageOpen] = useState(false);
  const [isMobileOriginalOpen, setIsMobileOriginalOpen] = useState(false);
  const [isMobileOthersOpen, setIsMobileOthersOpen] = useState(false);
  const [isMobileServiceOpen, setIsMobileServiceOpen] = useState(false);
  const pathname = usePathname();

  // スクロール検知
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // URLのハッシュに基づいてスクロールする処理
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [pathname]);

  const scrollPositionRef = useRef(0);

  // メニューを開いた時にスクロールを防ぐ
  useEffect(() => {
    if (isMenuOpen) {
      scrollPositionRef.current = window.scrollY;
      
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      if (scrollPositionRef.current > 0 && window.location.pathname === pathname) {
        window.scrollTo(0, scrollPositionRef.current);
        scrollPositionRef.current = 0;
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, pathname]);

  // ページ遷移時にメニューを閉じる
  useEffect(() => {
    setIsMenuOpen(false);
    setIsPackageOpen(false);
    setIsOriginalOpen(false);
    setIsOthersOpen(false);
    setIsServiceOpen(false);
    setIsMobilePackageOpen(false);
    setIsMobileOriginalOpen(false);
    setIsMobileOthersOpen(false);
    setIsMobileServiceOpen(false);
    scrollPositionRef.current = 0;
  }, [pathname]);

  const navItems: NavItem[] = [
    {
      label: "パッケージプラン",
      href: "/services/package",
      hasDropdown: true,
      dropdownKey: "package",
      dropdownItems: [
        { label: "LPプラン", href: "/services/package/demo/lp" },
        { label: "HPプラン", href: "/services/package/demo/corporate" }
      ]
    },
    {
      label: "オリジナルサイト制作",
      href: "/services/original",
      hasDropdown: true,
      dropdownKey: "original",
      dropdownItems: [
        { label: "LPプラン", href: "/services/original/lp" },
        { label: "HPプラン", href: "/services/original/corporate" },
        { label: "補助金対応プラン", href: "/services/original/grant" }
      ]
    },
    {
      label: "その他制作",
      href: "/services/others",
      hasDropdown: true,
      dropdownKey: "others",
      dropdownItems: [
        { label: "AppSheet構築", href: "/services/appsheet" },
        { label: "広告ページ制作", href: "/pr" }
      ]
    },
    {
      label: "サービス",
      href: "/service",
      hasDropdown: true,
      dropdownKey: "service",
      dropdownItems: [
        { label: "制作実績", href: "/about" },
        { label: "メール設定ガイド", href: "/support/email-setup" },
        { label: "よくある質問", href: "/#faq" }
      ]
    }
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(prev => !prev);
  };

  // アンカーリンクのクリック処理
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const anchor = href.substring(2);
      
      if (pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(anchor);
        
        if (element) {
          setIsMenuOpen(false);
          setIsMobilePackageOpen(false);
          setIsMobileOriginalOpen(false);
          setIsMobileOthersOpen(false);
          setIsMobileServiceOpen(false);
          
          const currentScrollPosition = scrollPositionRef.current;
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          document.body.style.overflow = '';
          
          if (currentScrollPosition > 0) {
            window.scrollTo(0, currentScrollPosition);
          }
          
          scrollPositionRef.current = 0;
          
          setTimeout(() => {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 100);
        }
      } else {
        setIsMenuOpen(false);
        setIsMobilePackageOpen(false);
        setIsMobileOriginalOpen(false);
        setIsMobileOthersOpen(false);
        setIsMobileServiceOpen(false);
        scrollPositionRef.current = 0;
      }
    }
  };

  const handleMobileAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleAnchorClick(e, href);
    
    if (href.startsWith('/#') && pathname === '/') {
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsMobilePackageOpen(false);
        setIsMobileOriginalOpen(false);
        setIsMobileOthersOpen(false);
        setIsMobileServiceOpen(false);
      }, 50);
    }
  };

  // ドロップダウンの開閉を管理
  const handleDropdownEnter = (key: string) => {
    if (key === "package") {
      setIsPackageOpen(true);
      setIsOriginalOpen(false);
      setIsOthersOpen(false);
      setIsServiceOpen(false);
    } else if (key === "original") {
      setIsOriginalOpen(true);
      setIsPackageOpen(false);
      setIsOthersOpen(false);
      setIsServiceOpen(false);
    } else if (key === "others") {
      setIsOthersOpen(true);
      setIsPackageOpen(false);
      setIsOriginalOpen(false);
      setIsServiceOpen(false);
    } else if (key === "service") {
      setIsServiceOpen(true);
      setIsPackageOpen(false);
      setIsOriginalOpen(false);
      setIsOthersOpen(false);
    }
  };

  const handleDropdownLeave = (key: string) => {
    if (key === "package") {
      setIsPackageOpen(false);
    } else if (key === "original") {
      setIsOriginalOpen(false);
    } else if (key === "others") {
      setIsOthersOpen(false);
    } else if (key === "service") {
      setIsServiceOpen(false);
    }
  };

  const handleMobileDropdownToggle = (key: string) => {
    if (key === "package") {
      setIsMobilePackageOpen(!isMobilePackageOpen);
      setIsMobileOriginalOpen(false);
      setIsMobileOthersOpen(false);
      setIsMobileServiceOpen(false);
    } else if (key === "original") {
      setIsMobileOriginalOpen(!isMobileOriginalOpen);
      setIsMobilePackageOpen(false);
      setIsMobileOthersOpen(false);
      setIsMobileServiceOpen(false);
    } else if (key === "others") {
      setIsMobileOthersOpen(!isMobileOthersOpen);
      setIsMobilePackageOpen(false);
      setIsMobileOriginalOpen(false);
      setIsMobileServiceOpen(false);
    } else if (key === "service") {
      setIsMobileServiceOpen(!isMobileServiceOpen);
      setIsMobilePackageOpen(false);
      setIsMobileOriginalOpen(false);
      setIsMobileOthersOpen(false);
    }
  };

  const getDropdownState = (key: string | undefined) => {
    if (key === "package") return isPackageOpen;
    if (key === "original") return isOriginalOpen;
    if (key === "others") return isOthersOpen;
    if (key === "service") return isServiceOpen;
    return false;
  };

  const getMobileDropdownState = (key: string | undefined) => {
    if (key === "package") return isMobilePackageOpen;
    if (key === "original") return isMobileOriginalOpen;
    if (key === "others") return isMobileOthersOpen;
    if (key === "service") return isMobileServiceOpen;
    return false;
  };

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.headerContent}>
          {/* ロゴ */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>AsamiWorks</span>
            <span className={styles.logoTagline}>補助金対応Web制作</span>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className={styles.desktopNav} aria-label="メインナビゲーション">
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li 
                  key={item.label} 
                  className={styles.navItem}
                  onMouseEnter={() => item.hasDropdown && handleDropdownEnter(item.dropdownKey!)}
                  onMouseLeave={() => item.hasDropdown && handleDropdownLeave(item.dropdownKey!)}
                >
                  <Link 
                    href={item.href} 
                    className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`}
                    onClick={(e) => handleAnchorClick(e, item.href)}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <span className={styles.dropdownArrow} aria-hidden="true">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                          <path d="M5 6L0 0h10L5 6z"/>
                        </svg>
                      </span>
                    )}
                  </Link>
                  
                  {/* ドロップダウンメニュー */}
                  {item.hasDropdown && (
                    <div className={`${styles.dropdown} ${getDropdownState(item.dropdownKey) ? styles.dropdownOpen : ""}`}>
                      <div className={styles.dropdownContent}>
                        {item.dropdownItems?.map((dropItem) => (
                          <Link
                            key={dropItem.href}
                            href={dropItem.href}
                            className={styles.dropdownItem}
                            onClick={(e) => handleAnchorClick(e, dropItem.href)}
                          >
                            <span className={styles.dropdownText}>{dropItem.label}</span>
                            {dropItem.badge && (
                              <span className={styles.dropdownBadge}>{dropItem.badge}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* CTAボタン群 */}
          <div className={styles.headerActions}>
            <Link href="/estimate" className={styles.estimateButton}>
              <span className={styles.buttonText}>料金シミュレーション</span>
            </Link>
            <Link href="/form" className={styles.ctaButton}>
              <span className={styles.buttonText}>無料相談</span>
            </Link>
          </div>

          {/* モバイルメニューボタン */}
          <button
            className={`${styles.mobileMenuButton} ${isMenuOpen ? styles.menuOpen : ""}`}
            onClick={handleMenuToggle}
            aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={isMenuOpen}
            type="button"
          >
            <span className={styles.hamburger}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </header>

      {/* モバイルメニュー */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <nav className={styles.mobileNav} aria-label="モバイルナビゲーション">
          <ul className={styles.mobileNavList}>
            {navItems.map((item) => (
              <li key={item.label} className={styles.mobileNavItem}>
                {item.hasDropdown ? (
                  <>
                    <button
                      className={styles.mobileNavLink}
                      onClick={() => handleMobileDropdownToggle(item.dropdownKey!)}
                      aria-expanded={getMobileDropdownState(item.dropdownKey)}
                      type="button"
                    >
                      {item.label}
                      <span className={`${styles.mobileDropdownArrow} ${getMobileDropdownState(item.dropdownKey) ? styles.rotated : ""}`}>
                        ›
                      </span>
                    </button>
                    {getMobileDropdownState(item.dropdownKey) && (
                      <ul className={styles.mobileDropdown}>
                        {item.dropdownItems?.map((dropItem) => (
                          <li key={dropItem.href}>
                            <Link 
                              href={dropItem.href} 
                              className={styles.mobileDropdownItem}
                              onClick={(e) => {
                                if (dropItem.href.startsWith('/#')) {
                                  handleMobileAnchorClick(e, dropItem.href);
                                } else {
                                  scrollPositionRef.current = 0;
                                }
                              }}
                            >
                              {dropItem.label}
                              {dropItem.badge && (
                                <span className={styles.mobileBadge}>{dropItem.badge}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link 
                    href={item.href} 
                    className={styles.mobileNavLink}
                    onClick={(e) => handleMobileAnchorClick(e, item.href)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          
          {/* モバイルCTAボタン */}
          <div className={styles.mobileCta}>
            <Link 
              href="/estimate" 
              className={styles.mobileEstimateButton}
              onClick={() => {
                scrollPositionRef.current = 0;
              }}
            >
              料金シミュレーション
            </Link>
            <Link 
              href="/form" 
              className={styles.mobileCtaButton}
              onClick={() => {
                scrollPositionRef.current = 0;
              }}
            >
              無料相談はこちら
            </Link>
          </div>
        </nav>
      </div>

      {/* オーバーレイ */}
      {isMenuOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}