import styles from './SafetySection.module.css';

const SafetySection = () => {
  const safetyFeatures = [
    {
      title: '防犯カメラ設置',
      description: '24時間録画で安心の環境',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="6" width="18" height="15" rx="2"/>
          <circle cx="12" cy="13" r="3"/>
          <circle cx="18" cy="10" r="1"/>
          <path d="M5 6V4a2 2 0 012-2h10a2 2 0 012 2v2"/>
        </svg>
      )
    },
    {
      title: '整備された環境',
      description: '定期的な清掃・メンテナンス',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      )
    },
    {
      title: '広々とした敷地',
      description: '安全に走行できる十分なスペース',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 12h18"/>
          <path d="M12 3v18"/>
          <path d="M3 3l18 18"/>
          <path d="M21 3L3 21"/>
        </svg>
      )
    },
    {
      title: '夜間照明完備',
      description: '暗い時間でも安心して利用可能',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      )
    }
  ];

  const rules = [
    '利用者同士の事故・トラブルは当事者間で解決してください',
    'コース外での走行は禁止です',
    '飲酒後の利用はご遠慮ください',
    'ゴミは必ずお持ち帰りください',
    '施設・設備を破損した場合は弁償していただきます',
    '天候により利用を制限する場合があります'
  ];

  return (
    <section className={styles.safetySection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>安心・安全への取り組み</h2>
          <p className={styles.subtitle}>
            すべての方が楽しく利用できる環境づくりを心がけています
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {safetyFeatures.map((feature, index) => (
            <div 
              key={index}
              className={styles.featureCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.divider}></div>

        <div className={styles.rulesSection}>
          <h3 className={styles.rulesTitle}>ご利用規約・注意事項</h3>
          <div className={styles.rulesGrid}>
            {rules.map((rule, index) => (
              <div key={index} className={styles.ruleItem}>
                <div className={styles.ruleNumber}>{(index + 1).toString().padStart(2, '0')}</div>
                <p>{rule}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.emergencyBox}>
          <div className={styles.emergencyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <div className={styles.emergencyInfo}>
            <h4>緊急時の連絡先</h4>
            <p>事故・トラブル発生時は速やかにご連絡ください</p>
            <p className={styles.phoneNumber}>XXX-XXXX-XXXX</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetySection;