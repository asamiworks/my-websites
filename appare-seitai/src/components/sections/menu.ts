// 施術メニューセクションコンポーネント
export function initMenu(): void {
  const menuEl = document.getElementById('menu');
  if (!menuEl) return;


  menuEl.innerHTML = `
    <div class="container">
      <h2 class="section-title">施術メニュー</h2>

      <div class="menu-grid">
        <!-- 背骨・骨盤矯正セット -->
        <div class="menu-card menu-card--popular">
          <div class="menu-card-badge">1番人気</div>
          <h3 class="menu-card-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            背骨・骨盤矯正セット
          </h3>
          <div class="menu-card-items">
            <div class="menu-item">
              <span class="menu-item-name">45分＋矯正</span>
              <span class="menu-item-price">¥4,500</span>
            </div>
            <div class="menu-item">
              <span class="menu-item-name">60分＋矯正</span>
              <span class="menu-item-price">¥5,800</span>
            </div>
          </div>
        </div>

        <!-- 全身ほぐし -->
        <div class="menu-card">
          <h3 class="menu-card-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            全身ほぐし
          </h3>
          <div class="menu-card-items">
            <div class="menu-item">
              <span class="menu-item-name">45分</span>
              <span class="menu-item-price">¥4,000</span>
            </div>
            <div class="menu-item">
              <span class="menu-item-name">60分</span>
              <span class="menu-item-price">¥4,800</span>
            </div>
          </div>
        </div>

        <!-- 産後骨盤矯正 -->
        <div class="menu-card menu-card--special">
          <h3 class="menu-card-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            産後骨盤矯正
          </h3>
          <p class="menu-card-note">産後2ヶ月〜9ヶ月がオススメ</p>
          <div class="menu-card-items">
            <div class="menu-item">
              <span class="menu-item-name">産後骨盤矯正</span>
              <span class="menu-item-price">¥4,000</span>
            </div>
            <div class="menu-item">
              <span class="menu-item-name">子どもお預かり</span>
              <span class="menu-item-price">+¥1,000</span>
            </div>
          </div>
        </div>

        <!-- 割引コース -->
        <div class="menu-card">
          <h3 class="menu-card-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            割引コース
          </h3>
          <p class="menu-card-note">30〜40分</p>
          <div class="menu-card-items">
            <div class="menu-item">
              <span class="menu-item-name">小中高生</span>
              <span class="menu-item-price">¥3,000</span>
            </div>
            <div class="menu-item">
              <span class="menu-item-name">シニア（70歳以上）</span>
              <span class="menu-item-price">¥3,500</span>
            </div>
          </div>
        </div>

        <!-- リンパ整体 -->
        <div class="menu-card">
          <h3 class="menu-card-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 2v20M14 2v20M4 7h16M4 17h16"/>
            </svg>
            リンパ整体
          </h3>
          <div class="menu-card-items">
            <div class="menu-item">
              <span class="menu-item-name">45分</span>
              <span class="menu-item-price">¥4,500</span>
            </div>
            <div class="menu-item">
              <span class="menu-item-name">60分</span>
              <span class="menu-item-price">¥6,000</span>
            </div>
            <div class="menu-item">
              <span class="menu-item-name">90分</span>
              <span class="menu-item-price">¥8,500</span>
            </div>
            <div class="menu-item">
              <span class="menu-item-name">120分</span>
              <span class="menu-item-price">¥11,000</span>
            </div>
          </div>
        </div>

        <!-- ヘッド整顔 -->
        <div class="menu-card menu-card--highlight">
          <h3 class="menu-card-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            ヘッド整顔
          </h3>
          <div class="menu-card-items">
            <div class="menu-item">
              <span class="menu-item-name">ヘッドのみ（30分）</span>
              <span class="menu-item-price">¥3,500</span>
            </div>
            <div class="menu-item">
              <span class="menu-item-name">ほぐし30分＋ヘッド</span>
              <span class="menu-item-price">¥6,000</span>
            </div>
            <div class="menu-item">
              <span class="menu-item-name">ほぐし30分＋ヘッド<br>＋全身矯正</span>
              <span class="menu-item-price">¥7,200</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 注意事項 -->
      <div class="menu-notes">
        <h3>ご予約・ご利用について</h3>
        <ul>
          <li>すべての施術は完全予約制となっております</li>
          <li>料金は税込表示です</li>
          <li>施術時間には、カウンセリング・お着替えの時間は含まれません</li>
          <li>キャンセルは前日までにご連絡ください</li>
        </ul>
      </div>

        
      </div>
    </div>
  `;
}