import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* 装飾的な波模様 */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,20 C144,40 288,0 432,10 C576,20 720,45 864,35 C1008,25 1152,5 1296,15 C1440,25 1440,60 1440,60 L0,60 Z" 
                fill="var(--misaki-lightest)" 
                opacity="0.3" />
          <path d="M0,35 C144,25 288,45 432,35 C576,25 720,10 864,20 C1008,30 1152,40 1296,30 C1440,20 1440,60 1440,60 L0,60 Z" 
                fill="var(--misaki-lightest)" 
                opacity="0.5" />
        </svg>
      </div>

      <div className="footer-content">
        {/* メインフッターコンテンツ */}
        <div className="footer-main">
          {/* 会社情報 */}
          <div className="footer-company">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-text">nodebase</span>
            </Link>
            <p className="footer-company-name">株式会社ノードベース</p>
            <p className="footer-description">
              人と人、想いと機会が<br />
              つながる場所
            </p>
            
          </div>

          {/* ナビゲーション */}
          <nav className="footer-nav">
            <h3 className="footer-nav-title">サイトマップ</h3>
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <Link to="/" className="footer-nav-link">
                  <span className="nav-arrow">▸</span>ホーム
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/about" className="footer-nav-link">
                  <span className="nav-arrow">▸</span>会社概要
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/business" className="footer-nav-link">
                  <span className="nav-arrow">▸</span>事業内容
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/business/photography/works" className="footer-nav-link">
                  <span className="nav-arrow">▸</span>写真一覧
                </Link>
              </li>
              
            </ul>
          </nav>

          {/* 事業内容 */}
          <nav className="footer-nav">
            <h3 className="footer-nav-title">事業内容</h3>
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <Link to="/business/education" className="footer-nav-link">
                  <span className="nav-arrow">▸</span>予備校運営
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/business/photography" className="footer-nav-link">
                  <span className="nav-arrow">▸</span>写真・映像制作
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/business/marriage" className="footer-nav-link">
                  <span className="nav-arrow">▸</span>結婚相談所
                </Link>
              </li>
            </ul>
            
          </nav>

          {/* コンタクト */}
          <div className="footer-contact">
            <h3 className="footer-nav-title">お問い合わせ</h3>
            
            <Link to="/contact" className="footer-contact-button">
              お問い合わせフォーム →
            </Link>
          </div>
        </div>

        {/* フッター下部 */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p className="footer-copyright">
              © {currentYear} Nodebase Inc. All rights reserved.
            </p>
          </div>
          <div className="footer-bottom-center">
            <ul className="footer-bottom-links">
              <li><Link to="/privacy" className="footer-bottom-link">プライバシーポリシー</Link></li>
            </ul>
          </div>
          <div className="footer-bottom-right">
            <p className="footer-credit">
              Site by <a href="https://asami-works.com" target="_blank" rel="noopener noreferrer" className="footer-credit-link">AsamiWorks</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;