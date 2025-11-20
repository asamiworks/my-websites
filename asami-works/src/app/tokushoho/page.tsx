import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './tokushoho.module.css'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | AsamiWorks',
  description: 'AsamiWorksの特定商取引法に基づく表記。事業者情報、販売価格、支払方法、キャンセルポリシーなどを掲載しています。',
}

export default function TokushohoPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* ヘッダー */}
        <div className={styles.header}>
          <h1 className={styles.title}>特定商取引法に基づく表記</h1>
          <p className={styles.lastUpdated}>最終更新：2025年11月20日</p>
        </div>

        {/* 事業者情報カード */}
        <div className={styles.businessCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>事業者情報</h2>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.infoTable}>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>事業者名</div>
                <div className={styles.infoValue}>浅見 洋輔（あさみ ようすけ）</div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>屋号</div>
                <div className={styles.infoValue}>AsamiWorks</div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>所在地</div>
                <div className={styles.infoValue}>
                  〒300-0341<br />
                  茨城県稲敷郡阿見町うずら野4-21-2<br />
                  パストラル宮岡第二108
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>電話番号</div>
                <div className={styles.infoValue}>
                  080-6660-4032
                  <small>営業時間: 10:00〜20:00（不定休）</small>
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>メールアドレス</div>
                <div className={styles.infoValue}>
                  <a href="mailto:info@asami-works.com">info@asami-works.com</a>
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>URL</div>
                <div className={styles.infoValue}>
                  <a href="https://asami-works.com" target="_blank" rel="noopener noreferrer">
                    https://asami-works.com
                  </a>
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>事業内容</div>
                <div className={styles.infoValue}>
                  ホームページ制作、ランディングページ制作、<br />
                  Webアプリケーション開発、Webデザイン、<br />
                  補助金申請サポート
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 販売価格 */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>販売価格</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionText}>
              各サービスページに記載の価格をご確認ください。当事業者は免税事業者のため、消費税の請求はありません。
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.listBullet}></span>
                <span>
                  <Link href="/services/original" className={styles.listItemLink}>オリジナルプラン</Link>
                  ：個別見積もり
                </span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.listBullet}></span>
                <span>
                  <Link href="/services/webapp" className={styles.listItemLink}>Webアプリ開発</Link>
                  ：個別見積もり
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 商品代金以外の必要料金 */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>商品代金以外の必要料金</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionText}>
              以下の費用が別途発生する場合があります。
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.listBullet}></span>
                <span>ドメイン取得費用（お客様負担）</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.listBullet}></span>
                <span>サーバー利用料（お客様負担）</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.listBullet}></span>
                <span>有料素材・プラグイン利用料（使用する場合のみ）</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.listBullet}></span>
                <span>振込手数料（お客様負担）</span>
              </li>
            </ul>
            <p className={styles.sectionText}>
              ※上記費用が発生する場合は、事前にお見積りにてご提示いたします。
            </p>
          </div>
        </div>

        {/* 支払方法・支払時期 */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>支払方法・支払時期</h2>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>支払方法</h3>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.listBullet}></span>
                  <span>クレジットカード決済（Stripe）<br />
                    <small style={{ color: '#6b7280', marginLeft: '1rem' }}>
                      対応ブランド：Visa / Mastercard / JCB / American Express
                    </small>
                  </span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.listBullet}></span>
                  <span>銀行振込</span>
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>支払時期</h3>
              <p className={styles.sectionText}>
                原則として、以下の支払スケジュールとなります。
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.listBullet}></span>
                  <span>オリジナルプラン：着手金50%、納品時50%の分割払い</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.listBullet}></span>
                  <span>Webアプリ開発：個別契約による（着手金制または分割払い）</span>
                </li>
              </ul>
              <p className={styles.sectionText}>
                ※詳細は個別の契約書にて定めます。
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>決済期間</h3>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.listBullet}></span>
                  <span>クレジットカード決済：決済完了後、ただちに処理されます</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.listBullet}></span>
                  <span>銀行振込：請求書発行後、14日以内にお振込みください</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* サービス提供時期 */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>サービス提供時期</h2>
          </div>
          <div className={styles.sectionBody}>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.listBullet}></span>
                <span>オリジナルプラン：ご契約後1〜3ヶ月程度（内容により変動）</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.listBullet}></span>
                <span>Webアプリ開発：個別見積もり時にご提示</span>
              </li>
            </ul>
            <p className={styles.sectionText}>
              ※お客様からの資料提供やご確認のタイミングにより、納期が変動する場合があります。<br />
              ※詳細な納期は、個別の契約書にて定めます。
            </p>
          </div>
        </div>

        {/* 返品・キャンセルについて */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>返品・キャンセルについて</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionText}>
              本サービスはデジタルコンテンツ制作というサービスの性質上、以下の通り定めます。
            </p>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>契約前のキャンセル</h3>
              <p className={styles.sectionText}>
                お見積りや契約前の段階でのキャンセルは、いつでも無料で可能です。
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>制作開始後のキャンセル</h3>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.listBullet}></span>
                  <span>着手金お支払い後のキャンセル：着手金の返金は致しかねます</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.listBullet}></span>
                  <span>制作途中でのキャンセル：それまでに発生した作業分の費用をご請求させていただきます</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.listBullet}></span>
                  <span>お客様都合による大幅な仕様変更：追加料金が発生する場合があります</span>
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>納品後の返品</h3>
              <p className={styles.sectionText}>
                サービスの性質上、納品後の返品はお受けできません。<br />
                ただし、契約内容と著しく異なる場合や、重大な瑕疵がある場合は、無償で修正対応いたします。
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>保証期間</h3>
              <p className={styles.sectionText}>
                納品後30日間は、契約内容に基づく不具合について無償で修正対応いたします。
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>クレジットカード決済の返金について</h3>
              <p className={styles.sectionText}>
                当社の責めに帰すべき事由により返金が発生した場合は、クレジットカードへの返金処理を行います。
                返金処理後、お客様のカード会社の締め日により、実際の返金までに1〜2ヶ月程度かかる場合があります。
              </p>
            </div>
          </div>
        </div>

        {/* 引渡し方法 */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>引渡し方法</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionText}>
              完成したウェブサイトは、以下の方法で引き渡しいたします。
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.listBullet}></span>
                <span>お客様が用意されたサーバーへのアップロード</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.listBullet}></span>
                <span>ファイル一式のオンライン納品（Googleドライブ等）</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.listBullet}></span>
                <span>GitHub等のバージョン管理システムでの納品</span>
              </li>
            </ul>
            <p className={styles.sectionText}>
              ※引渡し方法は、ご契約時に協議の上決定いたします。
            </p>
          </div>
        </div>

        {/* お問い合わせ先 */}
        <div className={`${styles.sectionCard} ${styles.contactCard}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>お問い合わせ先</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionText}>
              本表記内容に関するお問い合わせは、以下までご連絡ください。
            </p>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                メール：<a href="mailto:info@asami-works.com">info@asami-works.com</a>
              </div>
              <div className={styles.contactItem}>
                電話：080-6660-4032（営業時間: 10:00〜20:00）
              </div>
              <div className={styles.contactItem}>
                フォーム：<Link href="/form">お問い合わせフォーム</Link>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <p className={styles.footerText}>
              <strong>制定日：</strong>2025年11月15日<br />
              <strong>AsamiWorks</strong>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <h3 className={styles.ctaTitle}>
            補助金を活用してコストを抑えたホームページ制作を
          </h3>
          <p className={styles.ctaText}>
            小規模事業者持続化補助金で最大66.7%（上限50万円）の費用削減が可能です
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/form" className={`${styles.ctaButton} ${styles.ctaPrimary}`}>
              無料相談はこちら
            </Link>
            <Link href="/" className={`${styles.ctaButton} ${styles.ctaSecondary}`}>
              サービス詳細を見る
            </Link>
          </div>
        </div>

        {/* 関連リンク */}
        <div className={styles.relatedLinks}>
          <p>
            <Link href="/privacy" className={styles.relatedLink}>プライバシーポリシー</Link>
            ・
            <Link href="/terms" className={styles.relatedLink}>利用規約</Link>
            もあわせてご確認ください
          </p>
        </div>
      </div>
    </main>
  )
}
