"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./lp.package.module.css";

// 業界データの定義
const industries = [
  {
    id: "beauty",
    title: "美容系",
    subtitle: "Beauty & Relaxation",
    description: "エステ、ネイル、美容室など、美と癒しを提供するサロン向けのデザイン",
    businesses: [
      "エステ・リラクゼーションサロン",
      "ネイルサロン・まつげエクステ", 
      "美容室・ヘアサロン"
    ],
    features: [
      "施術メニュー紹介",
      "ビフォーアフター",
      "スタッフ紹介"
    ],
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%)"
  },
  {
    id: "medical",
    title: "医療・健康系",
    subtitle: "Medical & Health",
    description: "整体院、歯科、フィットネスなど、健康をサポートする施設向けのデザイン",
    businesses: [
      "整体院・整骨院",
      "歯科医院",
      "パーソナル・フィットネスジム"
    ],
    features: [
      "診療内容・料金表",
      "施設・設備紹介",
      "患者様の声"
    ],
    gradient: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)"
  },
  {
    id: "education",
    title: "教育系",
    subtitle: "Education & Learning",
    description: "学習塾、音楽教室、プログラミングなど、学びを提供する教室向けのデザイン",
    businesses: [
      "学習塾・個別指導塾",
      "音楽教室・ピアノ教室",
      "プログラミングスクール"
    ],
    features: [
      "カリキュラム紹介",
      "講師プロフィール",
      "合格実績・成果"
    ],
    gradient: "linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)"
  },
  {
    id: "food",
    title: "飲食系",
    subtitle: "Food & Beverage",
    description: "カフェ、居酒屋、テイクアウトなど、食の楽しみを提供する店舗向けのデザイン",
    businesses: [
      "カフェ・喫茶店",
      "居酒屋・バー",
      "テイクアウト専門店"
    ],
    features: [
      "メニュー紹介",
      "店内の雰囲気",
      "アクセス・営業時間"
    ],
    gradient: "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)"
  }
];

// パッケージプランの特徴
const packageFeatures = [
  {
    title: "初期費用5.5万円〜",
    description: "高品質なデザインをリーズナブルな価格で"
  },
  {
    title: "3つのデザインテーマ",
    description: "エレガント・ナチュラル・モダンから選択可能"
  },
  {
    title: "レスポンシブ対応",
    description: "スマホ・タブレット・PC全デバイスで最適表示"
  },
  {
    title: "最短3日で公開",
    description: "スピーディーな制作でビジネスをすぐスタート"
  }
];

export default function LPDemoHub() {
  const router = useRouter();

  const handleSelectIndustry = (industryId: string) => {
    router.push(`/services/package/demo/lp/${industryId}`);
  };

  return (
    <div className={styles.hubWrapper}>
      {/* ヘッダーセクション */}
      <header className={styles.hubHeader}>
        <div className={styles.hubHeaderInner}>
          <Link href="/services/package" className={styles.backLink}>
            ← パッケージプラン一覧に戻る
          </Link>
          
          <div className={styles.hubHero}>
            <h1 className={styles.hubTitle}>
              <span className={styles.hubTitleMain}>ランディングページ デモ</span>
              <span className={styles.hubTitleSub}>業界を選んでデザインを体験</span>
            </h1>
            <p className={styles.hubDescription}>
              あなたのビジネスに最適なランディングページのデザインを体験できます。<br />
              まずは業界を選択して、4つの業種 × 3つのデザインテーマから<br />
              お好みのスタイルを見つけてください。
            </p>
          </div>
        </div>
      </header>

      {/* 業界選択セクション */}
      <section className={styles.industrySection}>
        <div className={styles.industryGrid}>
          {industries.map((industry, index) => (
            <article
              key={industry.id}
              className={styles.industryCard}
              onClick={() => handleSelectIndustry(industry.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className={styles.industryCardHeader}
                style={{ background: industry.gradient }}
              >
                <h2 className={styles.industryTitle}>
                  {industry.title}
                  <span className={styles.industrySubtitle}>{industry.subtitle}</span>
                </h2>
              </div>
              
              <div className={styles.industryCardContent}>
                <p className={styles.industryDescription}>
                  {industry.description}
                </p>
                
                <div className={styles.businessList}>
                  <h3 className={styles.businessListTitle}>対応業種</h3>
                  <ul>
                    {industry.businesses.map((business, idx) => (
                      <li key={idx} className={styles.businessItem}>
                        {business}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.featureList}>
                  <h3 className={styles.featureListTitle}>主な機能</h3>
                  <ul>
                    {industry.features.map((feature, idx) => (
                      <li key={idx} className={styles.featureItem}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className={styles.industryButton}>
                  デモを見る
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* フッター情報セクション */}
      <section className={styles.hubFooter}>
        <div className={styles.hubInfo}>
          <h3>スタートパック LPの特徴</h3>
          <div className={styles.infoGrid}>
            {packageFeatures.map((feature, index) => (
              <div key={index} className={styles.infoItem}>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaSectionInner}>
          <h2 className={styles.ctaTitle}>
            今すぐはじめよう
            <span className={styles.ctaSubtitle}>Start Your Business Online</span>
          </h2>
          <p className={styles.ctaDescription}>
            プロフェッショナルなランディングページで<br />
            ビジネスの成長を加速させましょう
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/form?plan=package-lp" className={styles.ctaPrimaryButton}>
              無料相談を申し込む
            </Link>
            <Link href="/services/package" className={styles.ctaSecondaryButton}>
              他のプランを見る
            </Link>
          </div>
          <p className={styles.ctaFootnote}>
            ※ご相談は無料です。お気軽にお問い合わせください。
          </p>
        </div>
      </section>

      {/* フッター */}
      <footer className={styles.footerSection}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            実際のサイト制作では、お客様のご要望に合わせて<br />
            デザインのカスタマイズが可能です
          </p>
        </div>
      </footer>
    </div>
  );
}