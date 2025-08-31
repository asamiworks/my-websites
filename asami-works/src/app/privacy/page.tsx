import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '@/styles/privacy.module.css'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | AsamiWorks',
  description: 'AsamiWorksのプライバシーポリシー。個人情報の取り扱いについて詳しくご説明します。',
}

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.privacyMain}>
      <div className={styles.privacyContainer}>
        {/* ヘッダー */}
        <div className={styles.privacyHeader}>
          <h1 className={styles.privacyTitle}>プライバシーポリシー</h1>
          <p className={styles.privacyLastUpdated}>最終更新日：2024年3月1日</p>
        </div>

        {/* 本文 */}
        <div className={styles.privacyContent}>
          <section className={styles.privacySection}>
            <h2 className={styles.privacySectionTitle}>はじめに</h2>
            <p className={styles.privacyText}>
              AsamiWorks（以下、「当社」といいます。）は、お客様の個人情報の重要性を認識し、
              その保護の徹底を図ることを目的として、以下のプライバシーポリシーを定めます。
            </p>
          </section>

          <section className={styles.privacySection}>
            <h2 className={styles.privacySectionTitle}>1. 個人情報の収集</h2>
            <p className={styles.privacyText}>
              当社は、以下の場合に個人情報を収集することがあります：
            </p>
            <ul className={styles.privacyList}>
              <li>お問い合わせフォームからのご連絡時</li>
              <li>サービスのお申し込み時</li>
              <li>資料請求時</li>
              <li>メールマガジン登録時</li>
              <li>その他、お客様から直接提供いただく場合</li>
            </ul>
          </section>

          <section className={styles.privacySection}>
            <h2 className={styles.privacySectionTitle}>2. 収集する情報の種類</h2>
            <p className={styles.privacyText}>
              当社が収集する個人情報には以下が含まれます：
            </p>
            <ul className={styles.privacyList}>
              <li>氏名</li>
              <li>会社名・組織名</li>
              <li>メールアドレス</li>
              <li>電話番号</li>
              <li>住所</li>
              <li>お問い合わせ内容</li>
              <li>その他、お客様が任意で提供される情報</li>
            </ul>
          </section>

          <section className={styles.privacySection}>
            <h2 className={styles.privacySectionTitle}>3. 個人情報の利用目的</h2>
            <p className={styles.privacyText}>
              収集した個人情報は、以下の目的で利用いたします：
            </p>
            <ul className={styles.privacyList}>
              <li>お問い合わせへの回答</li>
              <li>サービスの提供および運営</li>
              <li>契約の履行</li>
              <li>アフターサービスの提供</li>
              <li>新サービスや更新情報のご案内</li>
              <li>マーケティング調査および分析</li>
              <li>法令に基づく対応</li>
            </ul>
          </section>

          <section className={styles.privacySection}>
            <h2 className={styles.privacySectionTitle}>4. 個人情報の第三者提供</h2>
            <p className={styles.privacyText}>
              当社は、以下の場合を除き、お客様の個人情報を第三者に提供することはありません：
            </p>
            <ul className={styles.privacyList}>
              <li>お客様の同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
            </ul>
          </section>

          <section className={styles.privacySection}>
            <h2 className={styles.privacySectionTitle}>5. 個人情報の安全管理</h2>
            <p className={styles.privacyText}>
              当社は、個人情報の紛失、破壊、改ざん及び漏洩などのリスクに対して、
              技術的および組織的な安全対策を実施し、個人情報の厳重な管理を行います。
            </p>
          </section>

          <section className={styles.privacySection}>
            <h2 className={styles.privacySectionTitle}>6. Cookieの使用について</h2>
            <p className={styles.privacyText}>
              当サイトでは、お客様により良いサービスを提供するため、Cookieを使用することがあります。
              Cookieの使用により収集される情報には、個人を特定する情報は含まれません。
            </p>
            <p className={styles.privacyText}>
              お客様は、ブラウザの設定によりCookieの受信を拒否することができますが、
              その場合、当サイトの一部サービスがご利用いただけない場合があります。
            </p>
          </section>

          <section className={styles.privacySection}>
            <h2 className={styles.privacySectionTitle}>7. アクセス解析ツールについて</h2>
            <p className={styles.privacyText}>
              当サイトでは、Googleアナリティクスなどのアクセス解析ツールを利用しています。
              これらのツールはCookieを使用して情報を収集しますが、個人を特定する情報は含まれません。
              収集された情報は、サイトの利用状況の分析、サイトの改善などの目的で使用されます。
            </p>
          </section>

          <section className={styles.privacySection}>
            <h2 className={styles.privacySectionTitle}>8. 個人情報の開示・訂正・削除</h2>
            <p className={styles.privacyText}>
              お客様は、当社に対して自己の個人情報の開示、訂正、削除を求めることができます。
              その際は、本人確認のための手続きをお願いすることがあります。
            </p>
          </section>

          <section className={styles.privacySection}>
            <h2 className={styles.privacySectionTitle}>9. プライバシーポリシーの変更</h2>
            <p className={styles.privacyText}>
              当社は、必要に応じて本プライバシーポリシーを変更することがあります。
              変更後のプライバシーポリシーは、当サイトに掲載した時点から効力を生じるものとします。
            </p>
          </section>

          <section className={styles.privacySection}>
            <h2 className={styles.privacySectionTitle}>10. お問い合わせ</h2>
            <p className={styles.privacyText}>
              個人情報の取り扱いに関するお問い合わせは、以下の連絡先までお願いいたします。
            </p>
            <div className={styles.privacyContactBox}>
              <p>
                <strong>AsamiWorks</strong><br />
                Email: info@asami-works.com<br />
                お問い合わせフォーム：<Link href="/form" className={styles.privacyLink}>こちら</Link>
              </p>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className={styles.privacyCta}>
          <h3 className={styles.privacyCtaTitle}>
            ホームページ制作のご相談はお気軽に
          </h3>
          <p className={styles.privacyCtaText}>
            補助金を活用した制作プランもご提案いたします
          </p>
          <div className={styles.privacyCtaButtons}>
            <Link
              href="/form"
              className={`${styles.privacyCtaButton} ${styles.privacyCtaPrimary}`}
            >
              お問い合わせ
            </Link>
            <Link
              href="/estimate"
              className={`${styles.privacyCtaButton} ${styles.privacyCtaSecondary}`}
            >
              簡易お見積もり
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}