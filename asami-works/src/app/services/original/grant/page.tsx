import { Metadata } from 'next';
import styles from "./GrantService.module.css";
import RelatedLinks from "@/components/RelatedLinks";

export const metadata: Metadata = {
  title: '小規模事業者持続化補助金対応サイト制作 | AsamiWorks',
  description: '補助金を活用して最大50万円（インボイス特例適用で最大100万円）の費用削減。申請書類作成から採択後のフォローまで完全サポート。茨城・千葉対応。',
  keywords: ['小規模事業者持続化補助金', '補助金', 'ホームページ制作', 'Web制作', '補助金申請', '茨城', '千葉'],
  openGraph: {
    title: '小規模事業者持続化補助金対応サイト制作 | AsamiWorks',
    description: '補助金を活用して最大100万円の費用削減。申請書類作成から完全サポート',
    url: 'https://asami-works.com/services/grant',
    siteName: 'AsamiWorks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '補助金対応サイト制作 | AsamiWorks',
    description: '小規模事業者持続化補助金で最大100万円の費用削減',
  },
  alternates: {
    canonical: '/services/grant',
  },
};

export default function GrantServicePage() {
  return (
    <div className={styles.container}>
      {/* ヒーローセクション */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            小規模事業者持続化補助金対応
            <br />
            ホームページ制作
          </h1>
          <p className={styles.heroDescription}>
            補助金活用で最大50万円（インボイス特例の場合は最大100万円）の費用削減が可能
          </p>
          <p className={styles.heroNote}>
            ※補助率2/3の補助額が上限となります
          </p>
          <p className={styles.heroNote}>
            ※補助金の採択は審査があり、必ず受給できるものではありません
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
          <h2 className={styles.sectionTitle}>補助金活用時の費用イメージ</h2>
          <div className={styles.priceCard}>
            <div className={styles.priceCompare}>
              <div className={styles.priceOriginal}>
                <p>通常価格（税抜）</p>
                <p>700,000円</p>
              </div>
              <div className={styles.priceArrow}>→</div>
              <div className={styles.priceDiscounted}>
                <p>補助金適用後（目安）</p>
                <p className={styles.priceAmount}>270,000円〜</p>
                <p>※通常枠（上限50万円）適用時</p>
              </div>
            </div>
            <div className={styles.priceWarning}>
              <p>
                <strong>重要：</strong>補助金の採択には審査があります。採択を保証するものではありません。不採択の場合でも、お客様のご予算に応じた別プランをご提案いたします。
              </p>
              <p className={styles.priceWarningSecond}>
                <strong>補助金について：</strong>補助率2/3、通常枠の上限50万円。本プラン（税込770,000円）の場合、補助額は上限の50万円となります。インボイス特例適用時は上限100万円ですが、本プランでは補助額約51.3万円（770,000円×2/3）となります。
              </p>
            </div>
            <div className={styles.invoiceSpecial}>
              <h3>インボイス特例の場合</h3>
              <div className={styles.invoiceContent}>
                <p className={styles.invoiceAmount}>最大100万円</p>
                <p className={styles.invoiceNote}>
                  インボイス発行事業者に転換した事業者は補助上限額が100万円にアップ<br />
                  （本プランの場合、実質負担額：約256,700円・税込）
                </p>
                <div className={styles.invoiceCondition}>
                  <p>※インボイス特例の対象期間等の詳細は公募要領をご確認ください</p>
                </div>
              </div>
            </div>
            <div className={styles.priceIncludes}>
              <p><strong>基本プランに含まれるもの：</strong></p>
              <ul>
                <li>・WordPress導入（自社更新可能）</li>
                <li>・トップページ</li>
                <li>・会社概要ページ</li>
                <li>・事業内容ページ</li>
                <li>・お問い合わせページ（フォーム付き）</li>
                <li>・スマホ・タブレット対応</li>
                <li>・内部SEO対策</li>
                <li>・SSL証明書設定</li>
                <li>・Google Analytics設定</li>
                <li>・基本的な更新マニュアル</li>
                <li>・現場出張費（関東圏内）</li>
              </ul>
              <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#666' }}>
                ※関東圏外の場合は別途お見積もりとなります
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 柔軟なプラン選択セクション */}
      <section className={styles.planSelectionSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>採択結果に応じた柔軟なプラン選択</h2>
          <p className={styles.planDescription}>
            補助金申請の結果に関わらず、お客様に最適なプランをご提供します
          </p>
          <div className={styles.planFlowContainer}>
            <div className={styles.planPhase}>
              <div className={styles.phaseTitle}>
                <span className={styles.phaseNumber}>STEP 1</span>
                <h3>申請段階</h3>
              </div>
              <div className={styles.phaseContent}>
                <p className={styles.phaseMain}>無料相談・申請サポート</p>
                <p className={styles.phaseSub}>採択結果待ち（料金発生なし）</p>
              </div>
            </div>
            
            <div className={styles.planArrowDown}>↓</div>
            
            <div className={styles.planPhase}>
              <div className={styles.phaseTitle}>
                <span className={styles.phaseNumber}>STEP 2</span>
                <h3>採択結果発表</h3>
              </div>
              <div className={styles.phaseContent}>
                <p className={styles.phaseMain}>審査結果に応じてプラン選択</p>
              </div>
            </div>
            
            <div className={styles.planBranch}>
              <div className={`${styles.planOption} ${styles.planSuccess}`}>
                <div className={styles.optionHeader}>
                  <span className={`${styles.optionBadge} ${styles.success}`}>採択された場合</span>
                  <h4>補助金対応プラン</h4>
                </div>
                <div className={styles.optionContent}>
                  <p className={styles.optionPrice}>
                    <span className={styles.originalPrice}>700,000円（税抜）</span>
                    <span className={styles.arrow}>→</span>
                    <span className={styles.actualPrice}>実質270,000円〜</span>
                  </p>
                  <ul className={styles.optionFeatures}>
                    <li>補助金要件に完全対応</li>
                    <li>WordPress導入（更新可能）</li>
                    <li>実績報告サポート付き</li>
                  </ul>
                </div>
              </div>
              
              <div className={`${styles.planOption} ${styles.planAlternative}`}>
                <div className={styles.optionHeader}>
                  <span className={`${styles.optionBadge} ${styles.alternative}`}>不採択の場合</span>
                  <h4>オリジナルWEBサイト制作プラン</h4>
                </div>
                <div className={styles.optionContent}>
                  <p className={styles.optionPrice}>
                    <span className={styles.rangePrice}>600,000円〜（税抜）</span>
                  </p>
                  <ul className={styles.optionFeatures}>
                    <li>補助金要件に縛られない柔軟な制作</li>
                    <li>ご予算に応じたプラン選択</li>
                    <li>最短納期での制作も可能</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.planNote}>
            <p>
              <strong>安心ポイント：</strong>採択結果が出るまで料金は発生しません。
              不採択でも、ご予算に応じた最適なプランをご提案いたします。
            </p>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>このプランの特徴</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>WordPress導入で自社更新可能</h3>
              <p className={styles.featureDescription}>
                補助金要件に対応したWordPressを導入。直感的な管理画面で、お知らせやブログ、商品情報などを自社で簡単に更新できます。
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>申請書類作成サポート</h3>
              <p className={styles.featureDescription}>
                複雑な補助金申請書類の作成を徹底サポート。採択率を高めるポイントを押さえた申請書を作成します。
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>要件適合保証</h3>
              <p className={styles.featureDescription}>
                補助金の要件に完全適合したサイト制作。採択後の検査にも確実に対応できる仕様で制作します。
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>採択後フォロー</h3>
              <p className={styles.featureDescription}>
                採択後の実績報告書作成もサポート。補助金受給まで責任を持ってフォローします。
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>更新マニュアル付き</h3>
              <p className={styles.featureDescription}>
                WordPressの使い方を丁寧に説明したマニュアルを提供。安心して運用を始められます。
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>成果測定ツール</h3>
              <p className={styles.featureDescription}>
                Google Analytics設定、コンバージョン測定など、補助金の効果測定に必要なツールを完備。
              </p>
            </div>
          </div>
        </div>
      </section>
      

      {/* オプション活用事例 */}
      <section className={styles.exampleSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>オプション活用事例</h2>
          <p className={styles.exampleSubtitle}>補助金を最大限活用したプラン例</p>
          
          <div className={styles.exampleGrid}>
            <div className={styles.exampleCard}>
              <div className={styles.exampleHeader}>
              <h3 className={styles.exampleTitle}>事例1：情報発信サイト</h3>
                <p className={styles.exampleTarget}>地域密着でPRしたいサービス業様向け</p>
              </div>
              <div className={styles.exampleContent}>
                <p className={styles.exampleDescription}>
                  ブログ機能とSNS連携で、継続的な情報発信。地域での認知度向上を実現。
                </p>
                <div className={styles.exampleBreakdown}>
                  <p className={styles.breakdownTitle}>プラン内訳（税抜）：</p>
                  <ul className={styles.breakdownList}>
                    <li>小規模事業者持続化補助金対応サイト: 700,000円</li>
                    <li>ページ追加（実績・スタッフ紹介）: 10,000円</li>
                    <li>Instagram連携・埋め込み: 150,000円</li>
                  </ul>
                  <p className={styles.exampleTotal}>
                    <span>合計</span>
                    <span className={styles.totalPrice}>860,000円</span>
                  </p>
                  <p className={styles.subsidyNote}>補助金適用後：実質446,000円〜</p>
                </div>
                <div className={styles.exampleCTA}>
                  <a href="/estimate?preset=grant_info" className={styles.exampleButton}>
                    この内容でサイト制作を依頼する
                  </a>
                </div>
              </div>
            </div>
            
            <div className={styles.exampleCard}>
              <div className={styles.exampleHeader}>

              <h3 className={styles.exampleTitle}>事例2：商品紹介サイト</h3>
                <p className={styles.exampleTarget}>商品の魅力を最大限に伝えたい製造業・小売業様向け</p>
              </div>
              <div className={styles.exampleContent}>
                <p className={styles.exampleDescription}>
                  商品ページと予約システムで、オンラインでの商談機会を創出。SNS連携で認知度も向上。
                </p>
                <div className={styles.exampleBreakdown}>
                  <p className={styles.breakdownTitle}>プラン内訳（税抜）：</p>
                  <ul className={styles.breakdownList}>
                    <li>小規模事業者持続化補助金対応サイト: 700,000円</li>
                    <li>セキュリティ強化対策: 30,000円</li>
                    <li>各商品ページ追加（5ページ追加）: 50,000円</li>


                    <li>広告出稿サポート: 30,000円</li>

                    <li>予約システム導入: 200,000円</li>

                  </ul>

                  <p className={styles.exampleTotal}>
                    <span>合計</span>
                    <span className={styles.totalPrice}>1,010,000円</span>
                  </p>
                  <p className={styles.subsidyNote}>補助金適用後：実質611,000円〜</p>
                </div>
                <div className={styles.exampleCTA}>
                  <a href="/estimate?preset=grant_product" className={styles.exampleButton}>
                    この内容でサイト制作を依頼する
                  </a>
                </div>
              </div>
            </div>
            
            <div className={styles.exampleCard}>
              <div className={styles.exampleHeader}>

              <h3 className={styles.exampleTitle}>事例3：高機能サイト</h3>
                <p className={styles.exampleTarget}>補助金を最大限活用したい中小企業様向け</p>
              </div>
              <div className={styles.exampleContent}>
                <p className={styles.exampleDescription}>
                  補助金の範囲内で高機能なサイトを実現。会員機能やメール配信で顧客との関係を強化。
                </p>
                <div className={styles.exampleBreakdown}>
                  <p className={styles.breakdownTitle}>プラン内訳（税抜）：</p>
                  <ul className={styles.breakdownList}>
                    <li>小規模事業者持続化補助金対応サイト: 700,000円</li>

                    <li>マイページ機能: 300,000円</li>
                    <li>決済機能: 600,000円</li>
                    <li>セキュリティ強化対策: 30,000円</li>
                    <li>メールマガジン配信: 50,000円</li>

                  </ul>

                  <p className={styles.exampleTotal}>
                    <span>合計</span>
                    <span className={styles.totalPrice}>1,680,000円</span>
                  </p>
                  <p className={styles.subsidyNote}>補助金適用後：実質1,348,000円〜</p>
                </div>
                <div className={styles.exampleCTA}>
                  <a href="/estimate?preset=grant_advanced" className={styles.exampleButton}>
                    この内容でサイト制作を依頼する
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.exampleNote}>
            <p>
              <strong>補助金の活用方法は企業様によって様々です。</strong><br />
              まずは無料相談で、貴社に最適なプランをご提案いたします。
            </p>
          </div>
        </div>
      </section>

      {/* 補助金の流れ */}
      <section className={styles.flowSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>補助金活用の流れ</h2>
          <div className={styles.flowList}>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>1</div>
              <div className={styles.flowContent}>
                <h3>無料相談・ヒアリング</h3>
                <p>補助金の要件確認とお客様のニーズをヒアリング</p>
              </div>
            </div>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>2</div>
              <div className={styles.flowContent}>
                <h3>申請書類作成</h3>
                <p>採択率を高める申請書類を共同で作成</p>
              </div>
            </div>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>3</div>
              <div className={styles.flowContent}>
                <h3>補助金申請</h3>
                <p>オンライン申請のサポート</p>
              </div>
            </div>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>4</div>
              <div className={styles.flowContent}>
                <h3>採択通知・制作開始</h3>
                <p>採択後、速やかにサイト制作を開始（不採択の場合は別プランをご提案）</p>
              </div>
            </div>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>5</div>
              <div className={styles.flowContent}>
                <h3>実績報告・補助金受給</h3>
                <p>実績報告書作成をサポートし、補助金受給まで伴走</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>補助金活用をご検討の方へ</h2>
          <p className={styles.ctaDescription}>
            まずは無料相談で補助金の要件確認から始めましょう。
          </p>
          <p className={styles.ctaNote}>
            申請には期限があります。採択は保証されませんが、しっかりとサポートいたします。
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