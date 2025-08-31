// CTAセクションコンポーネント
import siteConfig from '../../data/site-config.json';

export function initCTA(): void {
  const ctaEl = document.getElementById('cta');
  if (!ctaEl) return;

  ctaEl.innerHTML = `
    <div class="container">
      <div class="cta-content">
        <h2 class="cta-title">ご予約・お問い合わせ</h2>
        <p class="cta-subtitle">お気軽にご連絡ください</p>
        
        <div class="cta-buttons">
          <!-- LINE予約 -->
          <a href="${siteConfig.contact.lineUrl}" target="_blank" rel="noopener noreferrer" class="cta-button cta-line">
            <div class="cta-button-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.348 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
            </div>
            <div class="cta-button-content">
              <span class="cta-button-label">LINEで予約</span>
              <span class="cta-button-info">${siteConfig.contact.lineId}</span>
            </div>
          </a>
          
          <!-- Instagram -->
          <a href="${siteConfig.contact.instagramUrl}" target="_blank" rel="noopener noreferrer" class="cta-button cta-instagram">
            <div class="cta-button-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <div class="cta-button-content">
              <span class="cta-button-label">Instagram</span>
              <span class="cta-button-info">${siteConfig.contact.instagramId}</span>
            </div>
          </a>
          
          <!-- 電話予約 -->
          <a href="tel:${siteConfig.contact.tel}" class="cta-button cta-phone">
            <div class="cta-button-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div class="cta-button-content">
              <span class="cta-button-label">電話で予約</span>
              <span class="cta-button-info">${siteConfig.contact.telDisplay}</span>
            </div>
          </a>
        </div>
        
        <div class="cta-badge">
          <span class="cta-badge-icon">✓</span>
          完全予約制なので待ち時間なし！
        </div>
      </div>
    </div>
  `;
}