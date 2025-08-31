"use client";

import styles from "./WhyMe.module.css";

export default function WhyMe() {
  const strengths = [
    {
      title: "最初から最後まで代表が担当",
      description: "ヒアリング、デザイン、コーディング、納品後のサポートまで、すべて制作者本人が対応。伝言ゲームによる認識のズレがありません。",
      comparison: "大手: 営業→ディレクター→デザイナー→コーダー"
    },
    {
      title: "レスポンスの速さと柔軟な対応",
      description: "社内会議や承認待ちがないため、即断即決。急な修正依頼も、その場で対応方針をお伝えできます。",
      comparison: "大手: 社内確認に2-3営業日"
    },
    {
      title: "費用対効果に納得",
      description: "オフィス賃料、営業人件費、管理費などの固定費が最小限。同じ品質でも価格を抑えられます。",
      comparison: "大手: 間接費が制作費の30-50%"
    },
    {
      title: "長期的なパートナーシップ",
      description: "担当者の異動や退職がないため、お客様のビジネスを深く理解した上で、継続的なサポートが可能です。",
      comparison: "大手: 担当者が2-3年で異動"
    },
    {
      title: "小回りの利く細やかなサービス",
      description: "「ちょっとした相談」も気軽にできる関係性。LINEやメールで、すぐに質問できる安心感があります。",
      comparison: "大手: サポート窓口経由で時間がかかる"
    },
    {
      title: "地域密着で顔の見える関係",
      description: "茨城・千葉エリアなら直接お伺いして打ち合わせ。顔を合わせて話せる安心感と信頼関係を大切にします。",
      comparison: "大手: オンラインミーティングが中心"
    }
  ];

  const comparison = {
    individual: {
      title: "個人事業主に依頼する場合",
      points: [
        "制作者と直接やり取り",
        "意思決定が早い",
        "適正価格",
        "柔軟な対応",
        "長期的な関係"
      ]
    },
    corporate: {
      title: "大手制作会社に依頼する場合",
      points: [
        "分業制で専門性は高い",
        "大規模案件に強い",
        "組織的なバックアップ",
        "ブランド力がある",
        "リソースが豊富"
      ]
    }
  };

  return (
    <section className={styles.whyme} aria-label="個人事業主の強み">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.preTitle}>なぜ個人事業主を選ぶのか</p>
          <h2 className={styles.sectionTitle}>
            大手にはない<span className={styles.highlight}>「顔の見える」強み</span>
          </h2>
          <p className={styles.leadText}>
            一人だからこそできる、<br className={styles.spOnly} />
            きめ細やかで柔軟なサービスがあります
          </p>
        </div>

        <div className={styles.strengthsGrid}>
          {strengths.map((strength, index) => (
            <div key={index} className={styles.strengthCard}>
              <h3 className={styles.strengthTitle}>
                {strength.title}
              </h3>
              <p className={styles.strengthDescription}>
                {strength.description}
              </p>
              <div className={styles.comparison}>
                <span className={styles.comparisonLabel}>参考</span>
                <span className={styles.comparisonText}>{strength.comparison}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.comparisonSection}>
          <h3 className={styles.comparisonTitle}>
            それぞれの特徴を理解して、最適な選択を
          </h3>
          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCard}>
              <h4 className={styles.comparisonCardTitle}>
                {comparison.individual.title}
              </h4>
              <ul className={styles.comparisonList}>
                {comparison.individual.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p className={styles.comparisonSummary}>
                <strong>中小企業・個人事業主様に最適</strong><br />
                スピード感と柔軟性を重視する方向け
              </p>
            </div>
            <div className={styles.comparisonCard}>
              <h4 className={styles.comparisonCardTitle}>
                {comparison.corporate.title}
              </h4>
              <ul className={styles.comparisonList}>
                {comparison.corporate.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p className={styles.comparisonSummary}>
                <strong>大企業・大規模プロジェクト向け</strong><br />
                組織力とブランド力を重視する方向け
              </p>
            </div>
          </div>
        </div>

        <div className={styles.message}>
          <p className={styles.messageText}>
            私は、茨城・千葉の中小企業様の<br />
            <strong>「ちょうどいいパートナー」</strong>を目指しています
          </p>
          <p className={styles.messageSubtext}>
            大手制作会社様も素晴らしいサービスを提供されています。<br />
            それぞれの良さを理解した上で、<br className={styles.spOnly} />
            お客様に最適な選択をしていただければ幸いです。
          </p>
        </div>
      </div>
    </section>
  );
}