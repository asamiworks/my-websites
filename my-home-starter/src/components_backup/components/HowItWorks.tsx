import React from 'react';
import styles from './HowItWorks.module.css';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "無料診断",
      description: "簡単な質問に答えるだけで、あなたの理想の家づくり計画がわかります。"
    },
    {
      number: "02",
      title: "結果確認",
      description: "診断結果をもとに、予算計画や注意すべきポイントをご提示します。"
    },
    {
      number: "03",
      title: "コンシェルジュサポート",
      description: "専門スタッフがチャットで疑問や不安にお答えします。"
    },
    {
      number: "04",
      title: "家づくりスタート",
      description: "アドバイスをもとに、失敗しない家づくりを始めましょう。"
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            かんたん4ステップ
          </h2>
          <p className={styles.subtitle}>
            登録から住宅会社とのマッチングまで、すべてオンラインで完結します。
          </p>
        </div>
        
        <div className={styles.stepsWrapper}>
          {/* 接続線（デスクトップのみ） */}
          <div className={styles.connectionLine}></div>
          
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <div key={index} className={styles.stepItem}>
                <div className={styles.stepCircle}>
                  <span className={styles.stepNumber}>{step.number}</span>
                </div>
                <div className={styles.stepLabel}>
                  STEP {step.number}
                </div>
                <h3 className={styles.stepTitle}>
                  {step.title}
                </h3>
                <p className={styles.stepDescription}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.ctaSection}>
          <a
            href="/start-home-building"
            className={styles.ctaButton}
          >
            無料診断を始める
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;