import { Metadata } from "next";
import styles from "./CorporateService.module.css";
import RelatedLinks from "@/components/RelatedLinks";

export const metadata: Metadata = {
  title: "コーポレートサイト制作 | AsamiWorks",
  description: "企業の信頼性を高める本格的なWebサイト。4ページ構成・内部SEO基本対策込みで385,000円〜",
  keywords: ["コーポレートサイト", "企業サイト", "Web制作", "ホームページ制作", "茨城", "千葉"],
  openGraph: {
    title: "コーポレートサイト制作 | AsamiWorks",
    description: "企業の信頼性を高める本格的なWebサイト。4ページ構成・内部SEO基本対策込みで385,000円〜",
    url: "https://asami-works.com/services/original/corporate",
    siteName: "AsamiWorks",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "コーポレートサイト制作 | AsamiWorks",
    description: "企業の信頼性を高める本格的なWebサイト",
  },
  alternates: {
    canonical: "/services/original/corporate",
  },
};

export default function CorporateService() {
  return (
    <div className={styles.container}>
      {/* ヒーローセクション */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            企業の顔となる
            <br />
            コーポレートサイト制作
          </h1>
          <p className={styles.heroDescription}>
            信頼と実績を伝える、プロフェッショナルなWebサイトを
          </p>
          <div className={styles.buttonGroup}>
            <a href="/form" className={styles.primaryButton}>
              無料相談を予約する
            </a>
            <a href="#features" className={styles.secondaryButton}>
              詳細を見る
            </a>
          </div>
        </div>
      </section>

      {/* 価格セクション */}
      <section className={styles.priceSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>充実の内容を適正価格で</h2>
          <div className={styles.priceCard}>
            <div>
              <p className={styles.priceAmount}>385,000円〜</p>
              <p className={styles.priceNote}>制作費用（税込）</p>
            </div>
            <div className={styles.priceDivider}>
              <p className={styles.priceIncludes}>基本プランに含まれるもの：</p>
              <div className={styles.includesGrid}>
                <ul className={styles.includesList}>
                  <li>トップページ</li>
                  <li>会社概要ページ</li>
                  <li>事業内容ページ</li>
                  <li>お問い合わせページ</li>
                </ul>
                <ul className={styles.includesList}>
                  <li>スマホ・タブレット対応</li>
                  <li>内部SEO基本対策</li>
                  <li>SSL証明書設定</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* こんな企業様におすすめ */}
      <section className={styles.targetSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>こんな企業様におすすめ</h2>
          <div className={styles.targetGrid}>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>創業・起業したばかりの企業</h3>
              <p className={styles.targetDescription}>信頼感のあるWebデザインで、ビジネスの第一歩を確実に</p>
            </div>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>リニューアルを検討中の企業</h3>
              <p className={styles.targetDescription}>古くなったサイトを最新のデザインと技術で刷新</p>
            </div>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>採用活動を強化したい企業</h3>
              <p className={styles.targetDescription}>求職者に選ばれる、魅力的な企業サイトへ</p>
            </div>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>BtoB営業を行う企業</h3>
              <p className={styles.targetDescription}>取引先からの信頼を獲得する、プロフェッショナルなサイト</p>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>コーポレートサイト制作の特徴</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>企業の信頼性を演出</h3>
              <p className={styles.featureDescription}>
                業界や企業規模に応じた、プロフェッショナルで信頼感のあるデザインを提供します。
              </p>
            </div>
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>完全レスポンシブ対応</h3>
              <p className={styles.featureDescription}>
                PCはもちろん、スマートフォンやタブレットでも美しく、使いやすいサイトを実現。
              </p>
            </div>
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>内部SEO基本対策が標準装備</h3>
              <p className={styles.featureDescription}>
                検索エンジンに評価されやすい構造と、適切なメタ情報設定で集客力をアップ。
              </p>
            </div>
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>安全なお問い合わせフォーム</h3>
              <p className={styles.featureDescription}>
                お問合せフォームが標準装備。大切なお問い合わせを確実に受信できます。
              </p>
            </div>
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>SSL証明書対応</h3>
              <p className={styles.featureDescription}>
                通信の暗号化で安全性を確保。検索順位にも好影響を与えます。
              </p>
            </div>
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>最短3週間で納品</h3>
              <p className={styles.featureDescription}>
                いち早くサイトを公開したいという要望にも対応いたします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 制作実績イメージ */}
      <section className={styles.structureSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>制作サイトの構成例</h2>
          <div className={styles.structureCard}>
            <div>
              <h3 className={styles.structureTitle}>基本4ページ構成</h3>
              <ul className={styles.structureList}>
                <li className={styles.structureItem}>
                  <span className={styles.structureNumber}>1.</span>
                  <div className={styles.structureContent}>
                    <p className={styles.structurePageTitle}>トップページ</p>
                    <p className={styles.structurePageDescription}>企業の第一印象を決める重要なページ。キービジュアル、主要サービス、最新情報などを配置</p>
                  </div>
                </li>
                <li className={styles.structureItem}>
                  <span className={styles.structureNumber}>2.</span>
                  <div className={styles.structureContent}>
                    <p className={styles.structurePageTitle}>会社概要</p>
                    <p className={styles.structurePageDescription}>企業情報、代表挨拶、沿革、アクセスマップなど信頼性を高める情報を掲載</p>
                  </div>
                </li>
                <li className={styles.structureItem}>
                  <span className={styles.structureNumber}>3.</span>
                  <div className={styles.structureContent}>
                    <p className={styles.structurePageTitle}>事業内容</p>
                    <p className={styles.structurePageDescription}>提供サービスや商品を分かりやすく紹介。強みや特徴をアピール</p>
                  </div>
                </li>
                <li className={styles.structureItem}>
                  <span className={styles.structureNumber}>4.</span>
                  <div className={styles.structureContent}>
                    <p className={styles.structurePageTitle}>お問い合わせ</p>
                    <p className={styles.structurePageDescription}>フォーム、電話番号、営業時間など、顧客との接点を明確に</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* オプション活用事例 */}
      <section className={styles.exampleSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>オプション活用事例</h2>
          <p className={styles.exampleSubtitle}>企業の成長戦略に合わせた最適なプラン例</p>
          
          <div className={styles.exampleGrid}>
            <div className={styles.exampleCard}>
              <div className={styles.exampleHeader}>
                <h3 className={styles.exampleTitle}>事例1：信頼性重視型サイト</h3>
                <p className={styles.exampleTarget}>企業の信頼性を高めたい成長企業様向け</p>
              </div>
              <div className={styles.exampleContent}>
                <p className={styles.exampleDescription}>
                  強化したSEO対策と、企業の魅力を最大限に伝えるサイトデザイン。
                </p>
                <div className={styles.exampleBreakdown}>
                  <p className={styles.breakdownTitle}>プラン内訳：</p>
                  <ul className={styles.breakdownList}>
                    <li>コーポレートサイト制作: 385,000円</li>
                    <li>SEO対策強化: 88,000円</li>
                    <li>セキュリティ強化対策: 33,000円</li>
                  </ul>
                  <p className={styles.exampleTotal}>
                    <span>合計</span>
                    <span className={styles.totalPrice}>506,000円</span>
                  </p>
                </div>
                <div className={styles.exampleCTA}>
                  <a href="/estimate?preset=trust" className={styles.exampleButton}>
                    この内容でサイト制作を依頼する
                  </a>
                </div>
              </div>
            </div>
            
            <div className={styles.exampleCard}>
              <div className={styles.exampleHeader}>
                <h3 className={styles.exampleTitle}>事例2：情報発信強化型サイト</h3>
                <p className={styles.exampleTarget}>継続的な情報発信で集客したい企業様向け</p>
              </div>
              <div className={styles.exampleContent}>
                <p className={styles.exampleDescription}>
                  WordPress導入とSEO対策で、長期的な集客基盤を構築。
                </p>
                <div className={styles.exampleBreakdown}>
                  <p className={styles.breakdownTitle}>プラン内訳：</p>
                  <ul className={styles.breakdownList}>
                    <li>コーポレートサイト制作: 385,000円</li>
                    <li>WordPress導入: 110,000円</li>
                    <li>1ページ追加（ブログ）: 11,000円</li>
                    <li>ライティング代行: 22,000円</li>
                    <li>SEO基本対策: 0円（WordPress選択時）</li>
                  </ul>
                  <p className={styles.monthlyNote}>※月額サポートプラン ビジネス以上加入必須</p>
                  <p className={styles.exampleTotal}>
                    <span>合計</span>
                    <span className={styles.totalPrice}>528,000円</span>
                  </p>
                </div>
                <div className={styles.exampleCTA}>
                  <a href="/estimate?preset=info" className={styles.exampleButton}>
                    この内容でサイト制作を依頼する
                  </a>
                </div>
              </div>
            </div>
            
            <div className={styles.exampleCard}>
              <div className={styles.exampleHeader}>
                <h3 className={styles.exampleTitle}>事例3：グローバル展開型サイト</h3>
                <p className={styles.exampleTarget}>海外市場に進出したい企業様向け</p>
              </div>
              <div className={styles.exampleContent}>
                <p className={styles.exampleDescription}>
                  多言語対応と実績ページで、国内外の顧客に訴求力のあるサイトを構築。
                </p>
                <div className={styles.exampleBreakdown}>
                  <p className={styles.breakdownTitle}>プラン内訳：</p>
                  <ul className={styles.breakdownList}>
                    <li>コーポレートサイト制作: 385,000円</li>
                    <li>ページ追加（3P）: 33,000円</li>
                    <li>多言語対応（英語7ページ）: 264,000円</li>
                    <li>SEO対策強化: 88,000円</li>
                  </ul>
                  <p className={styles.exampleTotal}>
                    <span>合計</span>
                    <span className={styles.totalPrice}>770,000円</span>
                  </p>
                </div>
                <div className={styles.exampleCTA}>
                  <a href="/estimate?preset=global" className={styles.exampleButton}>
                    この内容でサイト制作を依頼する
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.exampleNote}>
            {/* 必要に応じて注記を追加 */}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>どのようなサイトを作りたいかお聞かせください</h2>
          <p className={styles.ctaDescription}>
            貴社の目的やご予算に合わせて、最適なプランをご提案いたします。<br />
            まずは無料相談で、理想のWebサイトについてお話しください。
          </p>
          <a href="/form" className={styles.ctaButton}>
            無料相談を予約する
          </a>
        </div>
      </section>

      <RelatedLinks />
    </div>
  );
}