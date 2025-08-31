/**
 * 院長紹介セクションコンポーネント
 */

export function createDirectorSection(): string {
  return `
    <section id="director" class="director" itemscope itemtype="https://schema.org/Person">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">院長紹介</h2>
        </div>

        <div class="director__content">
          <!-- プロフィールグリッド -->
          <div class="director__grid">
            <!-- 写真エリア -->
            <div class="director__image">
              <img 
                src="/images/director/director-main.jpg" 
                alt="天晴れ整体院 院長 岩崎智英（いわさきともひで）" 
                title="岩崎智英院長"
                loading="lazy"
                itemprop="image"
              >
              <div class="director__image-decoration"></div>
            </div>
            
            <!-- 基本情報エリア -->
            <div class="director__info">
              <div class="director__header">
                <p class="director__name-label">名前</p>
                <h3 class="director__name" itemprop="name">
                  <ruby>岩崎<rt>いわさき</rt></ruby> 
                  <ruby>智英<rt>ともひで</rt></ruby>
                </h3>
                <meta itemprop="alternateName" content="いわさきともひで">
                <meta itemprop="alternateName" content="Iwasaki Tomohide">
                <meta itemprop="jobTitle" content="院長">
                <meta itemprop="worksFor" content="天晴れ整体院">
                <p class="director__nickname">call me: 院長先生、とも先生</p>
              </div>

              <dl class="director__details">
                <div class="director__detail">
                  <dt>担当</dt>
                  <dd>ほぐし・矯正</dd>
                </div>
                <div class="director__detail">
                  <dt>趣味</dt>
                  <dd>犬と遊ぶ<br>車 🚗</dd>
                </div>
                <div class="director__detail">
                  <dt>得意なこと</dt>
                  <dd>観察力がある<br>野球</dd>
                </div>
              </dl>

              <!-- メッセージ -->
              <div class="director__message" itemprop="description">
                <p>小学生、中学生の時は野球⚾をやってました。</p>
                <p>専門学校の時は、柔道🥋をやってました。</p>
                <p>緊張しないタイプなので、誰とでもすぐうちとけます。</p>
                <p>気軽に話しかけて下さい。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * 院長紹介セクションの初期化
 */
export function initDirectorSection(): void {
  // アニメーション用のIntersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  // 画像のパララックス効果
  const directorImage = document.querySelector('.director__image img') as HTMLImageElement;
  if (directorImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rect = directorImage.getBoundingClientRect();
      const speed = 0.5;
      
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = -(scrolled * speed);
        directorImage.style.transform = `translateY(${yPos}px)`;
      }
    });
  }
}