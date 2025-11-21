import { Metadata } from "next";
import styles from "./LandingPageService.module.css";
import RelatedLinks from "@/components/RelatedLinks";

export const metadata: Metadata = {
  title: "ランディングページ制作 | AI時代のコンバージョン最適化 - AsamiWorks",
  description: "AIで量産されるLPとは一線を画す、成果にコミットしたランディングページ制作。AIO対策・高速表示・A/Bテスト対応で確実にコンバージョンを獲得。120,000円〜（税抜）",
  keywords: ["ランディングページ", "LP制作", "コンバージョン", "AIO対策", "A/Bテスト", "高速表示", "Web制作"],
  openGraph: {
    title: "ランディングページ制作 | AI時代のコンバージョン最適化 - AsamiWorks",
    description: "AIで量産されるLPとは一線を画す、成果にコミットしたランディングページ制作",
    url: "https://asami-works.com/services/original/lp",
    siteName: "AsamiWorks",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ランディングページ制作 | AI時代のコンバージョン最適化",
    description: "AIO対策・高速表示・A/Bテスト対応で確実にコンバージョンを獲得",
  },
  alternates: {
    canonical: "/services/original/lp",
  },
};

export default function LandingPageService() {
  return (
    <div className={styles.container}>
      {/* ヒーローセクション */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            AI時代でも
            <br />
            成果を出すLP
          </h1>
          <p className={styles.heroDescription}>
            技術と戦略で、確実にコンバージョンを獲得する
          </p>
          <div className={styles.buttonGroup}>
            <a href="/form" className={styles.primaryButton}>
              無料相談を予約する
            </a>
            <a href="#technology" className={styles.secondaryButton}>
              詳細を見る
            </a>
          </div>
        </div>
      </section>

      {/* 課題提起セクション */}
      <section className={styles.challengeSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>誰でもLPを作れる時代の落とし穴</h2>
          <div className={styles.challengeContent}>
            <p className={styles.challengeText}>
              AIの発達により、今や誰でもランディングページを数分で作成できるようになりました。
              しかし、それは同時に<strong>膨大な数の類似LPが存在する</strong>ことを意味します。
            </p>
            <p className={styles.challengeText}>
              <strong>そのLPは、本当に成果を出せていますか？</strong>
            </p>
            <p className={styles.challengeText}>
              AIが生成したテンプレート的なLPでは、ユーザーの心を動かし、
              行動を促すことは困難です。
              また、AI検索エンジンへの最適化（AIO）がなければ、
              そもそも見つけてもらうことすらできません。
            </p>
          </div>
        </div>
      </section>

      {/* 技術セクション */}
      <section id="technology" className={styles.technologySection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>成果を出すための技術</h2>
          <div className={styles.technologyGrid}>
            <div className={styles.technologyItem}>
              <h3 className={styles.technologyTitle}>超高速表示</h3>
              <p className={styles.technologyDescription}>
                Core Web Vitals最適化により、3秒以内の表示を実現。
                表示速度が1秒遅れるごとにコンバージョン率は7%低下すると言われています。
              </p>
            </div>
            <div className={styles.technologyItem}>
              <h3 className={styles.technologyTitle}>AIO対策</h3>
              <p className={styles.technologyDescription}>
                ChatGPTやPerplexityなどのAI検索に最適化された構造化データを実装。
                AI時代の新しい流入経路を確保します。
              </p>
            </div>
            <div className={styles.technologyItem}>
              <h3 className={styles.technologyTitle}>コンバージョン設計</h3>
              <p className={styles.technologyDescription}>
                ユーザー心理に基づいた導線設計。
                ファーストビュー、CTA配置、フォーム最適化まで、
                すべてを成果から逆算して設計します。
              </p>
            </div>
            <div className={styles.technologyItem}>
              <h3 className={styles.technologyTitle}>A/Bテスト対応</h3>
              <p className={styles.technologyDescription}>
                複数パターンを比較検証できる構造で制作。
                データに基づいた継続的な改善が可能です。
              </p>
            </div>
            <div className={styles.technologyItem}>
              <h3 className={styles.technologyTitle}>完全レスポンシブ</h3>
              <p className={styles.technologyDescription}>
                スマホからの流入が8割を超える現在、
                モバイルファーストで設計し、すべてのデバイスで最適な表示を実現。
              </p>
            </div>
            <div className={styles.technologyItem}>
              <h3 className={styles.technologyTitle}>セキュリティ</h3>
              <p className={styles.technologyDescription}>
                SSL証明書設定、フォームのスパム対策など、
                安心して運用できる環境を構築します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 価格セクション */}
      <section className={styles.priceSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>明確でシンプルな価格設定</h2>
          <div className={styles.priceCard}>
            <div>
              <p className={styles.priceAmount}>120,000円〜</p>
              <p className={styles.priceNote}>制作費用（税抜）</p>
            </div>
            <div className={styles.priceDivider}>
              <p className={styles.priceIncludes}>料金に含まれるもの：</p>
              <ul className={styles.includesList}>
                <li>オリジナルデザイン制作</li>
                <li>スマホ・タブレット対応</li>
                <li>電話番号・メールアドレス設置</li>
                <li>基本的なSEO・AIO対策</li>
                <li>高速表示最適化</li>
              </ul>
              <p className={styles.optionNote}>
                ※お問い合わせフォームの設置は別途30,000円（税抜）のオプションとなります
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* オプション活用事例 */}
      <section className={styles.exampleSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>オプション活用事例</h2>
          <p className={styles.exampleSubtitle}>目的に応じた最適なオプション選択例</p>

          <div className={styles.exampleGrid}>
            <div className={styles.exampleCard}>
              <div className={styles.exampleHeader}>
                <h3 className={styles.exampleTitle}>事例1：リード獲得特化LP</h3>
                <p className={styles.exampleTarget}>データに基づいた改善でCVRを最大化したい企業様向け</p>
              </div>
              <div className={styles.exampleContent}>
                <p className={styles.exampleDescription}>
                  フォームとAnalyticsで効果測定。A/Bテストで継続的に改善できる基盤を構築。
                </p>
                <div className={styles.exampleBreakdown}>
                  <p className={styles.breakdownTitle}>プラン内訳（税抜）：</p>
                  <ul className={styles.breakdownList}>
                    <li>ランディングページ制作: 120,000円</li>
                    <li>お問い合わせフォーム設置: 30,000円</li>
                    <li>Google Analytics設定: 20,000円</li>
                  </ul>
                  <p className={styles.exampleTotal}>
                    <span>合計</span>
                    <span className={styles.totalPrice}>170,000円</span>
                  </p>
                  <a href="/estimate?preset=lead" className={styles.exampleCTA}>
                    この内容でサイト制作を依頼する
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.exampleCard}>
              <div className={styles.exampleHeader}>
                <h3 className={styles.exampleTitle}>事例2：広告運用特化LP</h3>
                <p className={styles.exampleTarget}>Web広告からの流入を確実に成果につなげたい企業様向け</p>
              </div>
              <div className={styles.exampleContent}>
                <p className={styles.exampleDescription}>
                  広告効果を最大化する導線設計。コンバージョン計測で費用対効果を可視化。
                </p>
                <div className={styles.exampleBreakdown}>
                  <p className={styles.breakdownTitle}>プラン内訳（税抜）：</p>
                  <ul className={styles.breakdownList}>
                    <li>ランディングページ制作: 120,000円</li>
                    <li>Google Analytics設定: 20,000円</li>
                    <li>広告出稿サポート: 30,000円</li>
                  </ul>
                  <p className={styles.exampleTotal}>
                    <span>合計</span>
                    <span className={styles.totalPrice}>170,000円</span>
                  </p>
                  <a href="/estimate?preset=ad" className={styles.exampleCTA}>
                    この内容でサイト制作を依頼する
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.exampleCard}>
              <div className={styles.exampleHeader}>
                <h3 className={styles.exampleTitle}>事例3：高CVR商品訴求LP</h3>
                <p className={styles.exampleTarget}>商品の魅力を最大限に伝え購入率を高めたい企業様向け</p>
              </div>
              <div className={styles.exampleContent}>
                <p className={styles.exampleDescription}>
                  プロのライティングで説得力のある訴求。セキュアな申込環境で信頼感を醸成。
                </p>
                <div className={styles.exampleBreakdown}>
                  <p className={styles.breakdownTitle}>プラン内訳（税抜）：</p>
                  <ul className={styles.breakdownList}>
                    <li>ランディングページ制作: 120,000円</li>
                    <li>お問い合わせフォーム設置: 30,000円</li>
                    <li>セキュリティ強化対策: 30,000円</li>
                    <li>ライティング代行: 20,000円</li>
                  </ul>
                  <p className={styles.exampleTotal}>
                    <span>合計</span>
                    <span className={styles.totalPrice}>200,000円</span>
                  </p>
                  <a href="/estimate?preset=highcvr" className={styles.exampleCTA}>
                    この内容でサイト制作を依頼する
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.exampleNote}>
            <p>
              <strong>ご予算やご要望に合わせて、最適なオプションをご提案いたします。</strong><br />
              まずはお気軽にご相談ください。
            </p>
          </div>
        </div>
      </section>

      {/* こんな方におすすめ */}
      <section className={styles.targetSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>こんな方におすすめ</h2>
          <div className={styles.targetList}>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>AIで作ったLPの成果が出ない</h3>
              <p className={styles.targetDescription}>
                テンプレート的なLPでは差別化できない。人の手による戦略的な設計で成果を出します
              </p>
            </div>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>Web広告との連携を強化したい</h3>
              <p className={styles.targetDescription}>
                Google広告やSNS広告からの流入を、確実に成果につなげたい方
              </p>
            </div>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>新商品・サービスのプロモーション</h3>
              <p className={styles.targetDescription}>
                特定の商品やサービスに特化したページで、効果的にアピールしたい方
              </p>
            </div>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>スピーディーに始めたい</h3>
              <p className={styles.targetDescription}>
                最短2週間で公開可能。キャンペーンに間に合わせたい場合にも対応します
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 制作の流れ */}
      <section className={styles.flowSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>制作の流れ</h2>
          <div className={styles.flowList}>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>1</div>
              <div className={styles.flowContent}>
                <h3>ヒアリング</h3>
                <p>目的、ターゲット、ゴールを明確化。競合分析も実施</p>
              </div>
            </div>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>2</div>
              <div className={styles.flowContent}>
                <h3>構成・デザイン提案</h3>
                <p>コンバージョンを意識した設計。ワイヤーフレームで確認</p>
              </div>
            </div>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>3</div>
              <div className={styles.flowContent}>
                <h3>コーディング・最適化</h3>
                <p>高速表示、AIO対策、レスポンシブ対応を実装</p>
              </div>
            </div>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>4</div>
              <div className={styles.flowContent}>
                <h3>テスト・公開</h3>
                <p>動作確認、表示速度チェック、最終調整後に公開</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>成果を出すLPを作りませんか？</h2>
          <p className={styles.ctaDescription}>
            AIで量産されるLPとは一線を画す、<br />
            技術と戦略に裏付けされたランディングページを制作します。
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
