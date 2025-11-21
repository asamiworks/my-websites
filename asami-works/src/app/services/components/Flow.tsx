"use client";

import styles from "./Flow.module.css";

export default function Flow() {
  const steps = [
    "お問い合わせ",
    "ヒアリング",
    "ご提案・お見積り",
    "ご契約・制作スタート",
    "サイト構成作成",
    "デザイン制作",
    "修正対応",
    "コーディング",
    "CMS組み込み・操作説明（※導入時のみ）",
    "サイトチェック",
    "納品・公開",
  ];

  return (
    <section id="flow" className={styles.flowSection}>
      <h2 className={styles.sectionTitle}>ホームページ制作の流れと期間の目安</h2>

      <p className={styles.description}>
        AsamiWorksでは、お問い合わせから納品・公開まで、<strong>平均で1ヶ月〜2ヶ月程度</strong>の制作期間を想定しています。
        内容やページ数、オプションの有無によって変動しますが、スムーズな進行を心がけています。
        <br />
        下記に、標準的なホームページ制作の流れをご案内します。
      </p>

      <div className={styles.flowLabel}>ご相談・お打ち合わせ（無料）</div>
      <div className={styles.slideHint}>※フリックするとスライドできます</div>

      <ol className={styles.flowContainer} aria-label="ホームページ制作ステップ一覧">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`${styles.flowCard} 
              ${index <= 2 ? styles.freeZone : ""} 
              ${index === 8 ? styles.cmsOnly : ""}`}
          >
            <div className={styles.cardNumber}>
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className={styles.cardTitle}>{step}</div>
          </li>
        ))}
      </ol>

      <div className={styles.productionDuration}>
        <h3>制作期間の目安</h3>
        <p>シンプルな構成であれば約1ヶ月〜、複数ページやカスタマイズがある場合は2ヶ月前後が一般的です。</p>
      </div>
    </section>
  );
}
