import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Header.css';
import logo from '../assets/images/common/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // スクロール検知
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // モバイルメニュー開閉時のスクロール制御
  useEffect(() => {
    if (isMobileMenuOpen) {
      // 現在のスクロール位置を保存
      const scrollY = window.scrollY;
      
      // スクロールを無効化
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.classList.add('menu-open');
    } else {
      // スクロール位置を復元
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('menu-open');
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    // クリーンアップ
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('menu-open');
    };
  }, [isMobileMenuOpen]);

  // 現在のパスを取得
  const currentPath = window.location.pathname;

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* ロゴ */}
          <Link to="/" className="logo">
            <img 
              src={logo} 
              alt="nodebase" 
              style={{ 
                height: '40px',
                width: 'auto',
                display: 'block'
              }}
            />
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${currentPath === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/business" 
              className={`nav-link ${currentPath === '/business' ? 'active' : ''}`}
            >
              Business
            </Link>
            <Link 
              to="/business/photography/works" 
              className={`nav-link ${currentPath === '/business/photography/works' ? 'active' : ''}`}
            >
              Photo
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${currentPath === '/contact' ? 'active' : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* モバイルメニューボタン */}
          <button
            className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* モバイルナビゲーション */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-content">
          <Link 
            to="/" 
            className={`mobile-nav-link ${currentPath === '/' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`mobile-nav-link ${currentPath === '/about' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/business" 
            className={`mobile-nav-link ${currentPath === '/business' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Business
          </Link>
          <Link 
            to="/business/photography/works" 
            className={`mobile-nav-link ${currentPath === '/business/photography/works' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Photo
          </Link>
          <Link 
            to="/contact" 
            className={`mobile-nav-link ${currentPath === '/contact' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;