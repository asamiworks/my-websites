import Head from "next/head";
import styles from "./LandingPageService.module.css";
import RelatedLinks from "@/components/RelatedLinks";

export default function LandingPageService() {
  return (
    <>
      <Head>
        <title>ランディングページ制作 | AsamiWorks</title>
        <meta name="description" content="コンバージョン特化の1ページ完結型サイト。A/Bテスト対応で成果を最大化。220,000円〜" />
      </Head>

      <div className={styles.container}>
        {/* ヒーローセクション */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              成果にコミットする
              <br />
              ランディングページ制作
            </h1>
            <p className={styles.heroDescription}>
              1ページに集約した、WEBで随一のセールスマン
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
            <h2 className={styles.sectionTitle}>明確でシンプルな価格設定</h2>
            <div className={styles.priceCard}>
              <div>
                <p className={styles.priceAmount}>220,000円〜</p>
                <p className={styles.priceNote}>制作費用（税込）</p>
              </div>
              <div className={styles.priceDivider}>
                <p className={styles.priceIncludes}>料金に含まれるもの：</p>
                <ul className={styles.includesList}>
                  <li>オリジナルデザイン制作</li>
                  <li>スマホ・タブレット対応</li>
                  <li>電話番号・メールアドレス設置</li>
                  <li>基本的なSEO対策</li>
                </ul>
                <p className={styles.optionNote}>
                  ※お問い合わせフォームの設置は別途33,000円のオプションとなります
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section id="features" className={styles.featuresSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>ランディングページ制作の特徴</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>コンバージョン特化設計</h3>
                <p className={styles.featureDescription}>
                  ユーザー心理を考慮した導線設計で、問い合わせや購入などの成果を最大化します。
                </p>
              </div>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>高速表示の実現</h3>
                <p className={styles.featureDescription}>
                  最新の技術で表示速度を最適化。離脱率を低減し、ユーザー体験を向上させます。
                </p>
              </div>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>完全レスポンシブ対応</h3>
                <p className={styles.featureDescription}>
                  スマートフォン、タブレット、PCすべてで最適な表示。どのデバイスでも成果を出します。
                </p>
              </div>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>A/Bテスト対応</h3>
                <p className={styles.featureDescription}>
                  複数のパターンを比較検証し、より効果の高いデザインへと改善していけます。
                </p>
              </div>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>SEO基本対策込み</h3>
                <p className={styles.featureDescription}>
                  検索エンジンからの流入も考慮。適切なメタ情報設定と構造化データを実装します。
                </p>
              </div>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>最短2週間で公開</h3>
                <p className={styles.featureDescription}>
                  スピーディーな制作体制で、キャンペーンに間に合わせたい場合にも対応可能です。
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
                <h3 className={styles.exampleTitle}>事例1：BtoB資料請求LP</h3>
                  <p className={styles.exampleTarget}>質の高いリードを効率的に獲得したい企業様向け</p>
                </div>
                <div className={styles.exampleContent}>
                  <p className={styles.exampleDescription}>
                    SEO内部対策でオーガニック流入も狙い、長期的なリード獲得基盤を構築。
                  </p>
                  <div className={styles.exampleBreakdown}>
                    <p className={styles.breakdownTitle}>プラン内訳：</p>
                    <ul className={styles.breakdownList}>
                      <li>ランディングページ制作: 220,000円</li>
                      <li>お問い合わせフォーム設置: 33,000円</li>
                      <li>SEO技術対策:0円（標準使用）</li>
                      
                    </ul>
                    <p className={styles.exampleTotal}>
                      <span>合計</span>
                      <span className={styles.totalPrice}>253,000円</span>
                    </p>
                    <a href="/estimate?preset=btob" className={styles.exampleCTA}>
                      この内容でサイト制作を依頼する
                    </a>
                  </div>
                </div>
              </div>
              
              <div className={styles.exampleCard}>
                <div className={styles.exampleHeader}>
                <h3 className={styles.exampleTitle}>事例2：広告運用特化型LP</h3>
                  <p className={styles.exampleTarget}>広告運用で成果を最大化したい企業様向け</p>
                </div>
                <div className={styles.exampleContent}>
                  <p className={styles.exampleDescription}>
                    広告からの流入を確実に成果につなげる、効果測定可能なLPを構築。
                  </p>
                  <div className={styles.exampleBreakdown}>
                    <p className={styles.breakdownTitle}>プラン内訳：</p>
                    <ul className={styles.breakdownList}>
                      <li>ランディングページ制作: 220,000円</li>
                      <li>Google Analytics設定: 22,000円</li>
                      <li>広告出稿サポート: 33,000円</li>
                      <li>CTA設置（Instagram,LINE）: 0円</li>
                      
                      
                    </ul>
                    <p className={styles.exampleTotal}>
                      <span>合計</span>
                      <span className={styles.totalPrice}>275,000円</span>
                    </p>
                    <a href="/estimate?preset=ad" className={styles.exampleCTA}>
                      この内容でサイト制作を依頼する
                    </a>
                    
                  </div>
                </div>
              </div>
              
              <div className={styles.exampleCard}>
                <div className={styles.exampleHeader}>
                  <h3 className={styles.exampleTitle}>事例3：高機能商品販売LP</h3>
                  <p className={styles.exampleTarget}>ECサイト並みの機能を1ページで実現したい企業様向け</p>
                </div>
                <div className={styles.exampleContent}>
                  <p className={styles.exampleDescription}>
                    商品の魅力を最大限に伝え、セキュアな申込環境で購入率を向上。
                  </p>
                  <div className={styles.exampleBreakdown}>
                    <p className={styles.breakdownTitle}>プラン内訳：</p>
                    <ul className={styles.breakdownList}>
                      <li>ランディングページ制作: 220,000円</li>
                      <li>お問い合わせフォーム設置: 33,000円</li>
                      <li>セキュリティ強化対策: 33,000円</li>
                      <li>ライティング代行（商品説明）: 22,000円</li>
                      <li>Instagram連携・埋め込み: 66,000円</li>
                    </ul>
                    <p className={styles.exampleTotal}>
                      <span>合計</span>
                      <span className={styles.totalPrice}>374,000円</span>
                    </p>
                    <a href="/estimate?preset=ec" className={styles.exampleCTA}>
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
                <h3 className={styles.targetTitle}>新商品・サービスのプロモーション</h3>
                <p className={styles.targetDescription}>特定の商品やサービスに特化したページで、効果的にアピールしたい方</p>
              </div>
              <div className={styles.targetItem}>
                <h3 className={styles.targetTitle}>Web広告との連携</h3>
                <p className={styles.targetDescription}>Google広告やSNS広告からの流入を、確実に成果につなげたい方</p>
              </div>
              <div className={styles.targetItem}>
                <h3 className={styles.targetTitle}>イベント・キャンペーンの告知</h3>
                <p className={styles.targetDescription}>期間限定のキャンペーンやイベントの申込みを効率的に集めたい方</p>
              </div>
              <div className={styles.targetItem}>
                <h3 className={styles.targetTitle}>コストを抑えて始めたい</h3>
                <p className={styles.targetDescription}>まずは1ページから始めて、効果を確認しながら展開したい方</p>
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
                  <h3>ヒアリング（1-2日）</h3>
                  <p>目的、ターゲット、ゴールを明確化</p>
                </div>
              </div>
              <div className={styles.flowItem}>
                <div className={styles.flowNumber}>2</div>
                <div className={styles.flowContent}>
                  <h3>構成・デザイン提案（3-5日）</h3>
                  <p>コンバージョンを意識した設計</p>
                </div>
              </div>
              <div className={styles.flowItem}>
                <div className={styles.flowNumber}>3</div>
                <div className={styles.flowContent}>
                  <h3>コーディング（5-7日）</h3>
                  <p>高速表示とレスポンシブ対応</p>
                </div>
              </div>
              <div className={styles.flowItem}>
                <div className={styles.flowNumber}>4</div>
                <div className={styles.flowContent}>
                  <h3>テスト・公開（1-2日）</h3>
                  <p>動作確認と最終調整</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>成果を出すランディングページを作りませんか？</h2>
            <p className={styles.ctaDescription}>
              まずは無料相談で、あなたのビジネスに最適な提案をさせていただきます。
            </p>
            <a href="/form" className={styles.ctaButton}>
              無料相談を予約する
            </a>
          </div>
        </section>
      </div>
      <RelatedLinks />
    </>
  );
}