import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '@/styles/terms.module.css'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | AsamiWorks',
  description: 'AsamiWorksの特定商取引法に基づく表記。事業者情報、販売価格、支払方法、キャンセルポリシーなどを掲載しています。',
}

export default function TokushohoPage() {
  return (
    <main className={styles.termsMain}>
      <div className={styles.termsContainer}>
        {/* ヘッダー */}
        <div className={styles.termsHeader}>
          <h1 className={styles.termsTitle}>特定商取引法に基づく表記</h1>
          <p className={styles.termsLastUpdated}>最終更新日：2025年11月15日</p>
        </div>

        {/* 本文 */}
        <div className={styles.termsContent}>
          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>事業者名</h2>
            <p className={styles.termsText}>
              AsamiWorks
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>代表者</h2>
            <p className={styles.termsText}>
              浅見 洋輔（あさみ ようすけ）
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>所在地</h2>
            <p className={styles.termsText}>
              〒300-0341<br />
              茨城県稲敷郡阿見町うずら野4-21-2 パストラル宮岡第二108
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>電話番号</h2>
            <p className={styles.termsText}>
              080-6660-4032<br />
              <small>※営業時間: 10:00〜20:00（不定休）</small>
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>メールアドレス</h2>
            <p className={styles.termsText}>
              <a href="mailto:info@asami-works.com" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                info@asami-works.com
              </a>
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>ウェブサイトURL</h2>
            <p className={styles.termsText}>
              <a href="https://asami-works.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                https://asami-works.com
              </a>
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>事業内容</h2>
            <p className={styles.termsText}>
              ホームページ制作、ランディングページ制作、Webアプリケーション開発、Webデザイン、補助金申請サポート
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>販売価格</h2>
            <p className={styles.termsText}>
              各サービスページに記載の価格をご確認ください。<br />
              価格は税込表示です。
            </p>
            <ul className={styles.termsUnorderedList}>
              <li><Link href="/services/original" style={{ color: '#0066cc', textDecoration: 'underline' }}>オリジナルプラン</Link>: 個別見積もり</li>
              <li><Link href="/services/webapp" style={{ color: '#0066cc', textDecoration: 'underline' }}>Webアプリ開発</Link>: 個別見積もり</li>
            </ul>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>商品代金以外の必要料金</h2>
            <p className={styles.termsText}>
              以下の費用が別途発生する場合があります。
            </p>
            <ul className={styles.termsUnorderedList}>
              <li>ドメイン取得費用（お客様負担）</li>
              <li>サーバー利用料（お客様負担）</li>
              <li>有料素材・プラグイン利用料（使用する場合のみ）</li>
              <li>振込手数料（お客様負担）</li>
            </ul>
            <p className={styles.termsText}>
              ※上記費用が発生する場合は、事前にお見積りにてご提示いたします。
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>支払方法</h2>
            <p className={styles.termsText}>
              以下の支払方法に対応しております。
            </p>
            <ul className={styles.termsUnorderedList}>
              <li>クレジットカード決済（Stripe）</li>
              <li>銀行振込</li>
            </ul>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>支払時期</h2>
            <p className={styles.termsText}>
              原則として、以下の支払スケジュールとなります。
            </p>
            <ul className={styles.termsUnorderedList}>
              <li>オリジナルプラン: 着手金50%、納品時50%の分割払い</li>
              <li>Webアプリ開発: 個別契約による（着手金制または分割払い）</li>
            </ul>
            <p className={styles.termsText}>
              ※詳細は個別の契約書にて定めます。
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>サービス提供時期</h2>
            <p className={styles.termsText}>
              サービスの提供時期は以下の通りです。
            </p>
            <ul className={styles.termsUnorderedList}>
              <li>オリジナルプラン: ご契約後1〜3ヶ月程度（内容により変動）</li>
              <li>Webアプリ開発: 個別見積もり時にご提示</li>
            </ul>
            <p className={styles.termsText}>
              ※お客様からの資料提供やご確認のタイミングにより、納期が変動する場合があります。<br />
              ※詳細な納期は、個別の契約書にて定めます。
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>返品・キャンセルについて</h2>
            <p className={styles.termsText}>
              本サービスはデジタルコンテンツ制作というサービスの性質上、以下の通り定めます。
            </p>

            <h3 className={styles.termsSubSectionTitle}>契約前のキャンセル</h3>
            <p className={styles.termsText}>
              お見積りや契約前の段階でのキャンセルは、いつでも無料で可能です。
            </p>

            <h3 className={styles.termsSubSectionTitle}>制作開始後のキャンセル</h3>
            <ul className={styles.termsUnorderedList}>
              <li>着手金お支払い後のキャンセル: 着手金の返金は致しかねます</li>
              <li>制作途中でのキャンセル: それまでに発生した作業分の費用をご請求させていただきます</li>
              <li>お客様都合による大幅な仕様変更: 追加料金が発生する場合があります</li>
            </ul>

            <h3 className={styles.termsSubSectionTitle}>納品後の返品</h3>
            <p className={styles.termsText}>
              サービスの性質上、納品後の返品はお受けできません。<br />
              ただし、契約内容と著しく異なる場合や、重大な瑕疵がある場合は、無償で修正対応いたします。
            </p>

            <h3 className={styles.termsSubSectionTitle}>保証期間</h3>
            <p className={styles.termsText}>
              納品後30日間は、契約内容に基づく不具合について無償で修正対応いたします。
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>引渡し方法</h2>
            <p className={styles.termsText}>
              完成したウェブサイトは、以下の方法で引き渡しいたします。
            </p>
            <ul className={styles.termsUnorderedList}>
              <li>お客様が用意されたサーバーへのアップロード</li>
              <li>ファイル一式のオンライン納品（Googleドライブ等）</li>
              <li>GitHub等のバージョン管理システムでの納品</li>
            </ul>
            <p className={styles.termsText}>
              ※引渡し方法は、ご契約時に協議の上決定いたします。
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2 className={styles.termsSectionTitle}>お問い合わせ先</h2>
            <p className={styles.termsText}>
              本表記内容に関するお問い合わせは、以下までご連絡ください。
            </p>
            <ul className={styles.termsUnorderedList}>
              <li>メール: <a href="mailto:info@asami-works.com" style={{ color: '#0066cc', textDecoration: 'underline' }}>info@asami-works.com</a></li>
              <li>電話: 080-6660-4032（営業時間: 10:00〜20:00）</li>
              <li>お問い合わせフォーム: <Link href="/form" style={{ color: '#0066cc', textDecoration: 'underline' }}>こちら</Link></li>
            </ul>
          </section>

          <section className={styles.termsDividerSection}>
            <p>
              <strong>制定日：</strong>2025年11月15日<br />
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
            ・
            <Link href="/terms" className={styles.termsRelatedLink}>利用規約</Link>
            もあわせてご確認ください
          </p>
        </div>
      </div>
    </main>
  )
}
