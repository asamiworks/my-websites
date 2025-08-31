import React from 'react';
import styles from './MistakesSection.module.css';

const MistakesSection = () => {
  const mistakes = [
    {
      title: "予算オーバー",
      percentage: "67%",
      description: "当初予算を平均23%超過",
      causes: [
        "建築費以外の諸費用を見落とし",
        "オプション追加による費用増加",
        "土地の地盤改良費の想定外"
      ],
      solution: "資金計画シミュレーターで総費用を事前に把握"
    },
    {
      title: "間取りの後悔",
      percentage: "54%",
      description: "住み始めてから不便を感じる",
      causes: [
        "生活動線を考慮していない設計",
        "収納スペースの不足",
        "将来の家族構成変化を想定せず"
      ],
      solution: "3D間取りシミュレーションで事前に生活をイメージ"
    },
    {
      title: "住宅会社選びの失敗",
      percentage: "41%",
      description: "期待と実際のギャップ",
      causes: [
        "1社だけで決めてしまった",
        "価格だけで選んでしまった",
        "実績や評判を確認しなかった"
      ],
      solution: "複数社を比較検討し、実績と相性を確認"
    }
  ];

  return (
    <section id="mistakes-section" className={styles.mistakesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            家づくりでよくある失敗TOP3
          </h2>
          <p className={styles.subtitle}>
            国土交通省の調査によると、注文住宅を建てた方の約7割が何らかの後悔を抱えています。
            <br />
            これらの失敗は、事前の準備と適切なサポートで防ぐことができます。
          </p>
        </div>
        
        <div className={styles.mistakesGrid}>
          {mistakes.map((mistake, index) => (
            <div key={index} className={styles.mistakeCard}>
              <div className={styles.mistakeHeader}>
                <h3 className={styles.mistakeTitle}>{mistake.title}</h3>
                <span className={styles.mistakePercentage}>{mistake.percentage}</span>
              </div>
              
              <p className={styles.mistakeDescription}>{mistake.description}</p>
              
              <div className={styles.causesSection}>
                <h4 className={styles.causesTitle}>主な原因：</h4>
                <ul className={styles.causesList}>
                  {mistake.causes.map((cause, idx) => (
                    <li key={idx} className={styles.causeItem}>
                      <span className={styles.causeBullet}>•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.solutionSection}>
                <h4 className={styles.solutionTitle}>解決策：</h4>
                <p className={styles.solutionText}>{mistake.solution}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>
            マイホームスターターなら、これらの失敗を防ぐための
            <span className={styles.ctaHighlight}>完全無料</span>
            のサポートが受けられます
          </p>
          <a
            href="/start-home-building"
            className={styles.ctaButton}
          >
            失敗しない家づくりを始める
          </a>
        </div>
      </div>
    </section>
  );
};

export default MistakesSection;