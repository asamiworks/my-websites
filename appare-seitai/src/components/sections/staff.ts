/**
 * スタッフ紹介セクションコンポーネント
 */

// スタッフデータの型定義
interface StaffMember {
  id: string;
  image: string;  // スタッフ情報を含む画像（1080×1080px）
  alt: string;    // alt属性用のテキスト
}

// スタッフデータ（実際のデータに合わせて更新してください）
// プロフィール画像は1080×1080pxの正方形推奨
// 画像をクリック/タップすると拡大表示されます
const staffData: StaffMember[] = [
  {
    id: 'staff1',
    image: '/images/staff/staff1.jpg',  // 1080×1080px、すべての情報を含む画像
    alt: 'スタッフ1の紹介'
  },
  {
    id: 'staff2', 
    image: '/images/staff/staff2.jpg',
    alt: 'スタッフ2の紹介'
  },
  // 必要に応じてスタッフを追加
];

/**
 * スタッフ紹介セクションの初期化
 */
export function initStaff(): void {
  const container = document.getElementById('staff');
  if (!container) {
    console.warn('スタッフ紹介セクションのコンテナが見つかりません');
    return;
  }

  // セクションのHTMLを挿入
  container.innerHTML = createStaffSection();

  // スライダーの初期化
  initSlider();

  // ライトボックスの初期化
  initLightbox();
}

/**
 * スタッフ紹介セクションのHTML生成
 */
function createStaffSection(): string {
  return `
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">スタッフ紹介</h2>
      </div>

      <div class="staff__content">
        <!-- スライダーコンテナ -->
        <div class="staff-slider">
          <!-- スライダーラッパー -->
          <div class="staff-slider__wrapper">
            ${staffData.map((staff, index) => createStaffSlide(staff, index)).join('')}
          </div>

          <!-- ナビゲーションボタン -->
          ${staffData.length > 1 ? `
            <button class="staff-slider__nav staff-slider__nav--prev" aria-label="前のスタッフ">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button class="staff-slider__nav staff-slider__nav--next" aria-label="次のスタッフ">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ` : ''}

          <!-- インジケーター（ドット） -->
          ${staffData.length > 1 ? `
            <div class="staff-slider__indicators">
              ${staffData.map((_, index) => `
                <button class="staff-slider__indicator ${index === 0 ? 'is-active' : ''}" 
                        data-slide="${index}" 
                        aria-label="スライド ${index + 1}">
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </div>

    <!-- ライトボックスモーダル -->
    <div class="staff-lightbox" id="staff-lightbox">
      <div class="staff-lightbox__overlay"></div>
      <div class="staff-lightbox__content">
        <img src="" alt="" class="staff-lightbox__image">
        <button class="staff-lightbox__close" aria-label="閉じる">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

/**
 * スタッフスライドの生成
 */
function createStaffSlide(staff: StaffMember, index: number): string {
  return `
    <div class="staff-slide ${index === 0 ? 'is-active' : ''}" data-slide="${index}">
      <img src="${staff.image}" alt="${staff.alt}" loading="lazy" class="staff-slide__image" data-staff-id="${staff.id}">
    </div>
  `;
}

/**
 * スライダーの初期化
 */
function initSlider(): void {
  const slider = document.querySelector('.staff-slider') as HTMLElement;
  if (!slider) return;

  const slides = slider.querySelectorAll('.staff-slide') as NodeListOf<HTMLElement>;
  const indicators = slider.querySelectorAll('.staff-slider__indicator') as NodeListOf<HTMLElement>;
  const prevBtn = slider.querySelector('.staff-slider__nav--prev') as HTMLButtonElement;
  const nextBtn = slider.querySelector('.staff-slider__nav--next') as HTMLButtonElement;

  // 1枚しかない場合はスライダー機能不要
  if (slides.length <= 1) return;

  let currentSlide = 0;

  // スライドを表示
  function showSlide(index: number): void {
    // 範囲チェック
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    // すべてのスライドとインジケーターを非アクティブに
    slides.forEach(slide => slide.classList.remove('is-active'));
    indicators.forEach(indicator => indicator.classList.remove('is-active'));

    // 現在のスライドをアクティブに
    slides[index].classList.add('is-active');
    if (indicators[index]) {
      indicators[index].classList.add('is-active');
    }

    currentSlide = index;
  }

  // 前のスライド
  function prevSlide(): void {
    showSlide(currentSlide - 1);
  }

  // 次のスライド
  function nextSlide(): void {
    showSlide(currentSlide + 1);
  }

  // イベントリスナー
  prevBtn?.addEventListener('click', prevSlide);
  nextBtn?.addEventListener('click', nextSlide);

  // インジケータークリック
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => showSlide(index));
  });

  // キーボードナビゲーション
  slider.addEventListener('keydown', (e) => {
    const event = e as KeyboardEvent;
    if (event.key === 'ArrowLeft') prevSlide();
    if (event.key === 'ArrowRight') nextSlide();
  });

  // タッチ/スワイプ対応
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = (e as TouchEvent).changedTouches[0].screenX;
  });

  slider.addEventListener('touchend', (e) => {
    touchEndX = (e as TouchEvent).changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe(): void {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide(); // 左スワイプ
      } else {
        prevSlide(); // 右スワイプ
      }
    }
  }

  // ボタンの状態を更新
  function updateButtonStates(): void {
    // 1枚しかない場合はボタンを非表示
    if (slides.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }

  // 初期化
  updateButtonStates();
}

/**
 * ライトボックスの初期化
 */
function initLightbox(): void {
  const lightbox = document.getElementById('staff-lightbox') as HTMLElement | null;
  if (!lightbox) return;

  const lightboxImage = lightbox.querySelector('.staff-lightbox__image') as HTMLImageElement | null;
  const closeBtn = lightbox.querySelector('.staff-lightbox__close') as HTMLButtonElement | null;
  const overlay = lightbox.querySelector('.staff-lightbox__overlay') as HTMLElement | null;

  // 画像クリックイベント
  const staffImages = document.querySelectorAll('.staff-slide__image');
  staffImages.forEach(img => {
    const imageElement = img as HTMLImageElement;
    
    // クリック可能であることを示すスタイル
    imageElement.style.cursor = 'pointer';
    
    imageElement.addEventListener('click', () => {
      if (lightboxImage) {
        lightboxImage.src = imageElement.src;
        lightboxImage.alt = imageElement.alt;
      }
      lightbox.classList.add('is-active');
      document.body.style.overflow = 'hidden'; // スクロール防止
    });
  });

  // 閉じる処理（lightboxをパラメータとして受け取る）
  const closeLightbox = (): void => {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = ''; // スクロール復元
  };

  // 閉じるボタン
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  // オーバーレイクリックで閉じる
  if (overlay) {
    overlay.addEventListener('click', closeLightbox);
  }

  // ESCキーで閉じる
  const handleEscKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
      closeLightbox();
    }
  };
  document.addEventListener('keydown', handleEscKey);

  // 画像クリックでは閉じない
  if (lightboxImage) {
    lightboxImage.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}