// アクセスセクションコンポーネント
import siteConfig from '../../data/site-config.json';

export function initAccess(): void {
  const accessEl = document.getElementById('access');
  if (!accessEl) return;

  accessEl.innerHTML = `
    <div class="container">
      <h2 class="section-title">アクセス</h2>
      
      <div class="access-content">
        <!-- 左側：店舗情報 -->
        <div class="access-info">
          <div class="access-section">
            <h3>営業時間</h3>
            <div class="access-hours">
              <div class="hours-row">
                <span class="hours-day">月・火・木・金・土</span>
                <span class="hours-time">9:00〜12:00 / 14:00〜20:00</span>
              </div>
              <div class="hours-row">
                <span class="hours-day">定休日</span>
                <span class="hours-time">水曜日・日曜日・祝日</span>
              </div>
              <p class="access-note">※完全予約制となっております</p>
            </div>
          </div>
          
          <div class="access-section">
            <h3>住所</h3>
            <address class="access-address">
              〒${siteConfig.business.address.postalCode}<br>
              ${siteConfig.business.address.addressRegion}${siteConfig.business.address.addressLocality}${siteConfig.business.address.streetAddress}
            </address>
          </div>
         
          <div class="access-section">
            <h3>駐車場</h3>
            <p>お車でお越しの方は、店舗前の駐車場をご利用ください。</p>
          </div>
        </div>
        
        <!-- 右側：地図 -->
        <div class="access-map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9138.260705133916!2d140.2132600709475!3d35.925848610064456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60226597c47ea549%3A0xd29b05ac2c2b67b4!2z5aSp5pm044KM5pW05L2T6Zmi!5e0!3m2!1sja!2sjp!4v1753424792711!5m2!1sja!2sjp" 
            width="100%" 
            height="100%" 
            style="border:0; border-radius: var(--radius-lg);" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
            title="天晴れ整体院の地図">
          </iframe>
        </div>
      </div>
    </div>
    
    <!-- セクション間の余白 -->
    <div class="access-spacer"></div>
  `;
}