// イベント情報セクションコンポーネント

interface EventInfo {
  title: string;
  season: '夏' | '冬';
  imageUrl: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  nextEventDate?: string;
}

// 現在の季節を判定する関数
function getCurrentSeason(): '春' | '夏' | '秋' | '冬' {
  const month = new Date().getMonth() + 1;
  
  if (month >= 3 && month <= 5) return '春';
  if (month >= 6 && month <= 8) return '夏';
  if (month >= 9 && month <= 11) return '秋';
  return '冬';
}

// 次回のイベント時期を計算する関数
function getNextEventDate(): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentSeason = getCurrentSeason();
  
  if (currentSeason === '春' || (currentSeason === '夏' && currentMonth <= 7)) {
    return `${currentYear}年夏`;
  } else if (currentSeason === '夏' || currentSeason === '秋') {
    return `${currentYear}年冬`;
  } else {
    return `${currentYear + 1}年夏`;
  }
}

// キャンペーンがアクティブかチェックする関数
function checkCampaignActive(startDate: Date, endDate: Date): boolean {
  const now = new Date();
  return now >= startDate && now <= endDate;
}

export function initEvents(): void {
  const eventsEl = document.getElementById('events');
  if (!eventsEl) return;

  // ========================================
  // キャンペーン設定エリア（ここを編集してください）
  // ========================================
  // キャンペーンタイトル
  const campaignTitle = '冬の特別キャンペーン';

  // キャンペーン期間
  const campaignStartDate = new Date('2025-11-01T00:00:00');  // 開始日時
  const campaignEndDate = new Date('2026-02-28T23:59:59');    // 終了日時

  // キャンペーン画像のパス（1076×1522px）
  const campaignImageUrl = '/images/events/campaign-winter-2025.jpg';

  // 季節（'夏' または '冬'）
  const campaignSeason: '夏' | '冬' = '冬';
  // ========================================

  // 現在のイベント情報
  const currentEvent: EventInfo = {
    title: campaignTitle,
    season: campaignSeason,
    imageUrl: campaignImageUrl,
    startDate: campaignStartDate,
    endDate: campaignEndDate,
    isActive: checkCampaignActive(campaignStartDate, campaignEndDate),
    nextEventDate: getNextEventDate()
  };

  // 連絡先情報（実際の運用ではsite-configから取得）
  const contactInfo = {
    lineUrl: 'https://line.me/R/ti/p/@rjx1276z',
    instagramUrl: 'https://www.instagram.com/appare.8008/',
    tel: '0297-64-8008',
    telDisplay: '0297-64-8008'
  };

  eventsEl.innerHTML = `
    <div class="container">
      <h2 class="section-title">イベント・キャンペーン</h2>
      
      ${currentEvent.isActive ? `
        <div class="event-container">
          <div class="event-content">
            <div class="event-header">
              <h3 class="event-title">${currentEvent.title}</h3>
              <p class="event-instruction">画像をクリックで拡大表示</p>
            </div>
            
            <div class="event-image-wrapper" tabindex="0" role="button" aria-label="画像を拡大">
              <img
                src="${currentEvent.imageUrl}"
                alt="${currentEvent.title}"
                class="event-image"
                loading="lazy"
                width="1076"
                height="1522"
              >
              <div class="event-image-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                  <line x1="11" y1="8" x2="11" y2="14"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
            </div>
            
            <div class="event-period">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>開始: ${currentEvent.startDate.toLocaleDateString('ja-JP')}</span>
            </div>
            
            <div class="event-cta-section">
              <p class="event-cta-title">お得情報をチェック！</p>
              <div class="event-cta-buttons">
                <a href="${contactInfo.lineUrl}" target="_blank" rel="noopener noreferrer" class="event-cta-button event-cta-line">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 5.28 2 9.64c0 3.49 2.83 6.44 6.72 7.47-.03.13-.09.4-.11.48-.03.16-.11.62-.11.77 0 .23.11.43.31.51.16.07.35.03.47-.05.09-.05 1.17-1.07 1.71-1.57.93.13 1.88.2 2.83.2 5.52 0 10-3.08 10-6.81C22 5.28 17.52 2 12 2zm-3.61 10.03h-2.6c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.48h2.2c.22 0 .4.18.4.4s-.18.41-.4.41zm2.24 0c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .22-.18.4-.4.4zm4.45 0c-.16 0-.31-.1-.37-.25l-1.68-2.85v2.7c0 .22-.18.4-.4.4s-.4-.18-.4-.4V8.74c0-.18.12-.34.29-.38.17-.05.35.02.43.17l1.76 2.96V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .18-.12.34-.29.38-.05.02-.1.02-.14.02zm3.43-2.06c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.48h1.62c.22 0 .4.18.4.4s-.18.4-.4.4h-2.02c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4h2.02c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.43h1.62z"/>
                  </svg>
                  <span>LINE</span>
                </a>
                <a href="${contactInfo.instagramUrl}" target="_blank" rel="noopener noreferrer" class="event-cta-button event-cta-instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
                <a href="tel:${contactInfo.tel}" class="event-cta-button event-cta-phone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>電話</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ` : `
        <div class="events-empty">
          <div class="events-empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
            </svg>
          </div>
          <h3 class="events-empty-title">ただいま準備中です</h3>
          <p class="events-empty-message">
            現在、イベント・キャンペーンは開催しておりません
          </p>
          ${currentEvent.nextEventDate ? `
            <div class="events-next-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <p>次回は<strong>${currentEvent.nextEventDate}</strong>頃を予定しています</p>
            </div>
          ` : ''}
          <div class="events-empty-actions">
            <p class="events-empty-note">お得な情報をいち早くお届け！</p>
            <div class="events-sns-links">
              <a href="${contactInfo.lineUrl}" target="_blank" rel="noopener noreferrer" class="events-sns-link line">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 5.28 2 9.64c0 3.49 2.83 6.44 6.72 7.47-.03.13-.09.4-.11.48-.03.16-.11.62-.11.77 0 .23.11.43.31.51.16.07.35.03.47-.05.09-.05 1.17-1.07 1.71-1.57.93.13 1.88.2 2.83.2 5.52 0 10-3.08 10-6.81C22 5.28 17.52 2 12 2zm-3.61 10.03h-2.6c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.48h2.2c.22 0 .4.18.4.4s-.18.41-.4.41zm2.24 0c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .22-.18.4-.4.4zm4.45 0c-.16 0-.31-.1-.37-.25l-1.68-2.85v2.7c0 .22-.18.4-.4.4s-.4-.18-.4-.4V8.74c0-.18.12-.34.29-.38.17-.05.35.02.43.17l1.76 2.96V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .18-.12.34-.29.38-.05.02-.1.02-.14.02zm3.43-2.06c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.48h1.62c.22 0 .4.18.4.4s-.18.4-.4.4h-2.02c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4h2.02c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.43h1.62z"/>
                </svg>
                <span>LINE登録</span>
              </a>
              <a href="${contactInfo.instagramUrl}" target="_blank" rel="noopener noreferrer" class="events-sns-link instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
                <span>フォロー</span>
              </a>
            </div>
          </div>
        </div>
      `}
      
      <div class="events-note">
        <p>※イベント内容は予告なく変更される場合があります</p>
        <p>※詳細はお電話または店頭にてお問い合わせください</p>
      </div>
    </div>
    
    <!-- 画像拡大モーダル -->
    ${currentEvent.isActive ? `
      <div class="event-modal" id="eventModal">
        <div class="event-modal-overlay"></div>
        <div class="event-modal-content">
          <button class="event-modal-close" aria-label="閉じる">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img src="" alt="" class="event-modal-image">
        </div>
      </div>
    ` : ''}
  `;

  // イベントリスナーの設定
  if (currentEvent.isActive) {
    initEventListeners();
    
    // 画像のエラーハンドリング
    const eventImage = document.querySelector('.event-image') as HTMLImageElement;
    if (eventImage) {
      eventImage.onerror = function() {
        console.error('イベント画像の読み込みに失敗しました:', currentEvent.imageUrl);
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA3NiIgaGVpZ2h0PSIxNTIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7nlLvlg4/jgpLoqq3jgb/ovrzjgoHjgb7jgZvjgpM8L3RleHQ+PC9zdmc+';
        this.alt = '画像を読み込めませんでした';
      };
    }
  }
}

function initEventListeners(): void {
  const modal = document.getElementById('eventModal');
  const modalImage = modal?.querySelector('.event-modal-image') as HTMLImageElement;
  const modalClose = modal?.querySelector('.event-modal-close') as HTMLButtonElement;
  const modalOverlay = modal?.querySelector('.event-modal-overlay');
  const eventImageWrapper = document.querySelector('.event-image-wrapper') as HTMLElement;
  
  // 画像クリックで拡大表示
  eventImageWrapper?.addEventListener('click', () => {
    const img = eventImageWrapper.querySelector('.event-image') as HTMLImageElement;
    if (img && modal && modalImage) {
      modalImage.src = img.src;
      modalImage.alt = img.alt;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      modalClose?.focus();
    }
  });

  // Enterキーでも拡大表示
  eventImageWrapper?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      eventImageWrapper.click();
    }
  });

  // モーダルを閉じる
  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      eventImageWrapper?.focus();
    }
  };

  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);

  // ESCキーでモーダルを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });
}