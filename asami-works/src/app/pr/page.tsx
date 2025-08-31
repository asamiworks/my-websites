import { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "広告ページ制作サービス | AsamiWorks",
  description: "ホームページは不要だけど、Web上に1ページだけ欲しい方へ。月額3,000円からの簡易広告ページ制作サービス",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PRServicePage() {
  return (
    <main className={styles.main}>
      {/* サービス概要 */}
      <section className={styles.hero}>
        <h1 className={styles.title}>
          広告ページ制作サービス
        </h1>
        <p className={styles.subtitle}>
          フルサイトは不要、でもWeb上に情報を掲載したい<br />
          そんなご要望にお応えする1ページ完結型のサービスです
        </p>
      </section>

      {/* こんな方におすすめ */}
      <section className={styles.target}>
        <h2>こんな方におすすめです</h2>
        <div className={styles.targetGrid}>
          <div className={styles.targetCard}>
            <h3>個人事業主の方</h3>
            <p>名刺にURLを載せたいが、フルサイトまでは必要ない</p>
          </div>
          <div className={styles.targetCard}>
            <h3>期間限定キャンペーン</h3>
            <p>イベントや期間限定の告知ページが欲しい</p>
          </div>
          <div className={styles.targetCard}>
            <h3>実店舗の方</h3>
            <p>お店の基本情報とメニューだけ載せたい</p>
          </div>
          <div className={styles.targetCard}>
            <h3>副業・フリーランス</h3>
            <p>サービス内容と連絡先だけのシンプルなページが欲しい</p>
          </div>
        </div>
      </section>

      {/* 料金プラン */}
      <section className={styles.pricing}>
        <h2>料金プラン</h2>
        <div className={styles.priceCard}>
          <div className={styles.priceHeader}>
            <h3>シンプルプラン</h3>
          </div>
          <div className={styles.priceBody}>
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>初期制作費</span>
              <span className={styles.priceAmount}>30,000円〜</span>
              <span className={styles.priceTax}>（税込33,000円〜）</span>
            </div>
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>月額費用</span>
              <span className={styles.priceAmount}>3,000円</span>
              <span className={styles.priceTax}>（税込3,300円）</span>
            </div>
          </div>
          <ul className={styles.priceFeatures}>
            <li>✓ 1ページ完結型のシンプル構成</li>
            <li>✓ スマートフォン対応</li>
            <li>✓ SSL対応（https://）</li>
            <li>✓ サーバー・ドメイン管理込み</li>
            <li>✓ 月1〜2回の軽微な更新対応</li>
          </ul>
        </div>
      </section>

      {/* サービス内容 */}
      <section className={styles.service}>
        <h2>サービス内容</h2>
        <div className={styles.serviceGrid}>
          <div className={styles.serviceCard}>
            <h3>制作範囲</h3>
            <ul>
              <li>企業・店舗の基本情報</li>
              <li>サービス・商品紹介</li>
              <li>料金表</li>
              <li>お問い合わせ先（電話・メール・SNS）</li>
              <li>アクセス情報</li>
              <li>営業時間・定休日</li>
            </ul>
          </div>
          <div className={styles.serviceCard}>
            <h3>含まれるもの</h3>
            <ul>
              <li>ページデザイン・制作</li>
              <li>スマホ最適化</li>
              <li>基本的なSEO設定</li>
              <li>サーバー費用</li>
              <li>ディレクトリ下層での公開</li>
              <li>SSL証明書</li>
            </ul>
          </div>
          <div className={styles.serviceCard}>
            <h3>オプション</h3>
            <ul>
              <li>独自ドメイン取得代行</li>
              <li>ロゴ制作</li>
              <li>写真撮影</li>
              <li>定期的な更新作業</li>
              <li>アクセス解析設置</li>
              <li>SNS連携</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 注意事項 */}
      <section className={styles.terms}>
        <h2>ご利用にあたっての注意事項</h2>
        <div className={styles.termsContent}>
          <h3>契約について</h3>
          <ul>
            <li>最低契約期間は6ヶ月となります</li>
            <li>お支払いは3ヶ月ごとの請求書払いです</li>
            <li>解約は1ヶ月前までにご連絡ください</li>
          </ul>

          <h3>ページURLについて</h3>
          <ul>
            <li>基本URLは「asami-works.com/pr/お客様名/」となります</li>
            <li>独自ドメインをご希望の場合は別途ご相談ください</li>
          </ul>

          <h3>更新について</h3>
          <ul>
            <li>テキストの修正、画像の差し替えなど軽微な更新は月1〜2回まで無料</li>
            <li>大幅なデザイン変更や構成変更は別途お見積り</li>
            <li>更新依頼はメールでお受けします</li>
          </ul>

          <h3>掲載できない内容</h3>
          <ul>
            <li>法律に違反する内容</li>
            <li>公序良俗に反する内容</li>
            <li>第三者の権利を侵害する内容</li>
            <li>虚偽または誤解を招く内容</li>
            <li>その他、弊社が不適切と判断した内容</li>
          </ul>

          <h3>サービス終了時</h3>
          <ul>
            <li>契約終了後、ページは公開停止となります</li>
            <li>データのバックアップが必要な場合は事前にご連絡ください</li>
          </ul>
        </div>
      </section>

      {/* お問い合わせ */}
      <section className={styles.contact}>
        <h2>お問い合わせ・お申し込み</h2>
        <p>
          広告ページ制作サービスにご興味をお持ちいただきありがとうございます。<br />
          まずはお気軽にご相談ください。
        </p>
        <div className={styles.contactButtons}>
          <Link href="/form?service=pr-page" className={styles.contactButton}>
            お問い合わせフォーム
          </Link>
        </div>
        <p className={styles.contactNote}>
          ※「広告ページ制作について」とご記載ください
        </p>
      </section>


      {/* FAQ */}
      <section className={styles.faq}>
        <h2>よくあるご質問</h2>
        <div className={styles.faqList}>
          <details className={styles.faqItem}>
            <summary>通常のホームページ制作との違いは？</summary>
            <p>
              通常のホームページは複数ページ構成で、お問い合わせフォームやブログ機能などを含みますが、
              広告ページは1ページ完結型で、必要最小限の情報掲載に特化しています。
              その分、費用を大幅に抑えることができます。
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>どんな業種でも対応可能ですか？</summary>
            <p>
              基本的にはどんな業種でも対応可能です。
              ただし、法令に違反する内容や公序良俗に反する内容はお断りする場合があります。
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>制作期間はどのくらいですか？</summary>
            <p>
              お申し込みから公開まで、通常3〜7営業日程度です。
              内容や修正回数により前後する場合があります。
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>SEO対策はされますか？</summary>
            <p>
              基本的なSEO設定（タイトル、説明文、見出し構造など）は行います。
              ただし、1ページのみのため、本格的なSEO対策をご希望の場合は通常のホームページ制作をおすすめします。
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>後から通常のホームページに変更できますか？</summary>
            <p>
              はい、可能です。広告ページから通常のホームページ制作への移行もスムーズに対応いたします。
              その際は制作費の一部を割引させていただきます。
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}
      