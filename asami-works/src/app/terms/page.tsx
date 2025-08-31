import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '@/styles/terms.module.css'

export const metadata: Metadata = {
  title: '利用規約 | AsamiWorks',
  description: 'AsamiWorksのサービス利用規約。ホームページ制作サービスのご利用にあたっての規約を定めています。',
}

export default function TermsOfServicePage() {
  return (
    <main className={styles.termsMain}>
      <div className={styles.termsContainer}>
        {/* ヘッダー */}
        <div className={styles.termsHeader}>
          <h1 className={styles.termsTitle}>利用規約</h1>
          <p className={styles.termsLastUpdated}>最終更新日：2024年3月1日</p>
        </div>

        {/* 本文 */}
        <div className={styles.termsContent}>
          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第1条（適用）</h2>
            <p className={styles.termsText}>
              本規約は、AsamiWorks（以下、「当社」といいます。）が提供するホームページ制作サービス
              およびその他の関連サービス（以下、「本サービス」といいます。）の利用条件を定めるものです。
              お客様は、本規約に同意した上で、本サービスをご利用いただきます。
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第2条（定義）</h2>
            <p className={styles.termsText}>本規約において、以下の用語の意味は次の通りとします。</p>
            <ol className={styles.termsOrderedList}>
              <li>「お客様」とは、当社との間で本サービスの利用契約を締結した法人または個人をいいます。</li>
              <li>「成果物」とは、本サービスによって制作されたウェブサイト、デザイン、プログラムその他一切の制作物をいいます。</li>
              <li>「利用契約」とは、本規約に基づく当社とお客様との間の本サービスの利用に関する契約をいいます。</li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第3条（サービス内容）</h2>
            <ol className={styles.termsOrderedList}>
              <li>当社は、お客様に対し、以下のサービスを提供します。
                <ul className={styles.termsUnorderedList}>
                  <li>ホームページの企画・デザイン・制作</li>
                  <li>ランディングページの制作</li>
                  <li>既存ウェブサイトの改修・更新</li>
                  <li>SEO対策サービス</li>
                  <li>保守・運用サポート</li>
                  <li>その他、当社が定めるサービス</li>
                </ul>
              </li>
              <li>サービスの詳細内容、制作期間、料金等は、個別の契約において定めるものとします。</li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第4条（契約の成立）</h2>
            <ol className={styles.termsOrderedList}>
              <li>お客様が当社所定の方法により本サービスの利用を申し込み、当社がこれを承諾したときに、利用契約が成立するものとします。</li>
              <li>当社は、以下の場合には利用申込を承諾しないことがあります。
                <ul className={styles.termsUnorderedList}>
                  <li>申込内容に虚偽の記載がある場合</li>
                  <li>過去に当社との契約に違反したことがある場合</li>
                  <li>その他、当社が不適当と判断した場合</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第5条（料金および支払方法）</h2>
            <ol className={styles.termsOrderedList}>
              <li>お客様は、本サービスの対価として、当社が別途定める料金を支払うものとします。</li>
              <li>支払方法および支払期限は、個別の契約において定めるものとします。</li>
              <li>お客様が支払期限までに料金を支払わない場合、当社は本サービスの提供を停止することができます。</li>
              <li>お客様は、支払いを遅延した場合、年14.6%の遅延損害金を支払うものとします。</li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第6条（お客様の協力義務）</h2>
            <p className={styles.termsText}>
              お客様は、当社が本サービスを提供するにあたり、以下の事項について協力するものとします。
            </p>
            <ol className={styles.termsOrderedList}>
              <li>制作に必要な資料、素材、情報等の提供</li>
              <li>制作内容の確認および承認</li>
              <li>その他、当社が必要と認める事項</li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第7条（知的財産権）</h2>
            <ol className={styles.termsOrderedList}>
              <li>成果物に関する著作権その他の知的財産権は、お客様が料金を完済した時点で、当社からお客様に譲渡されるものとします。
                  ただし、第三者が権利を有する素材等については、この限りではありません。</li>
              <li>当社は、成果物を自己の実績として公表することができるものとします。</li>
              <li>お客様から提供された素材等の知的財産権は、お客様に帰属します。</li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第8条（禁止事項）</h2>
            <p className={styles.termsText}>
              お客様は、本サービスの利用にあたり、以下の行為を行ってはならないものとします。
            </p>
            <ol className={styles.termsOrderedList}>
              <li>法令または公序良俗に違反する行為</li>
              <li>当社または第三者の知的財産権、プライバシー権、名誉権その他の権利を侵害する行為</li>
              <li>当社のサービス運営を妨害する行為</li>
              <li>虚偽の情報を提供する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第9条（保証の範囲）</h2>
            <ol className={styles.termsOrderedList}>
              <li>当社は、成果物が契約内容に適合することを保証します。</li>
              <li>前項の保証期間は、納品後30日間とします。</li>
              <li>当社は、本サービスおよび成果物について、お客様の特定の目的への適合性、期待する機能・商品的価値・正確性・有用性等を保証するものではありません。</li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第10条（免責事項）</h2>
            <ol className={styles.termsOrderedList}>
              <li>当社は、以下の事由によりお客様に生じた損害について、一切の責任を負わないものとします。
                <ul className={styles.termsUnorderedList}>
                  <li>お客様の指示または提供素材に起因する問題</li>
                  <li>第三者によるサイバー攻撃、不正アクセス等</li>
                  <li>天災地変その他の不可抗力</li>
                  <li>お客様の環境における不具合</li>
                </ul>
              </li>
              <li>当社の責に帰すべき事由によりお客様に損害が生じた場合、当社の賠償責任は、お客様から受領した料金の額を上限とします。</li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第11条（秘密保持）</h2>
            <ol className={styles.termsOrderedList}>
              <li>当社およびお客様は、本サービスの提供・利用に関して知り得た相手方の秘密情報を、第三者に開示・漏洩してはならないものとします。</li>
              <li>前項の義務は、利用契約終了後も継続するものとします。</li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第12条（契約の解除）</h2>
            <ol className={styles.termsOrderedList}>
              <li>当社は、お客様が以下のいずれかに該当する場合、催告なく直ちに利用契約を解除することができます。
                <ul className={styles.termsUnorderedList}>
                  <li>本規約に違反した場合</li>
                  <li>料金の支払いを遅延した場合</li>
                  <li>その他、信頼関係を著しく毀損する行為があった場合</li>
                </ul>
              </li>
              <li>前項により契約が解除された場合、お客様は当社に対する一切の債務について期限の利益を失い、直ちに債務を履行するものとします。</li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第13条（規約の変更）</h2>
            <p className={styles.termsText}>
              当社は、必要と判断した場合、お客様への事前の通知なく本規約を変更することができます。
              変更後の規約は、当社ウェブサイトに掲載した時点から効力を生じるものとし、
              お客様は変更後の規約に同意したものとみなされます。
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第14条（準拠法および管轄裁判所）</h2>
            <ol className={styles.termsOrderedList}>
              <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
              <li>本サービスに関して紛争が生じた場合、当社の所在地を管轄する裁判所を専属的合意管轄とします。</li>
            </ol>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>第15条（協議事項）</h2>
            <p className={styles.termsText}>
              本規約に定めのない事項または本規約の解釈に疑義が生じた場合は、
              当社とお客様は誠意をもって協議し、解決するものとします。
            </p>
          </section>

          <section className={styles.termsDividerSection}>
            <p>
              <strong>制定日：</strong>2024年3月1日<br />
              <strong>AsamiWorks</strong>
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className={styles.termsCta}>
          <h3 className={styles.termsCtaTitle}>
            補助金を活用してコストを抑えたホームページ制作を
          </h3>
          <p className={styles.termsCtaText}>
            小規模事業者持続化補助金で最大66.7%（上限50万円）の費用削減が可能です
          </p>
          <div className={styles.termsCtaButtons}>
            <Link
              href="/form"
              className={`${styles.termsCtaButton} ${styles.termsCtaPrimary}`}
            >
              無料相談はこちら
            </Link>
            <Link
              href="/"
              className={`${styles.termsCtaButton} ${styles.termsCtaSecondary}`}
            >
              サービス詳細を見る
            </Link>
          </div>
        </div>

        {/* 関連リンク */}
        <div className={styles.termsRelatedLinks}>
          <p>
            <Link href="/privacy" className={styles.termsRelatedLink}>プライバシーポリシー</Link>
            もあわせてご確認ください
          </p>
        </div>
      </div>
    </main>
  )
}