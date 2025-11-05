import Image from "next/image";
import { Zap, Building2, Construction, Wrench } from "lucide-react";
import styles from "./Top.module.css";
import type { Metadata } from 'next';

// SEO用メタデータ
export const metadata: Metadata = {
  title: '株式会社足立電機 | 茨城県龍ケ崎市の電気工事・設備工事',
  description: '茨城県龍ケ崎市で80年以上の実績。電気工事、設備工事、土木工事まで法人様向けにワンストップで対応。確かな技術力と迅速な対応でお客様のニーズにお応えします。',
  keywords: ['電気工事', '設備工事', '茨城県', '龍ケ崎市', '法人向け', '太陽光発電', '空調工事', '高圧受電設備'],
  openGraph: {
    title: '株式会社足立電機 | 地域の明日を、確かな技術で',
    description: '昭和15年創業。茨城県龍ケ崎市で電気工事・設備工事を手がける株式会社足立電機。法人様向けに確かな技術力でサービスを提供します。',
    images: [
      {
        url: 'https://jh-ad.jp/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '株式会社足立電機 - 確かな技術力で未来を照らす',
      }
    ],
  },
};

// 構造化データ（ローカルビジネス）
const jsonLdLocalBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://jh-ad.jp/#business',
  name: '株式会社足立電機',
  image: 'https://jh-ad.jp/company-building.jpg',
  url: 'https://jh-ad.jp',
  telephone: '', // 意図的に非掲載
  priceRange: '法人向け',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '松ヶ丘4丁目4番1号',
    addressLocality: '龍ケ崎市',
    addressRegion: '茨城県',
    postalCode: '301-0853',
    addressCountry: 'JP'
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:30',
    closes: '17:00'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: '事業内容',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '電気工事',
          description: '電気工事設計・施工全般、高圧受電設備工事'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '設備工事',
          description: '太陽光発電、空調、床暖房、衛生設備、エコキュート等'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '土木・内装工事',
          description: '一般土木、排水管清掃、内装工事全般'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '電気機器販売',
          description: '各種電気機器の販売・メンテナンス'
        }
      }
    ]
  }
};

export default function Home() {
  return (
    <>
      {/* 構造化データの挿入 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
      />
      
      <main>
        {/* ヒーローセクション（メインビジュアル + キャッチコピー） */}
        <section className={styles.hero} aria-label="メインビジュアル">
          <div className={styles.heroImageWrapper}>
            <Image
              src="/company-building.jpg"
              alt="株式会社足立電機の本社外観。茨城県龍ケ崎市松ヶ丘にある2階建ての事務所"
              fill
              priority
              className={styles.heroImage}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              sizes="100vw"
              quality={90}
            />
            <div className={styles.heroOverlay} aria-hidden="true"></div>
          </div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>地域の明日を、確かな技術で</h1>
            <p className={styles.heroSubtitle}>安全・信頼・スピード対応をモットーに</p>
            <div className={styles.heroDecoration} aria-hidden="true"></div>
          </div>
        </section>

        {/* 会社紹介セクション */}
        <section className={styles.introSection} aria-label="会社紹介">
          <div className={styles.container}>
            <div className={styles.introContent}>
              <h2 className={styles.introTitle}>80年以上の歴史と実績</h2>
              <p className={styles.introText}>
                株式会社足立電機は、昭和15年の創業以来、茨城県龍ケ崎市を中心に地域の電気工事・設備工事を支えてまいりました。
                確かな技術力と迅速な対応で、法人のお客様の多様なニーズにお応えしています。
              </p>
            </div>
          </div>
        </section>

        {/* 事業内容 */}
        <section className={styles.businessSection} aria-labelledby="business-title">
          <div className={styles.container}>
            <h2 id="business-title" className={styles.sectionTitle}>事業内容</h2>
            <div className={styles.titleDecoration} aria-hidden="true"></div>
            <div className={styles.businessGrid} role="list">
              <article className={styles.businessCard} role="listitem">
                <div className={styles.businessIcon} aria-hidden="true">
                  <Zap size={48} />
                </div>
                <h3>電気工事</h3>
                <p>電気工事・設計・施工全般</p>
              </article>
              <article className={styles.businessCard} role="listitem">
                <div className={styles.businessIcon} aria-hidden="true">
                  <Building2 size={48} />
                </div>
                <h3>設備工事</h3>
                <p>空調設備工事・衛生設備工事<br />太陽光発電システム</p>
              </article>
              <article className={styles.businessCard} role="listitem">
                <div className={styles.businessIcon} aria-hidden="true">
                  <Construction size={48} />
                </div>
                <h3>土木・内装工事</h3>
                <p>一般土木・排水管清掃<br />内装工事全般</p>
              </article>
              <article className={styles.businessCard} role="listitem">
                <div className={styles.businessIcon} aria-hidden="true">
                  <Wrench size={48} />
                </div>
                <h3>電気機器販売</h3>
                <p>各種電気機器の<br />販売・メンテナンス</p>
              </article>
            </div>
          </div>
        </section>

        {/* 強みセクション */}
        <section className={styles.strengthSection} aria-labelledby="strength-title">
          <div className={styles.container}>
            <h2 id="strength-title" className={styles.sectionTitle}>私たちの強み</h2>
            <div className={styles.titleDecoration} aria-hidden="true"></div>
            <div className={styles.strengthGrid} role="list">
              <article className={styles.strengthItem} role="listitem">
                <div className={styles.strengthNumber} aria-hidden="true">01</div>
                <h3>確かな技術力</h3>
                <p>有資格者による高品質な施工と、最新技術への対応</p>
              </article>
              <article className={styles.strengthItem} role="listitem">
                <div className={styles.strengthNumber} aria-hidden="true">02</div>
                <h3>迅速な対応</h3>
                <p>地域密着だからこそ可能な、スピーディーな対応</p>
              </article>
              <article className={styles.strengthItem} role="listitem">
                <div className={styles.strengthNumber} aria-hidden="true">03</div>
                <h3>総合力</h3>
                <p>電気から土木まで、ワンストップでの対応が可能</p>
              </article>
            </div>
          </div>
        </section>

        {/* 会社情報 */}
        <section className={styles.infoSection} aria-label="会社情報">
          <div className={styles.container}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoCardTitle}>許認可</h3>
                <div className={styles.licenseBox}>
                  <p className={styles.licenseTitle}>建設業許可</p>
                  <p className={styles.licenseNumber}>
                    <strong>茨城県知事許可 第031515号</strong>
                  </p>
                  <p className={styles.licenseType}>（電気工事業）</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <h3 className={styles.infoCardTitle}>取引銀行</h3>
                <div className={styles.bankList}>
                  <span className={styles.bankItem}>常陽銀行</span>
                  <span className={styles.bankItem}>筑波銀行</span>
                  <span className={styles.bankItem}>水戸信用金庫</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className={styles.ctaSection} aria-label="お問い合わせ">
          <p className={styles.ctaText}>
            法人様向けの電気工事・設備工事に関するご相談はお気軽にお問い合わせください
          </p>
          <a 
            href="https://jh-ad.jp/contact/form.html" 
            className={styles.ctaButton}
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="お問い合わせフォームを新しいウィンドウで開く"
          >
            お問い合わせフォーム
          </a>
        </section>
      </main>
    </>
  );
}