// アプリケーションの初期化
import siteConfig from '../data/site-config.json';
import menuData from '../data/menu.json';
import { createStructuredData } from './utils/structured-data.js';
import { initHeader, initSmoothScroll } from '../components/common/header.js';
import { initFooter } from '../components/common/footer.js';
import { initHero } from '../components/sections/hero.js';
import { initAbout } from '../components/sections/about.js';
import { initMenu } from '../components/sections/menu.js';
import { initConcerns } from '../components/sections/concerns.js';
import { initEvents } from '../components/sections/events.js';
import { initAccess } from '../components/sections/access.js';
import { initCTA } from '../components/sections/cta.js';

// グローバル設定
declare global {
  interface Window {
    siteConfig: typeof siteConfig;
    menuData: typeof menuData;
  }
}

// アプリケーションの初期化関数
export function initializeApp(): void {
  try {
    // グローバルに設定を公開（デバッグ用）
    window.siteConfig = siteConfig;
    window.menuData = menuData;

    // 構造化データの設定
    const structuredDataEl = document.getElementById('structured-data');
    if (structuredDataEl) {
      structuredDataEl.textContent = JSON.stringify(createStructuredData(siteConfig));
    }

    // 各コンポーネントの初期化
    initHeader();
    initFooter();
    initHero();
    initAbout();
    initMenu();
    initConcerns();
    initEvents();
    initAccess();
    initCTA();
    
    // グローバル機能の初期化
    initSmoothScroll();

    // ページ全体の初期化完了
    console.log('✅ 天晴れ整体院サイトの初期化が完了しました');
    
    // パフォーマンス計測
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        console.log(`ページ読み込み時間: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
      });
    }

  } catch (error) {
    console.error('❌ アプリケーションの初期化中にエラーが発生しました:', error);
  }
}