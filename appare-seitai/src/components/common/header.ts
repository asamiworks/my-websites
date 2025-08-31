// ヘッダーコンポーネント
import siteConfig from '../../data/site-config.json';

// ヘッダーの状態管理
let isMenuOpen = false;

// ヘッダーの初期化
export function initHeader(): void {
  const headerEl = document.getElementById('header');
  if (!headerEl) return;

  // ヘッダーのHTML構造を生成（WebP対応）
  headerEl.innerHTML = `
    <div class="container header-container">
      <a href="#" class="header-logo" aria-label="${siteConfig.siteName}">
        <picture>
          <source srcset="/images/icons/logo.webp" type="image/webp">
          <source srcset="/images/icons/logo.png" type="image/png">
          <img 
            src="/images/icons/logo.jpg" 
            alt="${siteConfig.siteName}" 
            class="header-logo-icon"
            width="150"
            height="50"
            loading="eager"
          >
        </picture>
      </a>
      
      <nav class="header-nav" aria-label="メインナビゲーション">
        <ul class="nav-list">
          <li><a href="#about" class="nav-link">当院について</a></li>
          <li><a href="#concerns" class="nav-link">こんな症状に</a></li>
          <li><a href="#menu" class="nav-link">施術メニュー</a></li>
          <li><a href="#events" class="nav-link">イベント</a></li>
          <li><a href="#director" class="nav-link">院長紹介</a></li>
          <li><a href="#staff" class="nav-link">スタッフ</a></li>
          <li><a href="#access" class="nav-link">アクセス</a></li>
        </ul>
      </nav>
      
      <div class="header-cta">
        <div class="header-cta-group">
          <div class="header-reservation-text">完全予約制なので待ち時間なし！</div>
          <div class="header-cta-buttons">
            <div class="header-social-tablet">
              <a href="https://line.me/R/ti/p/@rjx1276z" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LINE">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 5.28 2 9.64c0 3.49 2.83 6.44 6.72 7.47-.03.13-.09.4-.11.48-.03.16-.11.62-.11.77 0 .23.11.43.31.51.16.07.35.03.47-.05.09-.05 1.17-1.07 1.71-1.57.93.13 1.88.2 2.83.2 5.52 0 10-3.08 10-6.81C22 5.28 17.52 2 12 2zm-3.61 10.03h-2.6c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.48h2.2c.22 0 .4.18.4.4s-.18.41-.4.41zm2.24 0c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .22-.18.4-.4.4zm4.45 0c-.16 0-.31-.1-.37-.25l-1.68-2.85v2.7c0 .22-.18.4-.4.4s-.4-.18-.4-.4V8.74c0-.18.12-.34.29-.38.17-.05.35.02.43.17l1.76 2.96V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .18-.12.34-.29.38-.05.02-.1.02-.14.02zm3.43-2.06c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.48h1.62c.22 0 .4.18.4.4s-.18.4-.4.4h-2.02c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4h2.02c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.43h1.62z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/appare.8008/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
              </a>
            </div>
            <a href="tel:${siteConfig.contact.tel}" class="header-cta-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              ${siteConfig.contact.telDisplay}
            </a>
          </div>
        </div>
        <div class="header-social">
          <a href="https://line.me/R/ti/p/@rjx1276z" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LINE">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 5.28 2 9.64c0 3.49 2.83 6.44 6.72 7.47-.03.13-.09.4-.11.48-.03.16-.11.62-.11.77 0 .23.11.43.31.51.16.07.35.03.47-.05.09-.05 1.17-1.07 1.71-1.57.93.13 1.88.2 2.83.2 5.52 0 10-3.08 10-6.81C22 5.28 17.52 2 12 2zm-3.61 10.03h-2.6c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.48h2.2c.22 0 .4.18.4.4s-.18.41-.4.41zm2.24 0c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .22-.18.4-.4.4zm4.45 0c-.16 0-.31-.1-.37-.25l-1.68-2.85v2.7c0 .22-.18.4-.4.4s-.4-.18-.4-.4V8.74c0-.18.12-.34.29-.38.17-.05.35.02.43.17l1.76 2.96V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .18-.12.34-.29.38-.05.02-.1.02-.14.02zm3.43-2.06c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.48h1.62c.22 0 .4.18.4.4s-.18.4-.4.4h-2.02c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4h2.02c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.43h1.62z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/appare.8008/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
            </svg>
          </a>
        </div>
      </div>
      
      <button class="mobile-menu-button" aria-label="メニューを開く" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    
    <!-- モバイルメニュー -->
    <nav class="mobile-menu" aria-label="モバイルナビゲーション">
      <ul class="mobile-nav-list">
        <li class="mobile-nav-item">
          <a href="#about" class="mobile-nav-link">当院について</a>
        </li>
        <li class="mobile-nav-item">
          <a href="#concerns" class="mobile-nav-link">こんな症状に</a>
        </li>
        <li class="mobile-nav-item">
          <a href="#menu" class="mobile-nav-link">施術メニュー</a>
        </li>
        <li class="mobile-nav-item">
          <a href="#events" class="mobile-nav-link">イベント</a>
        </li>
        <li class="mobile-nav-item">
          <a href="#director" class="mobile-nav-link">院長紹介</a>
        </li>
        <li class="mobile-nav-item">
          <a href="#staff" class="mobile-nav-link">スタッフ</a>
        </li>
        <li class="mobile-nav-item">
          <a href="#access" class="mobile-nav-link">アクセス</a>
        </li>
      </ul>
      
      <div class="mobile-cta">
        <div class="mobile-reservation-text">完全予約制なので待ち時間なし！</div>
        <a href="tel:${siteConfig.contact.tel}" class="mobile-cta-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          電話で予約
        </a>
        <a href="https://line.me/R/ti/p/@rjx1276z" target="_blank" rel="noopener noreferrer" class="mobile-cta-button secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 5.28 2 9.64c0 3.49 2.83 6.44 6.72 7.47-.03.13-.09.4-.11.48-.03.16-.11.62-.11.77 0 .23.11.43.31.51.16.07.35.03.47-.05.09-.05 1.17-1.07 1.71-1.57.93.13 1.88.2 2.83.2 5.52 0 10-3.08 10-6.81C22 5.28 17.52 2 12 2zm-3.61 10.03h-2.6c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.48h2.2c.22 0 .4.18.4.4s-.18.41-.4.41zm2.24 0c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .22-.18.4-.4.4zm4.45 0c-.16 0-.31-.1-.37-.25l-1.68-2.85v2.7c0 .22-.18.4-.4.4s-.4-.18-.4-.4V8.74c0-.18.12-.34.29-.38.17-.05.35.02.43.17l1.76 2.96V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .18-.12.34-.29.38-.05.02-.1.02-.14.02zm3.43-2.06c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.48h1.62c.22 0 .4.18.4.4s-.18.4-.4.4h-2.02c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4h2.02c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.43h1.62z"/>
          </svg>
          LINEで予約
        </a>
      </div>
    </nav>
  `;

  // イベントリスナーの設定
  setupEventListeners(headerEl);
  
  // 現在のページをハイライト
  highlightCurrentPage();
}

// イベントリスナーの設定
function setupEventListeners(headerEl: HTMLElement): void {
  // モバイルメニューボタン
  const menuButton = headerEl.querySelector('.mobile-menu-button') as HTMLButtonElement;
  const mobileMenu = headerEl.querySelector('.mobile-menu') as HTMLElement;
  const headerCta = headerEl.querySelector('.header-cta') as HTMLElement;
  
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      menuButton.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      menuButton.setAttribute('aria-expanded', String(isMenuOpen));
      menuButton.setAttribute('aria-label', isMenuOpen ? 'メニューを閉じる' : 'メニューを開く');
      
      // タブレットサイズでメニューを開いた時にヘッダーCTAを非表示
      if (headerCta && window.innerWidth > 768 && window.innerWidth <= 1200) {
        if (isMenuOpen) {
          headerCta.style.display = 'none';
        } else {
          headerCta.style.display = '';
        }
      }
      
      // スクロールの無効化/有効化
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
      
      // メニューを開く時にアクティブ状態を現在のハッシュに基づいて更新
      if (isMenuOpen) {
        const currentHash = window.location.hash;
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === currentHash) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
    
    // モバイルメニューのリンククリックで閉じる
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        menuButton.classList.remove('active');
        mobileMenu.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'メニューを開く');
        document.body.style.overflow = '';
        
        // タブレットサイズでヘッダーCTAを再表示
        if (headerCta && window.innerWidth > 768 && window.innerWidth <= 1200) {
          headerCta.style.display = '';
        }
        
        // モバイルメニューのアクティブ状態をリセット
        setTimeout(() => {
          mobileLinks.forEach(mobileLink => {
            mobileLink.classList.remove('active');
          });
        }, 300); // アニメーション完了後にリセット
      });
    });
  }
  
  // ウィンドウリサイズ時の処理
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1200 && isMenuOpen) {
      isMenuOpen = false;
      menuButton?.classList.remove('active');
      mobileMenu?.classList.remove('active');
      document.body.style.overflow = '';
      
      // ヘッダーCTAを再表示
      if (headerCta) {
        headerCta.style.display = '';
      }
    }
  });
}

// 現在のページをハイライト
function highlightCurrentPage(): void {
  const currentHash = window.location.hash;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentHash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// スムーズスクロールの初期化
export function initSmoothScroll(): void {
  // アンカーリンクのスムーズスクロール
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="#"]');
    
    if (link) {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      
      // #のみの場合はページトップへ
      if (targetId === '#') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      if (!targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // URLハッシュを更新（履歴に追加）
        history.pushState(null, '', targetId);
        
        // 現在のページをハイライト
        highlightCurrentPage();
      }
    }
  });
  
  // ハッシュ変更時の処理
  window.addEventListener('hashchange', highlightCurrentPage);
  
  // 初期読み込み時の処理
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      setTimeout(() => {
        const headerHeight = 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  }
}