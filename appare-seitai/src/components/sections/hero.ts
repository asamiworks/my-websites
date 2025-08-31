import siteConfig from '../../data/site-config.json';

interface HeroImage {
  src: string;
  srcWebp: string;
  alt: string;
}

export function initHero(): void {
  const heroEl = document.getElementById('hero');
  if (!heroEl) return;

  // ヒーロー画像の設定（WebP対応）
  const heroImages: HeroImage[] = [
    { 
      src: '/images/hero/hero1.jpg',
      srcWebp: '/images/hero/hero1.webp',
      alt: '天晴れ整体院の施術風景1' 
    },
    { 
      src: '/images/hero/hero2.jpg',
      srcWebp: '/images/hero/hero2.webp',
      alt: '天晴れ整体院の施術風景2' 
    },
    { 
      src: '/images/hero/hero3.jpg',
      srcWebp: '/images/hero/hero3.webp',
      alt: '天晴れ整体院の施術風景3' 
    }
  ];

  // モバイルかどうかを判定
  const isMobile = window.innerWidth <= 768;

  // HTMLの生成 - モバイルの場合は背景画像として実装
  if (isMobile) {
    // モバイル版：背景画像として実装
    heroEl.innerHTML = `
      <div class="hero-container">
        <!-- 画像スライダー -->
        <div class="hero-slider" role="region" aria-label="施術院の紹介画像">
          ${heroImages.map((image, index) => `
            <div class="hero-slide ${index === 0 ? 'active' : ''}" 
                 data-slide="${index}"
                 style="background-image: url('${image.srcWebp || image.src}')">
              <div class="hero-overlay"></div>
            </div>
          `).join('')}
        </div>
        
        <!-- メインコンテンツ -->
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="hero-title-main" data-text="天晴れ整体院">天晴れ整体院</span>
            </h1>
            <p class="hero-description">
              不調からあなたの笑顔を取り戻す<br>
              カラダもココロも晴れる整体院
            </p>
          </div>
        </div>
        
        <!-- スライダーインジケーター -->
        <div class="hero-indicators" role="tablist" aria-label="画像選択">
          ${heroImages.map((_, index) => `
            <button 
              class="hero-indicator ${index === 0 ? 'active' : ''}" 
              data-slide="${index}"
              role="tab"
              aria-selected="${index === 0 ? 'true' : 'false'}"
              aria-label="画像${index + 1}を表示"
            ></button>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    // デスクトップ版：通常のimg要素
    heroEl.innerHTML = `
      <div class="hero-container">
        <!-- 画像スライダー -->
        <div class="hero-slider" role="region" aria-label="施術院の紹介画像">
          ${heroImages.map((image, index) => `
            <div class="hero-slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
              <picture>
                <source srcset="${image.srcWebp}" type="image/webp">
                <source srcset="${image.src}" type="image/jpeg">
                <img 
                  src="${image.src}" 
                  alt="${image.alt}" 
                  loading="${index === 0 ? 'eager' : 'lazy'}"
                  width="1477"
                  height="1108"
                  decoding="async"
                >
              </picture>
              <div class="hero-overlay"></div>
            </div>
          `).join('')}
        </div>
        
        <!-- メインコンテンツ -->
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="hero-title-main" data-text="天晴れ整体院">天晴れ整体院</span>
            </h1>
            <p class="hero-description">
              不調からあなたの笑顔を取り戻す<br>
              カラダもココロも晴れる整体院
            </p>
          </div>
        </div>
        
        <!-- スライダーインジケーター -->
        <div class="hero-indicators" role="tablist" aria-label="画像選択">
          ${heroImages.map((_, index) => `
            <button 
              class="hero-indicator ${index === 0 ? 'active' : ''}" 
              data-slide="${index}"
              role="tab"
              aria-selected="${index === 0 ? 'true' : 'false'}"
              aria-label="画像${index + 1}を表示"
            ></button>
          `).join('')}
        </div>
        
        <!-- スクロールヒント -->
        <div class="hero-scroll-hint" aria-hidden="true">
          <span class="scroll-text">SCROLL</span>
          <span class="scroll-line"></span>
        </div>
      </div>
    `;
  }

  // スライダーの初期化
  initHeroSlider();
  
  // ウィンドウリサイズ時の処理
  let resizeTimer: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      // 再初期化
      initHero();
    }, 250);
  });
}

// スライダー機能の実装（状態ベース版）
function initHeroSlider(): void {
  const slides = document.querySelectorAll<HTMLElement>('.hero-slide');
  const indicators = document.querySelectorAll<HTMLButtonElement>('.hero-indicator');
  
  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval: number;
  
  // 各インジケーターの状態を追跡（true = 白い状態、false = 半透明状態）
  const indicatorStates: boolean[] = new Array(indicators.length).fill(false);

  // インジケーターの視覚的な状態を判定
  function isIndicatorWhite(indicator: HTMLButtonElement): boolean {
    // completedクラスがある = 確実に白い
    if (indicator.classList.contains('completed')) return true;
    
    // アニメーション中の場合
    if (indicator.classList.contains('active')) {
      // 塗りつぶし中 = まだ白くない
      if (indicator.classList.contains('fill')) return false;
      // 消去中 = まだ白い
      if (indicator.classList.contains('clear')) return true;
    }
    
    // それ以外は半透明
    return false;
  }

  // スライドを切り替える関数
  function setSlide(index: number, isManual: boolean = false): void {
    // 現在のスライドの処理
    if (currentSlide !== index) {
      const prevIndicator = indicators[currentSlide];
      
      // アニメーション中の場合、現在の視覚的な状態を判定
      if (prevIndicator.classList.contains('active')) {
        if (prevIndicator.classList.contains('fill')) {
          // 塗りつぶしアニメーション中 → 完了したことにする
          prevIndicator.classList.add('completed');
          indicatorStates[currentSlide] = true;
        } else if (prevIndicator.classList.contains('clear')) {
          // 消去アニメーション中 → 半透明に戻す
          prevIndicator.classList.remove('completed');
          indicatorStates[currentSlide] = false;
        }
      }
      
      // アクティブ状態を削除
      prevIndicator.classList.remove('active', 'fill', 'clear');
    }

    // 手動クリックでジャンプする場合の処理
    if (isManual && Math.abs(index - currentSlide) > 1) {
      const start = Math.min(currentSlide, index);
      const end = Math.max(currentSlide, index);
      
      // 現在のスライドの「完了予定状態」を判定
      const currentIndicator = indicators[currentSlide];
      let baseState = isIndicatorWhite(currentIndicator);
      if (currentIndicator.classList.contains('active')) {
        if (currentIndicator.classList.contains('fill')) {
          baseState = true; // 塗りつぶし中なら白になる予定
        } else if (currentIndicator.classList.contains('clear')) {
          baseState = false; // 消去中なら半透明になる予定
        }
      }
      
      // スキップされるインジケーターの処理
      for (let i = start + 1; i < end; i++) {
        const indicator = indicators[i];
        
        // 現在のスライドの完了予定状態と同じにする
        indicator.classList.remove('active', 'fill', 'clear');
        if (baseState) {
          indicator.classList.add('completed');
          indicatorStates[i] = true;
        } else {
          indicator.classList.remove('completed');
          indicatorStates[i] = false;
        }
      }
    }

    // スライドの切り替え
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].setAttribute('aria-selected', 'false');

    currentSlide = index;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].setAttribute('aria-selected', 'true');
    indicators[currentSlide].classList.add('active');

    // 新しいスライドのアニメーション開始
    // 現在の状態を確認して適切なアニメーションを選択
    const isCurrentlyWhite = indicatorStates[currentSlide];
    
    if (isCurrentlyWhite) {
      // 白い状態 → 消去アニメーション
      indicators[currentSlide].classList.add('clear');
      indicators[currentSlide].classList.remove('fill');
    } else {
      // 半透明状態 → 塗りつぶしアニメーション
      indicators[currentSlide].classList.add('fill');
      indicators[currentSlide].classList.remove('clear');
    }
  }

  // 次のスライドへ
  function nextSlide(): void {
    const next = (currentSlide + 1) % slides.length;
    setSlide(next, false);
  }

  // 自動スライドの開始
  function startAutoSlide(): void {
    slideInterval = window.setInterval(nextSlide, 5000);
  }

  // 自動スライドの停止
  function stopAutoSlide(): void {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  // インジケーターのクリックイベント
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      if (index === currentSlide) return;
      
      stopAutoSlide();
      setSlide(index, true);
      startAutoSlide();
    });
  });

  // キーボード操作のサポート
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      stopAutoSlide();
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      setSlide(prev, true);
      startAutoSlide();
    } else if (e.key === 'ArrowRight') {
      stopAutoSlide();
      const next = (currentSlide + 1) % slides.length;
      setSlide(next, true);
      startAutoSlide();
    }
  });

  // 初期状態を設定（最初は塗りつぶしアニメーション）
  indicators[0].classList.add('active', 'fill');
  indicatorStates[0] = false; // 半透明からスタート

  // reduced motionの確認
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    startAutoSlide();
  }

  // ページ離脱時にタイマーをクリア
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoSlide();
    } else if (!prefersReducedMotion) {
      startAutoSlide();
    }
  });
}