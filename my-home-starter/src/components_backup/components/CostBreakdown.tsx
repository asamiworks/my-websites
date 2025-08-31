import React from 'react';
import styles from './CostBreakdown.module.css';

const CostBreakdown = () => {
  const totalBudget = 3500; // 万円
  
  const mainCosts = [
    { category: "建築工事費", amount: 2450, percentage: 70, colorClass: styles.colorMain },
    { category: "諸費用", amount: 350, percentage: 10, colorClass: styles.colorSub1 },
    { category: "外構工事費", amount: 280, percentage: 8, colorClass: styles.colorSub2 },
    { category: "予備費", amount: 420, percentage: 12, colorClass: styles.colorSub3 }
  ];
  
  const detailCosts = {
    "建築工事費": [
      { item: "本体工事費", amount: "2,100万円", description: "基礎・構造・内外装工事" },
      { item: "付帯工事費", amount: "350万円", description: "電気・ガス・給排水工事" }
    ],
    "諸費用": [
      { item: "登記費用", amount: "30万円", description: "所有権保存・抵当権設定" },
      { item: "ローン手数料", amount: "80万円", description: "保証料・事務手数料" },
      { item: "火災保険", amount: "40万円", description: "10年一括払いの場合" },
      { item: "引越し費用", amount: "30万円", description: "仮住まい費用含む" },
      { item: "その他", amount: "170万円", description: "地鎮祭・家具家電など" }
    ],
    "外構工事費": [
      { item: "駐車場", amount: "100万円", description: "カーポート2台分" },
      { item: "アプローチ", amount: "80万円", description: "門扉・塀・植栽" },
      { item: "庭", amount: "100万円", description: "ウッドデッキ・照明" }
    ]
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            家づくりの費用内訳を完全解説
          </h2>
          <p className={styles.subtitle}>
            総予算3,500万円の場合の内訳例。見落としがちな諸費用まで詳しく解説します。
          </p>
        </div>
        
        {/* 円グラフ風の表示 */}
        <div className={styles.chartSection}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              予算配分の目安（総額: {totalBudget.toLocaleString()}万円）
            </h3>
            
            {/* プログレスバー形式 */}
            <div className={styles.progressContainer}>
              {mainCosts.map((cost, index) => (
                <div key={index} className={styles.progressItem}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>{cost.category}</span>
                    <span className={styles.progressAmount}>
                      {cost.amount.toLocaleString()}万円（{cost.percentage}%）
                    </span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div
                      className={`${styles.progressBar} ${cost.colorClass}`}
                      style={{ width: `${cost.percentage}%` }}
                    >
                      <span className={styles.progressPercentage}>
                        {cost.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 詳細内訳 */}
        <div className={styles.detailGrid}>
          {Object.entries(detailCosts).map(([category, items]) => (
            <div key={category} className={styles.detailCard}>
              <h4 className={styles.detailTitle}>
                {category}の内訳
              </h4>
              <div className={styles.detailList}>
                {items.map((item, index) => (
                  <div key={index} className={styles.detailItem}>
                    <div className={styles.detailHeader}>
                      <span className={styles.detailItemName}>{item.item}</span>
                      <span className={styles.detailItemAmount}>
                        {item.amount}
                      </span>
                    </div>
                    <p className={styles.detailDescription}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* 注意事項 */}
        <div className={styles.cautionSection}>
          <h4 className={styles.cautionTitle}>予算オーバーを防ぐポイント</h4>
          <ul className={styles.cautionList}>
            <li className={styles.cautionItem}>
              <span className={styles.cautionNumber}>1.</span>
              建築費は総予算の70%以内に抑える（土地代含む場合は50%）
            </li>
            <li className={styles.cautionItem}>
              <span className={styles.cautionNumber}>2.</span>
              諸費用として最低でも建築費の10〜15%を確保する
            </li>
            <li className={styles.cautionItem}>
              <span className={styles.cautionNumber}>3.</span>
              予備費として総予算の10%以上を必ず確保する
            </li>
            <li className={styles.cautionItem}>
              <span className={styles.cautionNumber}>4.</span>
              オプション追加は予算内で優先順位をつけて検討する
            </li>
          </ul>
        </div>
        
        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>
            あなたの予算に合わせた詳細な資金計画を無料で作成します
          </p>
          <a
            href="/start-home-building"
            className={styles.ctaButton}
          >
            無料で資金計画を立てる
          </a>
        </div>
      </div>
    </section>
  );
};

export default CostBreakdown;