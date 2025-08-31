// FAQセクションコンポーネント
import siteConfig from '../../data/site-config.json';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: '施術時間はどのくらいですか？',
    answer: '施術時間は30分から120分まで、お客様の症状やご希望に合わせて選べます。初回の方は、カウンセリングを含めて60分程度をおすすめしています。'
  },
  {
    question: '予約は必要ですか？',
    answer: `当院は完全予約制となっております。お電話（${siteConfig.contact.telDisplay}）またはLINE（${siteConfig.contact.lineId}）でご予約ください。`
  },
  {
    question: '駐車場はありますか？',
    answer: 'はい、無料駐車場を完備しております。お車でも安心してご来院ください。'
  },
  {
    question: '産後骨盤矯正はいつから受けられますか？',
    answer: '産後2ヶ月から9ヶ月までの方を対象としております。産後の体調が安定してからお越しください。'
  },
  
  {
    question: '施術は痛いですか？',
    answer: '当院では、お客様の体調や症状に合わせて施術を行います。痛みを伴わない優しい施術を心がけていますので、ご安心ください。'
  },
  {
    question: '支払い方法は何がありますか？',
    answer: `現金またはクレジットカードのお支払いに対応しています。`
  }
];

export function initFAQ(): void {
  const faqEl = document.getElementById('faq');
  if (!faqEl) return;

  faqEl.innerHTML = `
    <div class="container">
      <div class="faq-header">
        <h2 class="section-title">よくあるご質問</h2>
        <p class="section-subtitle">お客様からよくいただくご質問をまとめました</p>
      </div>
      
      <div class="faq-list">
        ${faqItems.map((item, index) => `
          <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${index}">
              <span itemprop="name">${item.question}</span>
              <svg class="faq-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div id="faq-answer-${index}" class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
              <div class="faq-answer-content" itemprop="text">
                ${item.answer}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="faq-cta">
        <p class="faq-cta-text">その他のご質問はお気軽にお問い合わせください</p>
        <div class="faq-cta-buttons">
          <a href="tel:${siteConfig.contact.tel}" class="button button-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            電話で問い合わせ
          </a>
          <a href="${siteConfig.contact.lineUrl}" target="_blank" rel="noopener noreferrer" class="button button-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 5.28 2 9.64c0 3.49 2.83 6.44 6.72 7.47-.03.13-.09.4-.11.48-.03.16-.11.62-.11.77 0 .23.11.43.31.51.16.07.35.03.47-.05.09-.05 1.17-1.07 1.71-1.57.93.13 1.88.2 2.83.2 5.52 0 10-3.08 10-6.81C22 5.28 17.52 2 12 2zm-3.61 10.03h-2.6c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.48h2.2c.22 0 .4.18.4.4s-.18.41-.4.41zm2.24 0c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .22-.18.4-.4.4zm4.45 0c-.16 0-.31-.1-.37-.25l-1.68-2.85v2.7c0 .22-.18.4-.4.4s-.4-.18-.4-.4V8.74c0-.18.12-.34.29-.38.17-.05.35.02.43.17l1.76 2.96V8.74c0-.22.18-.4.4-.4s.4.18.4.4v2.89c0 .18-.12.34-.29.38-.05.02-.1.02-.14.02zm3.43-2.06c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.48h1.62c.22 0 .4.18.4.4s-.18.4-.4.4h-2.02c-.22 0-.4-.18-.4-.4V8.74c0-.22.18-.4.4-.4h2.02c.22 0 .4.18.4.4s-.18.4-.4.4h-1.62v.43h1.62z"/>
            </svg>
            LINEで問い合わせ
          </a>
        </div>
      </div>
    </div>
  `;

  // アコーディオン機能の実装
  setupFAQAccordion();
}

function setupFAQAccordion(): void {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question') as HTMLButtonElement;
    const answer = item.querySelector('.faq-answer') as HTMLElement;
    
    if (!button || !answer) return;
    
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      // 他のFAQを閉じる（オプション：同時に1つだけ開く場合）
      // faqItems.forEach(otherItem => {
      //   const otherButton = otherItem.querySelector('.faq-question') as HTMLButtonElement;
      //   const otherAnswer = otherItem.querySelector('.faq-answer') as HTMLElement;
      //   if (otherButton && otherAnswer && otherButton !== button) {
      //     otherButton.setAttribute('aria-expanded', 'false');
      //     otherAnswer.classList.remove('active');
      //   }
      // });
      
      // 現在のFAQをトグル
      button.setAttribute('aria-expanded', (!isExpanded).toString());
      answer.classList.toggle('active');
      
      // アイコンの回転
      const icon = button.querySelector('.faq-icon');
      if (icon) {
        icon.classList.toggle('rotate');
      }
    });
  });
}