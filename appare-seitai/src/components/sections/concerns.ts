// こんなお悩みありませんかセクションコンポーネント

interface ConcernItem {
    icon: string;
    title: string;
    description: string;
  }
  
  export function initConcerns(): void {
    const concernsEl = document.getElementById('concerns');
    if (!concernsEl) return;
  
    // お悩みリスト
    const concerns: ConcernItem[] = [
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
          <path d="M12 14v7"/>
        </svg>`,
        title: '慢性的な肩こり・首こり',
        description: 'デスクワークやスマホの使いすぎで、肩や首が常に重だるい'
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 11H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5"/>
          <path d="M15 11h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-5"/>
          <path d="M9 11V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v5"/>
          <rect x="9" y="11" width="6" height="10" rx="2"/>
        </svg>`,
        title: '腰痛・ぎっくり腰',
        description: '長時間の座り仕事や重い物を持つ作業で腰に負担がかかっている'
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M16 8l-4 4-4-4"/>
          <path d="M12 12v6"/>
        </svg>`,
        title: '骨盤の歪み・姿勢の悪さ',
        description: '姿勢が悪く、体のバランスが崩れている気がする'
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>`,
        title: '頭痛・眼精疲労',
        description: '頻繁に頭痛がしたり、目の奥が重く感じる'
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>`,
        title: '産後の体型変化',
        description: '出産後、骨盤が開いたままで体型が戻らない'
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>`,
        title: '疲れが取れない',
        description: '寝ても疲れが取れず、常に体がだるい'
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 2v20M14 2v20M4 7h16M4 17h16"/>
        </svg>`,
        title: 'むくみ・冷え性',
        description: '手足が冷えやすく、むくみがなかなか取れない'
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>`,
        title: '自律神経の乱れ',
        description: 'ストレスで体調を崩しやすく、不眠や動悸がある'
      }
    ];
  
    concernsEl.innerHTML = `
      <div class="container">
        <h2 class="section-title">こんなお悩みありませんか？</h2>
        
        <div class="concerns-grid">
          ${concerns.map(concern => `
            <div class="concern-card">
              <div class="concern-icon">
                ${concern.icon}
              </div>
              <h3 class="concern-title">${concern.title}</h3>
              <p class="concern-description">${concern.description}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="concerns-message">
          <div class="message-content">
            <h3>一つでも当てはまる方は、ぜひご相談ください</h3>
            <p>天晴れ整体院では、お一人おひとりの症状に合わせた施術を行います。<br>
            痛みの原因を根本から改善し、健康な身体づくりをサポートいたします。</p>
            <div class="message-actions">
              <a href="#menu" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 11H3v10h6M9 3v18M21 11h-6v10h6M21 3v18"/>
                </svg>
                施術メニューを見る
              </a>
              <a href="#cta" class="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                予約・お問い合わせ
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  
    // スムーススクロールの設定
    initSmoothScroll();
  }
  
  function initSmoothScroll(): void {
    const links = document.querySelectorAll('.concerns-message a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        const targetElement = targetId ? document.getElementById(targetId) : null;
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }