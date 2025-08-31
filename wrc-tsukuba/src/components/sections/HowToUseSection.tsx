import styles from './HowToUseSection.module.css';

const HowToUseSection = () => {
  const steps = [
    {
      number: '01',
      title: '来場',
      description: '予約不要！好きな時間に来てください',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 10c0 7-7 13-7 13s-7-6-7-13a7 7 0 1114 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      )
    },
    {
      number: '02',
      title: '料金支払い',
      description: '入口の料金箱に現金を入れてください',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="7" width="18" height="10" rx="2"/>
          <path d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      )
    },
    {
      number: '03',
      title: '準備',
      description: 'ラジコンをセットアップして準備完了',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="11" width="14" height="8" rx="2"/>
          <path d="M7 11V9a2 2 0 012-2h6a2 2 0 012 2v2"/>
          <circle cx="9" cy="15" r="1"/>
          <circle cx="15" cy="15" r="1"/>
        </svg>
      )
    },
    {
      number: '04',
      title: '楽しむ！',
      description: '思う存分ラジコンを楽しもう！',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 17h14l-1.5-8.5a1 1 0 00-1-.5h-9a1 1 0 00-1 .5L5 17z"/>
          <circle cx="7" cy="19" r="2"/>
          <circle cx="17" cy="19" r="2"/>
          <path d="M12 6v3"/>
        </svg>
      )
    }
  ];

  return (
    <section id="how-to-use" className={styles.howToUseSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>かんたん利用ガイド</h2>
          <p className={styles.subtitle}>
            無人受付だから、いつでも気軽に利用できます
          </p>
        </div>

        <div className={styles.stepsWrapper}>
          <div className={styles.stepsContainer}>
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={styles.step}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.iconWrapper}>
                  {step.icon}
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
                {index < steps.length - 1 && (
                  <div className={styles.connector}>
                    <svg viewBox="0 0 40 20" fill="none">
                      <path 
                        d="M0 10 L30 10 M30 10 L25 5 M30 10 L25 15" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h4>営業時間</h4>
            <p>朝から夕方まで<br/>詳細はお問い合わせください</p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
                <line x1="12" y1="17" x2="12" y2="19"/>
              </svg>
            </div>
            <h4>お支払い</h4>
            <p>現金のみの対応となります</p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="6" width="18" height="15" rx="2"/>
                <circle cx="12" cy="13" r="3"/>
                <circle cx="18" cy="10" r="1"/>
              </svg>
            </div>
            <h4>安心・安全</h4>
            <p>防犯カメラ設置<br/>安心して利用可能</p>
          </div>
        </div>

        <div className={styles.notice}>
          <h3>ご利用時のお願い</h3>
          <div className={styles.noticeGrid}>
            <div className={styles.noticeItem}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p>ゴミは各自お持ち帰りください</p>
            </div>
            <div className={styles.noticeItem}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p>他の利用者への配慮をお願いします</p>
            </div>
            <div className={styles.noticeItem}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p>事故・怪我は自己責任となります</p>
            </div>
            <div className={styles.noticeItem}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p>マナーを守って楽しく利用しましょう</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToUseSection;