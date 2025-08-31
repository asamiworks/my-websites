import styles from "./Footer.module.css";

const Footer = () => {
  const sitemapItems = [
    { label: 'トップ', href: '#' },
    { label: 'コース紹介', href: '#course-overview' },
    { label: '利用方法', href: '#how-to-use' },
    { label: '料金', href: '#pricing' },
    { label: 'アクセス', href: '#access' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* サイトマップ */}
          <nav className={styles.sitemap}>
            <h3 className={styles.sitemapTitle}>サイトマップ</h3>
            <ul className={styles.sitemapList}>
              {sitemapItems.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className={styles.sitemapLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* SNSリンク */}
          <div className={styles.socialSection}>
            <h3 className={styles.socialTitle}>Follow Us</h3>
            <div className={styles.socialLinks}>
              <a
                href="https://instagram.com/wilddirt_rc"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialButton}
                aria-label="Instagram"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://x.com/wildrctukuba"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialButton}
                aria-label="X (旧Twitter)"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X(Twitter)</span>
              </a>
            </div>
          </div>

          {/* 下部情報 */}
          <div className={styles.bottomInfo}>
            <p className={styles.copyright}>
              © 2025 WRC-Tsukuba. All rights reserved.
            </p>
            
            <div className={styles.credit}>
              <span>サイト制作：</span>
              <a 
                href="https://asami-works.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.creditLink}
              >
                AsamiWorks
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;