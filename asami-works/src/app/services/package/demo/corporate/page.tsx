"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./co.package.module.css";

// 業界データの定義
const industries = [
  {
    id: "medical",
    title: "医療・福祉",
    subtitle: "Medical & Welfare",
    description: "信頼と安心の医療・福祉サービスを提供する施設向けのデザイン",
    businesses: [
      "病院・クリニック",
      "介護施設・デイサービス",
      "福祉法人・NPO"
    ],
    features: [
      "診療科目・サービス紹介",
      "施設・設備案内",
      "スタッフ紹介"
    ],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    id: "manufacturing",
    title: "製造業・メーカー",
    subtitle: "Manufacturing",
    description: "確かな品質と技術力で社会に貢献する企業向けのデザイン",
    businesses: [
      "精密機器製造",
      "食品・化粧品メーカー",
      "自動車部品製造"
    ],
    features: [
      "製品カタログ",
      "品質管理体制",
      "研究開発施設"
    ],
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    id: "consulting",
    title: "コンサル・士業",
    subtitle: "Consulting & Professional",
    description: "専門知識で企業の成長を支援するプロフェッショナル向けのデザイン",
    businesses: [
      "経営コンサルティング",
      "会計事務所・税理士",
      "法律事務所"
    ],
    features: [
      "サービス内容",
      "専門家紹介",
      "成功事例"
    ],
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  {
    id: "logistics",
    title: "物流・運輸",
    subtitle: "Logistics & Transport",
    description: "確実な物流で社会インフラを支える企業向けのデザイン",
    businesses: [
      "運送会社・配送業",
      "倉庫業・物流センター",
      "引越し・物流サービス"
    ],
    features: [
      "サービス網・配送エリア",
      "物流システム",
      "車両・設備紹介"
    ],
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
  }
];

// パッケージプランの特徴
const packageFeatures = [
  {
    title: "初期費用11万円〜",
    description: "3ページ構成の本格的な企業サイト"
  },
  {
    title: "プロフェッショナルデザイン",
    description: "企業の信頼性を高める洗練されたデザイン"
  },
  {
    title: "レスポンシブ対応",
    description: "PC・タブレット・スマホ全てに最適化"
  },
  {
    title: "SEO対策済み",
    description: "検索エンジンに最適化された構造"
  }
];

export default function CorporateDemoHub() {
  const router = useRouter();

  const handleSelectIndustry = (industryId: string) => {
    router.push(`/services/package/demo/corporate/${industryId}`);
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
              <span className={styles.hubTitleMain}>コーポレートサイト デモ</span>
              <span className={styles.hubTitleSub}>業界を選んでデザインを体験</span>
            </h1>
            <p className={styles.hubDescription}>
              あなたのビジネスに最適なコーポレートサイトのデザインを体験できます。<br />
              プロフェッショナルなデザインテンプレートから<br />
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
          <h3>スタートパック コーポレートの特徴</h3>
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

      {/* CTAセクション（LPと同じデザイン） */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaSectionInner}>
          <h2 className={styles.ctaTitle}>
            今すぐはじめよう
            <span className={styles.ctaSubtitle}>Start Your Business Website</span>
          </h2>
          <p className={styles.ctaDescription}>
            プロフェッショナルなコーポレートサイトで<br />
            企業の信頼性を高めましょう
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/form?plan=package-corporate" className={styles.ctaPrimaryButton}>
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