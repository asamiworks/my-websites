"use client";

import styles from "./Solutions.module.css";

export default function Solutions() {
  const solutions = [
    {
      problem: "お問い合わせが来ない",
      solution: "SEO対策とコンバージョン最適化",
      details: "検索上位表示を実現し、訪問者をお問い合わせに導く導線設計。※SEO対策は効果が出るまで3ヶ月以上かかります。"
    },
    {
      problem: "制作費用が高すぎる",
      solution: "補助金活用で最大66.7%削減",
      details: "小規模事業者持続化補助金の申請サポート付き。77万円のサイトが実質27万円で制作可能に。"
    },
    {
      problem: "更新費用がかさむ",
      solution: "お客様自身で更新できるシステム",
      details: "WordPressやノーコードツールを活用。簡単な操作で、テキストや画像を自由に更新。更新マニュアルも提供。"
    },
    {
      problem: "意図が伝わらない",
      solution: "制作者本人が最後まで対応",
      details: "ヒアリングから納品まで同じ人間が担当。認識のズレがなく、細かなニュアンスも確実に反映。"
    },
    {
      problem: "スマホ対応していない",
      solution: "モバイルファースト設計",
      details: "スマホ・タブレット・PCすべてに最適化。どんなデバイスでも美しく、使いやすいデザインを実現。"
    },
    {
      problem: "補助金申請が難しい",
      solution: "申請書作成を完全サポート",
      details: "採択率を高めるポイントを熟知。事業計画書の作成から申請、実績報告まで伴走支援。"
    }
  ];

  return (
    <section className={styles.solutions} aria-label="解決策">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.preTitle}>AsamiWorksが提供する解決策</p>
          <h2 className={styles.sectionTitle}>
            すべての課題に<span className={styles.highlight}>明確な答え</span>があります
          </h2>
          <p className={styles.leadText}>
            様々な分野のWeb制作経験と地域密着の強みを活かし、<br className={styles.pcOnly} />
            お客様の課題を根本から解決します。
          </p>
        </div>

        <div className={styles.solutionsGrid}>
          {solutions.map((item, index) => (
            <div key={index} className={styles.solutionCard}>
              <div className={styles.problemLabel}>
                課題
              </div>
              <h3 className={styles.problemText}>
                {item.problem}
              </h3>
              
              <div className={styles.solutionContent}>
                <div className={styles.solutionLabel}>
                  解決策
                </div>
                <h4 className={styles.solutionTitle}>
                  {item.solution}
                </h4>
                <p className={styles.solutionDetails}>
                  {item.details}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <p className={styles.summaryText}>
            大手制作会社では対応しきれない<br className={styles.spOnly} />
            きめ細やかなサポートで、<br />
            <strong>あなたのビジネスを成功に導きます</strong>
          </p>
          <div className={styles.comparisonLink}>
            <a href="/services/comparison" className={styles.comparisonButton}>
              WEBサイトとWEBアプリの違いはこちら →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}