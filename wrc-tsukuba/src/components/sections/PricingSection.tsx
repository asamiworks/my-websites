import styles from './PricingSection.module.css';

const PricingSection = () => {
  // 金額は後で編集可能
  const pricingPlans = [

    
    {
      duration: '1時間',
      price: '¥---',
      recommended: false,
      color: 'purple'
    },
    {
      duration: '2時間',
      price: '¥---',
      recommended: false,
      color: 'pink'
    },
    {
      duration: '1日',
      price: '¥---',
      recommended: true,
      color: 'orange'
    }
  ];

  return (
    <section id="pricing" className={styles.pricingSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>料金プラン</h2>
          
        </div>

        <div className={styles.pricingGrid}>
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`${styles.pricingCard} ${styles[plan.color]} ${
                plan.recommended ? styles.recommended : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.recommended && (
                <div className={styles.badge}>おすすめ</div>
              )}
              <div className={styles.duration}>{plan.duration}</div>
              <div className={styles.price}>{plan.price}</div>
            </div>
          ))}
        </div>

        <div className={styles.paymentInfo}>
          <div className={styles.paymentCard}>
            <div className={styles.paymentIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <path d="M2 10h20"/>
                <path d="M7 15h2"/>
                <path d="M12 15h5"/>
              </svg>
            </div>
            <h3>お支払い方法</h3>
            <p>現金のみの取り扱いとなります</p>
            <p className={styles.caution}>※ お釣りは出ませんのでご注意ください</p>
          </div>

          <div className={styles.paymentCard}>
            <div className={styles.paymentIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <h3>料金箱について</h3>
            <p>入口に設置された料金箱にお支払いください</p>
            <p className={styles.caution}>※ 防犯カメラで管理しています</p>
          </div>
        </div>

        <div className={styles.notes}>
          <h3>ご利用にあたって</h3>
          <ul>
            <li>料金は利用開始前にお支払いください</li>
            <li>時間延長の場合は追加料金をお支払いください</li>
            <li>団体割引等はございません</li>
            <li>料金は予告なく変更される場合があります</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;