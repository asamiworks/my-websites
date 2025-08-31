// アプリケーションのエントリーポイント
import siteConfig from '../data/site-config.json';
import menuData from '../data/menu.json';
import { createStructuredData } from './utils/structured-data';
import { initHeader, initSmoothScroll } from '../components/common/header';
import { initFooter } from '../components/common/footer';
import { initHero } from '../components/sections/hero';
import { initAbout } from '../components/sections/about';
import { initMenu } from '../components/sections/menu';
import { initConcerns } from '../components/sections/concerns';
import { initEvents } from '../components/sections/events';
import { createDirectorSection, initDirectorSection } from '../components/sections/director';
import { initStaff } from '../components/sections/staff';
import { initAccess } from '../components/sections/access';
import { initFAQ } from '../components/sections/faq';
import { initCTA } from '../components/sections/cta';

// グローバル設定
declare global {
  interface Window {
    siteConfig: typeof siteConfig;
    menuData: typeof menuData;
  }
}

// アプリケーションの初期化関数
function initializeApp(): void {
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
    const directorSection = createDirectorSection();
    document.querySelector('#director-section-container')?.insertAdjacentHTML('beforeend', directorSection);
    initStaff(); 
    initAccess();
    initFAQ();
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

// DOMContentLoadedで初期化を実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // すでに読み込まれている場合は即座に実行
  initializeApp();
}