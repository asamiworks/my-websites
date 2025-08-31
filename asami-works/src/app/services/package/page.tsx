import { Metadata } from "next";
import Link from "next/link";
import styles from "./Package.module.css";

export const metadata: Metadata = {
  title: "格安パッケージプラン | LP5万円・コーポレートサイト10万円 | AsamiWorks",
  description: "茨城・千葉で最安値のホームページ制作。LP制作5万円、コーポレートサイト10万円。月額1万円でサーバー・ドメイン費込み。最短1週間で公開可能。デモサイトで仕上がりを確認できます。",
  keywords: "格安 ホームページ制作 茨城, LP制作 5万円, テンプレート ホームページ 低価格, 千葉 Web制作 安い",
  openGraph: {
    title: "格安パッケージプラン | LP5万円〜 | AsamiWorks",
    description: "初期費用5万円〜、月額1万円でサーバー・ドメイン費込み。最短1週間で公開可能な格安ホームページ制作プラン。",
    type: "website",
    url: "https://asami-works.com/services/package",
  },
  alternates: {
    canonical: "https://asami-works.com/services/package",
  },
};

// 構造化データ
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "パッケージWebサイト制作",
  "provider": {
    "@type": "LocalBusiness",
    "name": "AsamiWorks（アサミワークス）",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "茨城県",
      "addressCountry": "JP"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "茨城県"
      },
      {
        "@type": "State", 
        "name": "千葉県"
      }
    ],
    "email": "info@asami-works.com"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "スタートパック LP",
      "price": "50000",
      "priceCurrency": "JPY",
      "description": "ランディングページ制作（初期費用）+ 月額10,000円（サーバー・ドメイン費込み）"
    },
    {
      "@type": "Offer",
      "name": "スタートパック HP",
      "price": "100000",
      "priceCurrency": "JPY",
      "description": "コーポレートサイト制作3ページ（初期費用）+ 月額10,000円（サーバー・ドメイン費込み）"
    }
  ]
};

export default function PackageServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className={styles.container}>
        {/* ヒーローセクション */}
        <section className={styles.hero} aria-label="パッケージプランの概要">
          <h1 className={styles.title}>
            <span className={styles.highlight}>格安</span>パッケージWebサイト制作
          </h1>
          <p className={styles.subtitle}>
            初期制作費 LP<strong>5万円</strong>〜、HP<strong>10万円</strong>〜
            <br />
            <small>月額運用費1万円でサーバー・ドメイン・保守すべて込み</small>
          </p>
        </section>

        {/* 特徴セクション */}
        <section className={styles.features} aria-label="パッケージプランの特徴">
          <h2 className={styles.sectionTitle}>パッケージプランの特徴</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>最短3日で公開</h3>
              <p>テンプレートベースだから、スピーディーに制作・公開が可能です。</p>
            </div>
            <div className={styles.featureCard}>
              <h3>初期費用を大幅削減</h3>
              <p>オリジナル制作の1/4以下の価格で、プロ品質のサイトが手に入ります。</p>
            </div>
            <div className={styles.featureCard}>
              <h3>スマホ対応標準装備</h3>
              <p>すべてのテンプレートがレスポンシブ対応。どんなデバイスでも美しく表示。</p>
            </div>
            <div className={styles.featureCard}>
              <h3>月額費用込み込み</h3>
              <p>サーバー・ドメイン・SSL・基本メンテナンスすべて月額1万円に含まれます。</p>
            </div>
          </div>
        </section>

        {/* プラン詳細 */}
        <section className={styles.plans} aria-label="料金プラン">
          <h2 className={styles.sectionTitle}>選べる2つのプラン</h2>
          
          <div className={styles.planGrid}>
            {/* LPプラン */}
            <article className={styles.planCard}>
              <h3 className={styles.planName}>スタートパック LP</h3>
              <div className={styles.price}>
                <span className={styles.priceLabel}>初期制作費</span>
                <span className={styles.priceAmount}>55,000</span>
                <span className={styles.priceUnit}>円（税込）</span>
              </div>
              <p className={styles.monthlyFee}>
                月額運用費: 11,000円（税込）
                <br />
                <small>※サーバー代・ドメイン代・基本保守すべて込み</small>
                <small>※2年後は月額6,600円の保守プランへ移行可能</small>
              </p>
              
              <ul className={styles.planFeatures}>
                <li>1ページ完結型のシンプル設計</li>
                
                <li>商品・サービスの魅力を伝える紹介文</li>
                <li>お客様が得られるメリットの説明</li>
                <li>会社・店舗へのアクセス情報</li>
                <li>電話・メールでの問い合わせ案内</li>
                <li>最短3日で公開</li>
                <li>インパクトのあるメインビジュアル</li>
                <li>Google検索で見つかりやすい基本設定</li>
                <li>スマートフォンでも見やすい表示</li>
              </ul>

              <div className={styles.planActions}>
                <Link href="/services/package/demo/lp" className={styles.demoButton}>
                  デモサイトを見る
                </Link>
                <Link href="/estimate?type=package&plan=lp" className={styles.ctaButton}>
                  このプランで申し込む
                </Link>
              </div>
            </article>

            {/* コーポレートプラン */}
            <article className={styles.planCard}>
              <h3 className={styles.planName}>スタートパック HP</h3>
              <div className={styles.price}>
                <span className={styles.priceLabel}>初期制作費</span>
                <span className={styles.priceAmount}>110,000</span>
                <span className={styles.priceUnit}>円（税込）</span>
              </div>
              <p className={styles.monthlyFee}>
                月額運用費: 16,500円（税込）
                <br />
                <small>※サーバー代・ドメイン代・基本保守すべて込み</small>
                <small>※2年後は月額6,600円の保守プランへ移行可能</small>
              </p>
              
              <ul className={styles.planFeatures}>
                <li>充実の3ページ構成</li>
               
                <li>トップページ：会社の第一印象を決める顔</li>
                <li>事業紹介ページ：提供サービスや商品詳細</li>
                <li>会社案内ページ：企業情報や代表挨拶</li>
                <li>全ページに電話・メール連絡先を配置</li>
                <li>最短5日で公開</li>
                <li>インパクトのあるメインビジュアル</li>
                <li>Google検索で見つかりやすい基本設定</li>
                <li>スマートフォンでも見やすい表示</li>
              </ul>

              <div className={styles.planActions}>
                <Link href="/services/package/demo/corporate" className={styles.demoButton}>
                  デモサイトを見る
                </Link>
                <Link href="/estimate?type=package&plan=hp" className={styles.ctaButton}>
                  このプランで申し込む
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* 比較表 */}
        <section className={styles.comparison} aria-label="プラン比較">
          <h2 className={styles.sectionTitle}>オリジナルプランとの違い</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>パッケージプラン</th>
                  <th>オリジナルプラン</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>初期制作費</td>
                  <td><strong>5万円〜</strong></td>
                  <td>22万円〜</td>
                </tr>
                <tr>
                  <td>月額費用</td>
                  <td>1万円〜<strong>（サーバー・ドメイン料コミコミ）</strong></td>
                  <td><strong>6,600円〜（サーバー・ドメイン料コミコミ）</strong></td>
                </tr>
                <tr>
                  <td>納期</td>
                  <td><strong>最短3日</strong></td>
                  <td>2週間〜1ヶ月</td>
                </tr>
                <tr>
                  <td>デザイン</td>
                  <td>テンプレートから選択</td>
                  <td><strong>完全オーダーメイド</strong></td>
                </tr>
                <tr>
                  <td>カスタマイズ</td>
                  <td>色・画像・テキストの変更</td>
                  <td><strong>無制限</strong></td>
                </tr>
                <tr>
                  <td>SEO対策</td>
                  <td>基本対策</td>
                  <td>基本対策</td>
                </tr>
                <tr>
                  <td>CTA</td>
                  <td>連絡先のリンク貼り付け<strong>（公式LINE,Instagram等）</strong></td>
                  <td><strong>問合せフォーム設置が標準</strong>（LPプランを除く）</td>
                </tr>
                <tr>
                  <td>おすすめの方</td>
                  <td>初めてサイトを作る方<br /><strong>費用を抑えたい方</strong></td>
                  <td>独自性を求める方<br /><strong>ブランディング重視の方</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta} aria-label="お問い合わせ">
          <h2>まずはデモサイトをご覧ください</h2>
          <p>実際の仕上がりイメージを確認してから、安心してお申し込みいただけます。</p>
          <div className={styles.ctaButtons}>
            <Link href="/services/package/demo/lp" className={styles.primaryButton}>
              LPデモサイトを見る
            </Link>
            <Link href="/services/package/demo/corporate" className={styles.primaryButton}>
              HPデモサイトを見る
            </Link>
          </div>
          <p className={styles.ctaNote}>
            ご不明な点がございましたら、お気軽に
            <Link href="/contact">お問い合わせ</Link>
            ください。
          </p>
        </section>
      </main>
    </>
  );
}