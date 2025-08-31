// 当院についてセクションコンポーネント

interface Feature {
    icon: string;
    title: string;
    description: string;
  }
  
  export function initAbout(): void {
    const aboutEl = document.getElementById('about');
    if (!aboutEl) return;
  
    // 当院の特徴
    const features: Feature[] = [
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>`,
        title: '確かな技術と経験',
        description: 'お一人おひとりに合わせた最適な施術を提供します。'
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>`,
        title: '心のこもった対応',
        description: '心身ともにリラックスできる空間を提供します。'
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>`,
        title: '明るく清潔な院内',
        description: 'ゆったりとした時間をお過ごしいただけます。'
      }
    ];
  
    aboutEl.innerHTML = `
      <div class="container">
        <h2 class="section-title">当院について</h2>
        
        <div class="about-intro">
          <div class="intro-content">
            <h3 class="intro-title">
              <span class="intro-subtitle">龍ケ崎市白羽の整体院</span>
              <span class="intro-main">天晴れ整体院へようこそ</span>
            </h3>
            <p class="intro-text">
             天晴れ整体院は、地域の皆様の健康をサポートする整体院です。<br>
              肩こり、腰痛、骨盤の歪みなど、様々な身体の不調に対して、<br>
              根本的な原因からアプローチし、健康な身体づくりをお手伝いいたします。
            </p>
            
          </div>
        </div>
        
        <div class="about-features">
          <h3 class="features-title">当院の特徴</h3>
          <div class="features-grid">
            ${features.map((feature, index) => `
              <div class="feature-card" style="animation-delay: ${index * 0.1}s">
                <div class="feature-icon">
                  ${feature.icon}
                </div>
                <h4 class="feature-title">${feature.title}</h4>
                <p class="feature-description">${feature.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  
    // アニメーションの設定
    setupAnimations();
  }
  
  function setupAnimations(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
  
    // アニメーション対象要素を監視
    const animateElements = document.querySelectorAll('.feature-card');
    animateElements.forEach((el) => observer.observe(el));
  }