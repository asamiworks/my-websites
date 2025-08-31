"use client";

import styles from "./Works.module.css";
import Image from "next/image";

export default function Works() {
  const works = [
    {
      id: "pilias-artmake",
      title: "PILIAS ARTMAKE",
      category: "医療系サイト",
      industry: "パラメディカルアートメイク",
      image: "/images/works/pilias-artmake.jpg",
      url: "https://pilias-artmake.com/",
      description: "美しさを追求する方や、傷痕や白斑などの医療的な悩みを抱えている方に真摯に向き合う、完全予約制のパラメディカルアートメイク・医療アートメイク",
      results: [
        "多数の施術例を実装",
        "グレーを基調としたデザインでブランド価値向上",
        "スマホ最適化"
      ],
      features: ["オリジナルデザイン", "SNS連携", ],
      testimonial: "イメージ通りの高級感のあるデザインに仕上がりました。集客効果に期待しています。"
    },
    {
      id: "appare-seitai",
      title: "天晴れ整体院",
      category: "ランディングページ",
      industry: "整体・治療院",
      image: "/images/works/appare-seitai.jpg",
      url: "https://appare-seitai.com",
      description: "完全予約制で一人ひとりに寄り添う施術を提供する整体院。丁寧なカウンセリングと確かな技術が特徴。",
      results: [
        "キャンペーン画像が日付で自動切替",
        "症例紹介で施術内容を分かりやすく説明",
        "地域密着型のSEO対策とAIOを実施"
      ],
      features: ["LP制作", "SEO対策", "AIO", "オリジナルデザイン"],
      testimonial: "親身になって要望を聞いていただき、分かりやすいサイトに仕上がりました。"
    },
    {
      id: "adachi-electric",
      title: "株式会社足立電気",
      category: "コーポレートサイト",
      industry: "電気工事業",
      image: "/images/works/adachi-electric.jpg",
      url: "https://jh-ad.jp",
      description: "茨城県龍ヶ崎にある電気設備・公共工事を中心とした地域密着型の電気会社様",
      results: [
        "地域名×電気工事のSEO対策を実装",
        "軽量化",
        "スマホ対応で現場からも閲覧しやすく"
      ],
      features: ["コーポレートサイト", "SEO対策", "オリジナルデザイン"],
      testimonial: "プロフェッショナルなデザインで、会社の信頼性が伝わるサイトになりました。"
    },
    {
      id: "members-club-zen",
      title: "メンバーズクラブ善",
      category: "WordPress",
      industry: "高級クラブ",
      image: "/images/works/members-club-zen.jpg",
      url: "https://club-zen.jp/",
      description: "茨城県つくば市にある会員制高級クラブ。WordPressを利用しているため、スタッフがブログ投稿も可能。",
      results: [
        "WordPressでスタッフが自由に更新可能",
        "高級感のあるデザインで店格を表現",
        "Instagram連携で最新情報を自動表示"
      ],
      features: ["WordPress", "Instagram連携", ],
      testimonial: "スタッフが簡単にブログを更新できるようになり、情報発信が楽になりました。"
    },
    {
      id: "ibaraki-memorial",
      title: "茨城メモリアルパーク",
      category: "ランディングページ",
      industry: "霊園・葬祭業",
      image: "/images/works/ibaraki-memorial.jpg",
      url: "https://ibaraki-memorial.com",
      description: "茨城県土浦市にあるリース型霊園。広い敷地とアクセス性の良さが特徴。",
      results: [
        "資料請求フォームを分かりやすく設置",
        "温かみのあるデザインで安心感を演出",
        "アクセス情報を詳細に掲載"
      ],
      features: ["オリジナルデザイン", "SEO対策", "資料請求フォーム", "アクセスマップ"],
      testimonial: "デリケートな内容ですが、優しい雰囲気のデザインで安心感があるサイトになりました。"
    },
    {
      id: "wild-dirt-rc",
      title: "ワイルドダートRCつくば",
      category: "ランディングページ",
      industry: "RCサーキット",
      image: "/images/works/wild-dirt-rc.jpg",
      url: "https://wrc-tsukuba.com/",
      description: "日本最大級の屋外ラジコンコースを展開するRCサーキット場",
      results: [
        "日本最大級のコース情報を分かりやすく掲載",
        "各SNSリンク",
        "モバイル対応で現地でも確認しやすく"
      ],
      features: ["LP制作", "モバイル対応", "オリジナルデザイン"],
      testimonial: "コースの魅力が伝わる迫力のあるデザインに仕上がりました。"
    }
  ];

  const stats = {
    totalProjects: "30+",
    averageScore: "5.0",
    repeatRate: "80%",
    onTimeDelivery: "100%"
  };

  return (
    <section className={styles.works} aria-label="制作実績">
      <div className={styles.container}>
        <div className={styles.header}>
        
          <h2 className={styles.sectionTitle}>
            実際の<span className={styles.highlight}>制作実績</span>をご紹介
          </h2>
       
        </div>

        

        <div className={styles.worksGrid}>
          {works.map((work) => (
            <article key={work.id} className={styles.workCard}>
              <div className={styles.workImage}>
                <Image
                  src={work.image}
                  alt={`${work.title}のWebサイト`}
                  width={400}
                  height={300}
                  loading="lazy"
                />
                <span className={styles.workCategory}>{work.category}</span>
              </div>
              
              <div className={styles.workContent}>
                <h3 className={styles.workTitle}>{work.title}</h3>
                <span className={styles.workIndustry}>{work.industry}</span>
                
                <p className={styles.workDescription}>
                  {work.description}
                </p>
                
                <div className={styles.workResults}>
                  <h4 className={styles.resultsTitle}>導入成果</h4>
                  <ul className={styles.resultsList}>
                    {work.results.map((result, index) => (
                      <li key={index}>{result}</li>
                    ))}
                  </ul>
                </div>
                
                <div className={styles.workFeatures}>
                  {work.features.map((feature, index) => (
                    <span key={index} className={styles.featureTag}>
                      {feature}
                    </span>
                  ))}
                </div>
                
                <blockquote className={styles.testimonial}>
                  "{work.testimonial}"
                </blockquote>
                
                {work.url && (
                  <a 
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.workViewButton}
                  >
                    サイトを見る →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.moreWorks}>
        <p className={styles.ctaText}>
          その他にも多数の制作実績がございます
          </p>
          <a href="/about" className={styles.ctaButton}>
            制作実績を見る
          </a>
        </div>

      
      </div>
    </section>
  );
}