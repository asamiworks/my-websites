import React from 'react';
import styles from './CompanyComparisonGuide.module.css';

const CompanyComparisonGuide = () => {
  const companyTypes = [
    {
      type: "大手ハウスメーカー",
      priceRange: "2,500〜4,000万円",
      characteristics: {
        pros: [
          "全国展開で実績豊富",
          "品質が安定している",
          "アフターサービス充実",
          "最新技術・設備が標準",
          "施工期間が比較的短い"
        ],
        cons: [
          "価格が高め",
          "設計の自由度が低い",
          "営業が積極的すぎる場合も"
        ]
      },
      bestFor: "安心感を重視し、予算に余裕がある方",
      examples: ["全国展開の大手企業", "TVCMでよく見る会社"]
    },
    {
      type: "中堅ビルダー",
      priceRange: "2,000〜3,000万円",
      characteristics: {
        pros: [
          "コストパフォーマンスが良い",
          "地域特性を理解している",
          "柔軟な対応が可能",
          "適度な規模で安心感"
        ],
        cons: [
          "エリアが限定的",
          "最新技術は別途費用",
          "デザイン力にばらつき"
        ]
      },
      bestFor: "バランスを重視する方",
      examples: ["地域の有力工務店", "フランチャイズ系"]
    },
    {
      type: "ローコストメーカー",
      priceRange: "1,500〜2,500万円",
      characteristics: {
        pros: [
          "価格が安い",
          "工期が短い",
          "シンプルで分かりやすい",
          "若い世代でも手が届く"
        ],
        cons: [
          "設備・仕様がシンプル",
          "カスタマイズが限定的",
          "断熱材は基本グレード（ただし建物形状がシンプルなため性能値は悪くない）"
        ]
      },
      bestFor: "予算を抑えたい方、シンプルな暮らしを好む方",
      examples: ["価格重視の住宅会社", "規格住宅が中心の会社"]
    }
  ];

  const comparisonPoints = [
    { point: "実績・施工棟数", description: "年間施工棟数と累計実績を確認" },
    { point: "保証・アフターサービス", description: "保証期間と定期点検の内容" },
    { point: "標準仕様のグレード", description: "キッチン・風呂・断熱材の標準仕様" },
    { point: "設計の自由度", description: "間取り変更の柔軟性" },
    { point: "営業担当者との相性", description: "レスポンスの速さと提案力" },
    { point: "現場の品質管理", description: "建築現場の整理整頓状況を確認（特に現場トイレの清潔さに注目）" }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            住宅会社の選び方完全ガイド
          </h2>
          <p className={styles.subtitle}>
            価格だけでなく、あなたの価値観に合った住宅会社選びが成功の鍵です
          </p>
        </div>
        
        {/* 会社タイプ別比較 */}
        <div className={styles.comparisonSection}>
          <h3 className={styles.sectionTitle}>
            住宅会社のタイプ別特徴
          </h3>
          
          <div className={styles.companyGrid}>
            {companyTypes.map((company, index) => (
              <div key={index} className={styles.companyCard}>
                <h4 className={styles.companyType}>{company.type}</h4>
                <p className={styles.priceRange}>予算目安: {company.priceRange}</p>
                
                <div className={styles.characteristics}>
                  <h5 className={styles.prosTitle}>メリット</h5>
                  <ul className={styles.prosList}>
                    {company.characteristics.pros.map((pro, idx) => (
                      <li key={idx} className={styles.prosItem}>
                        <span className={styles.prosIcon}>✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={styles.characteristics}>
                  <h5 className={styles.consTitle}>デメリット</h5>
                  <ul className={styles.consList}>
                    {company.characteristics.cons.map((con, idx) => (
                      <li key={idx} className={styles.consItem}>
                        <span className={styles.consIcon}>-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={styles.recommendation}>
                  <p className={styles.recommendationTitle}>おすすめの方</p>
                  <p className={styles.recommendationText}>{company.bestFor}</p>
                  <div className={styles.examples}>
                    {company.examples.map((example, idx) => (
                      <span key={idx} className={styles.exampleTag}>{example}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 比較ポイント */}
        <div className={styles.pointsSection}>
          <h3 className={styles.pointsTitle}>
            住宅会社を比較する6つのポイント
          </h3>
          
          <div className={styles.pointsGrid}>
            {comparisonPoints.map((item, index) => (
              <div key={index} className={styles.pointItem}>
                <span className={styles.pointNumber}>
                  {index + 1}
                </span>
                <div className={styles.pointContent}>
                  <h4 className={styles.pointTitle}>{item.point}</h4>
                  <p className={styles.pointDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>
            注文住宅営業の経験を活かし、失敗しない住宅会社選びをサポートします
          </p>
          <a
            href="/start-home-building"
            className={styles.ctaButton}
          >
            無料で相談する
          </a>
        </div>
      </div>
    </section>
  );
};

export default CompanyComparisonGuide;