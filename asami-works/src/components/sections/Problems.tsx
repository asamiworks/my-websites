"use client";

import styles from "./Problems.module.css";

export default function Problems() {
  const problems = [
    {
      title: "ホームページはあるけど、全然お問い合わせが来ない",
      description: "せっかく作ったホームページなのに、月に1件もお問い合わせがない。アクセス数も少なく、本当に意味があるのか分からない。"
    },
    {
      title: "制作会社に頼んだら想定以上に高額だった",
      description: "見積もりを取ったら100万円以上。追加費用も次々と発生し、小規模事業者には負担が大きすぎる。"
    },
    {
      title: "更新したいけど、都度費用がかかる",
      description: "ちょっとした文言変更でも数万円。自分で更新できないから、情報が古いまま放置している。"
    },
    {
      title: "担当者がコロコロ変わって、意図が伝わらない",
      description: "営業、デザイナー、コーダーと担当が変わるたびに説明し直し。結果、思っていたものと違うサイトに。"
    },
    {
      title: "スマホ対応していなくて、見づらいと言われる",
      description: "お客様の7割以上がスマホなのに、PC版しかない。ピンチアウトしないと見れないサイトで機会損失。"
    },
    {
      title: "補助金を使いたいけど、申請が複雑すぎる",
      description: "小規模事業者持続化補助金があるのは知っているが、申請書類の作成が難しくて諦めてしまった。"
    }
  ];

  return (
    <section className={styles.problems} aria-label="よくある課題">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.preTitle}>多くの経営者様が抱える悩み</p>
          <h2 className={styles.sectionTitle}>
            こんな<span className={styles.highlight}>お悩み</span>ありませんか？
          </h2>
          <p className={styles.leadText}>
            茨城・千葉の中小企業経営者様から、<br className={styles.spOnly} />
            このようなご相談をよくいただきます。
          </p>
        </div>

        <div className={styles.problemsGrid}>
          {problems.map((problem, index) => (
            <div key={index} className={styles.problemCard}>
              <h3 className={styles.problemTitle}>
                {problem.title}
              </h3>
              <p className={styles.problemDescription}>
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.transition}>
          <p className={styles.transitionText}>
            これらの課題、<br className={styles.spOnly} />
            <strong>すべて解決できます</strong>
          </p>
          <div className={styles.arrow} aria-hidden="true"></div>
        </div>
      </div>
    </section>
  );
}