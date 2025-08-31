"use client";

import styles from "./Benefits.module.css";

export default function Benefits() {
  const benefits = [
    {
      title: "企業イメージの向上",
      description: "プロフェッショナルなWebサイトで信頼性を演出。名刺交換後の検索にも対応。",
      metric: "ブランディング",
      metricLabel: "UP"
    },
    {
      title: "検索からの流入増加が期待できる",
      description: "SEO対策/AIOにより「地域名 + サービス」での検索順位向上を目指し、新規顧客との接点を創出。",
      metric: "SEO / AIO",
      metricLabel: "上位表示へ"
    },
    {
      title: "24時間365日の情報発信",
      description: "営業時間外でもサービス内容や料金を確認でき、お問い合わせフォームから連絡可能に。",
      metric: "新規ユーザー",
      metricLabel: "獲得"
    },
    {
      title: "広告費の効率的な活用",
      description: "チラシ配布やポスティングから、効果測定可能なWeb集客へシフトすることで費用対効果の改善を。",
      metric: "費用対効果",
      metricLabel: "改善"
    },
    
    {
      title: "採用活動の強化",
      description: "求職者の約9割が企業サイトをチェック。働きやすさや社風を伝えることで応募者の質向上に。",
      metric: "採用力",
      metricLabel: "強化"
    },
    {
      title: "顧客対応の効率化",
      description: "よくある質問やサービス詳細をWeb掲載することで、電話対応の負担軽減が期待できます。",
      metric: "業務効率",
      metricLabel: "向上"
    }
  ];

  const testimonials = [
    {
      company: "ナイトワーク系 Z様",
      voice: "ホームページからの求人募集が増えて、採用コストの削減に成功しました。売上も前年比115%達成で好調です。",
      
    },
    {
      company: "サービス業 P様",
      voice: "スマホ対応により若い世代の顧客が増加。Instagram連携で認知度も向上し、予約が1ヶ月先まで埋まる状態に。",
    
    },
   
  ];

  return (
    <section className={styles.benefits} aria-label="導入メリット">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.preTitle}>ホームページがもたらす変化</p>
          <h2 className={styles.sectionTitle}>
            導入後の<span className={styles.highlight}>期待される効果</span>
          </h2>
          <p className={styles.leadText}>
            適切に設計されたWebサイトは、<br className={styles.spOnly} />
            ビジネスに劇的な変化をもたらします
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.benefitCard}>
              <div className={styles.metric}>
                <span className={styles.metricValue}>{benefit.metric}</span>
                <span className={styles.metricLabel}>{benefit.metricLabel}</span>
              </div>
              <h3 className={styles.benefitTitle}>
                {benefit.title}
              </h3>
              <p className={styles.benefitDescription}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.testimonials}>
          <h3 className={styles.testimonialsTitle}>
            実際にWebサイトを刷新されたお客様の声
          </h3>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <p className={styles.testimonialVoice}>
                  "{testimonial.voice}"
                </p>
                <div className={styles.testimonialFooter}>
                  <span className={styles.testimonialCompany}>
                    {testimonial.company}
                  </span>
                  
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}