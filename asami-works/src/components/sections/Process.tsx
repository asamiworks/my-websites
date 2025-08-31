"use client";

import styles from "./Process.module.css";

export default function Process() {
  const steps = [
    {
      number: "01",
      title: "お問い合わせ・無料相談",
      duration: "即日対応",
      description: "まずはお気軽にご相談ください。フォーム、メール、LINE（ご紹介の場合）など、ご都合の良い方法でお問い合わせいただけます。",
      details: [
        "ご要望のヒアリング",
        "補助金活用の場合はお申し付けください"
      ]
    },
    {
      number: "02",
      title: "詳細ヒアリング・ご提案",
      duration: "1-2時間",
      description: "対面またはオンラインで詳しくお話を伺います。ビジネスモデルやターゲット層を理解し、最適な提案をいたします。",
      details: [
        "事業内容の深掘り",
        "競合分析の実施",
        "サイト構成の提案"
      ]
    },
    {
      number: "03",
      title: "お見積もり・制作開始",
      duration: "1-5日",
      description: "詳細なお見積もりと制作スケジュールをご提示。ご納得いただけましたら契約となります。",
      details: [
        "見積書の作成",
        "着手金のお支払い（制作費の0%〜30%）"
      ]
    },
    {
      number: "04",
      title: "デザイン制作",
      duration: "最短1日〜",
      description: "ヒアリング内容を基に、オリジナルデザインを制作。修正は納得いくまで対応します。",
      details: [
        "トップページデザイン作成",
        "フィードバック・修正",
        "下層ページデザイン展開"
      ]
    },
    {
      number: "05",
      title: "コーディング・システム構築",
      duration: "最短2日〜2週間",
      description: "デザインを基に、実際に動くWebサイトを構築。スマホ対応やSEO対策も実施します。",
      details: [
        "HTML/CSS/JavaScriptコーディング",
        "CMS構築（WordPress等）",
        "動作テスト・品質チェック"
      ]
    },
    {
      number: "06",
      title: "確認・修正・公開",
      duration: "最短1日〜",
      description: "テストサイトで最終確認いただき、修正対応後に本番公開します。",
      details: [
        "テストサイトでの確認",
        "最終修正対応",
        "本番サーバーへの公開"
      ]
    },
    {
      number: "07",
      title: "納品・運用サポート",
      duration: "継続的",
      description: "更新マニュアルをお渡しし、運用方法をレクチャー。公開後も継続的にサポートします。",
      details: [
        "更新マニュアルの提供",
        "操作レクチャー（1-2時間）",
        "月額サポート（オプション）"
      ]
    }
  ];

  const timelines = [
    {
      type: "最短プラン",
      duration: "3日〜1週間",
      description: "パッケージプランで最速公開",
      suitable: "すぐにサイトが必要な方"
    },
    {
      type: "標準プラン",
      duration: "3週間〜1.5ヶ月",
      description: "オリジナル制作の通常納期",
      suitable: "しっかり作り込みたい方"
    },
    {
      type: "補助金活用プラン",
      duration: "3〜4ヶ月",
      description: "申請・採択期間を含む",
      suitable: "費用を抑えたい方"
    }
  ];

  return (
    <section className={styles.process} aria-label="制作の流れ">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.preTitle}>安心の制作プロセス</p>
          <h2 className={styles.sectionTitle}>
            ご相談から公開まで<span className={styles.highlight}>7つのステップ</span>
          </h2>
          <p className={styles.leadText}>
            透明性の高いプロセスで、<br className={styles.spOnly} />
            安心してお任せいただけます
          </p>
        </div>

        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>{step.number}</span>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <span className={styles.stepDuration}>{step.duration}</span>
                </div>
              </div>
              
              <p className={styles.stepDescription}>
                {step.description}
              </p>
              
              <ul className={styles.stepDetails}>
                {step.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>

              {index < steps.length - 1 && (
                <div className={styles.stepConnector} aria-hidden="true"></div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.timelinesSection}>
          <h3 className={styles.timelinesTitle}>
            納期の目安
          </h3>
          <div className={styles.timelinesGrid}>
            {timelines.map((timeline, index) => (
              <div key={index} className={styles.timelineCard}>
                <h4 className={styles.timelineType}>{timeline.type}</h4>
                <p className={styles.timelineDuration}>{timeline.duration}</p>
                <p className={styles.timelineDescription}>{timeline.description}</p>
                <p className={styles.timelineSuitable}>
                  こんな方に：{timeline.suitable}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>
            安心のサポート体制
          </h3>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <h4>修正対応</h4>
              <p>各工程で納得いくまで修正対応。追加費用なしで安心です。</p>
            </div>
            <div className={styles.featureItem}>
              <h4>進捗報告</h4>
              <p>定期的に進捗をご報告。いつでも状況を確認できます。</p>
            </div>
            <div className={styles.featureItem}>
              <h4>直接連絡</h4>
              <p>制作者と直接やり取り。LINEでの相談もOKです。</p>
            </div>
            <div className={styles.featureItem}>
              <h4>補助金サポート</h4>
              <p>申請書類の作成から実績報告まで完全サポート。</p>
            </div>
          </div>
        </div>

        <div className={styles.ctaWrapper}>
          <p className={styles.ctaText}>
            まずは無料相談から始めましょう
          </p>
          <div className={styles.ctaButtons}>
            <a href="/form" className={styles.primaryCta}>
              無料相談を申し込む
            </a>
            <a href="/estimate" className={styles.secondaryCta}>
              料金シミュレーション
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}