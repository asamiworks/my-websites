import type { Metadata } from 'next'
import Link from "next/link";
import Image from "next/image";
import CTA from "@/components/CTA";
import styles from "../styles/Hero.module.css";

// ページ固有のメタデータ - 茨城メモリアルパークを前方配置
export const metadata: Metadata = {
  metadataBase: new URL('https://ibaraki-memorial.com'),
  title: '茨城メモリアルパーク【公式】土浦市の永代供養墓 | 月1万円から・継承不要',
  description: '茨城メモリアルパーク（茨城県土浦市藤沢1535）は月1万円から始められるリース型永代供養墓。継承や墓じまいの心配不要、個別供養で安心。神宮寺とカツミ石材運営。見学随時受付中。TEL:090-3068-5360',
  keywords: [
    '茨城メモリアルパーク', '茨城メモリアルパーク 土浦', '茨城メモリアルパーク 永代供養',
    '茨城メモリアルパーク 料金', '茨城メモリアルパーク 見学', '茨城メモリアルパーク 口コミ',
    'リース型永代供養 茨城', '永代供養墓 土浦市', '継承不要 お墓 茨城',
    '月1万円 永代供養', '個別供養 茨城', '墓じまい不要',
    '神宮寺 土浦', 'カツミ石材', '土浦市 藤沢 墓地', '茨城県 現代型お墓',
    'つくば市 永代供養', '牛久市 永代供養', '阿見町 永代供養'
  ],
  openGraph: {
    title: '茨城メモリアルパーク【公式】ご家族の負担を軽くする新しいお墓のかたち',
    description: '茨城メモリアルパークは月1万円から始められるリース型永代供養墓。茨城県土浦市で継承や墓じまいの心配なし。個別供養で安心してご利用いただけます。',
    url: 'https://ibaraki-memorial.com',
    siteName: '茨城メモリアルパーク',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '茨城メモリアルパーク - 土浦市のリース型永代供養墓',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '茨城メモリアルパーク【公式】月1万円から始める永代供養墓',
    description: '茨城メモリアルパークは継承や墓じまいの心配がない現代型のお墓。土浦市藤沢で個別供養。',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://ibaraki-memorial.com',
  },
}

// ホームページ用構造化データ - 茨城メモリアルパークを強調
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Cemetery',
  '@id': 'https://ibaraki-memorial.com/#cemetery',
  name: '茨城メモリアルパーク',
  alternateName: ['茨城メモリアルパーク永代供養墓', '茨城メモリアルパーク土浦'],
  description: '茨城メモリアルパークは茨城県土浦市藤沢のリース型永代供養墓。月1万円から始められ、継承不要で個別供養を行う現代型の墓地です。',
  url: 'https://ibaraki-memorial.com',
  image: [
    {
      '@type': 'ImageObject',
      url: 'https://ibaraki-memorial.com/images/facility.jpg',
      caption: '茨城メモリアルパークの施設外観'
    }
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 36.1244637,
    longitude: 140.1540584
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '090-3068-5360',
    contactType: 'Customer Service',
    availableLanguage: 'Japanese',
    areaServed: ['茨城県', '土浦市', 'つくば市', '牛久市', '阿見町', 'かすみがうら市']
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'JP',
    addressRegion: '茨城県',
    addressLocality: '土浦市',
    postalCode: '300-4116',
    streetAddress: '藤沢1535'
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '17:00'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: '茨城メモリアルパーク料金プラン',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'リース型永代供養墓',
        price: '120000',
        priceCurrency: 'JPY',
        priceValidUntil: '2025-12-31',
        description: '年間12万円（月々1万円相当）、7年忌以降は無料（年会費1万円のみ）'
      }
    ]
  },
  hasMap: 'https://maps.google.com/maps?cid=13305663077073506183',
  isAccessibleForFree: false,
  publicAccess: true,
  smokingAllowed: false,
  tourBookingPage: 'https://ibaraki-memorial.com/form'
}

// 組織情報の構造化データ
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://ibaraki-memorial.com/#organization',
  name: '茨城メモリアルパーク',
  legalName: '茨城メモリアルパーク（神宮寺・有限会社カツミ石材）',
  url: 'https://ibaraki-memorial.com',
  logo: 'https://ibaraki-memorial.com/images/logo.png',
  sameAs: [
    'https://maps.google.com/maps?cid=13305663077073506183'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '090-3068-5360',
    contactType: 'reservations',
    availableLanguage: 'ja'
  }
}

// パンくずリストの構造化データ
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '茨城メモリアルパーク',
      item: 'https://ibaraki-memorial.com'
    }
  ]
}

// FAQ用構造化データ - 茨城メモリアルパークを含める
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '茨城メモリアルパークでお墓を引き継ぐ必要はありますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'いいえ、茨城メモリアルパークのリース型永代供養墓は継承者がいなくても永代にわたり供養されます。お子様やお孫様に負担をかけることはありません。'
      }
    },
    {
      '@type': 'Question', 
      name: '茨城メモリアルパークでは合祀されますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'いいえ。茨城メモリアルパークではご契約者ごとに個別供養を行います。合祀に抵抗がある方にも安心してご利用いただけます。'
      }
    },
    {
      '@type': 'Question',
      name: '茨城メモリアルパークは宗派に制限はありますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '茨城メモリアルパークはどの宗派の方でもご利用いただけます。宗派を問わずお受けしております。'
      }
    },
    {
      '@type': 'Question',
      name: '茨城メモリアルパークの7年忌以降の管理はどうなりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '茨城メモリアルパークでは7年忌以降は年会費10,000円のみで、永代にわたり管理・供養いたします。お墓の撤去費用などは一切かかりません。'
      }
    },
    {
      '@type': 'Question',
      name: '茨城メモリアルパークの見学はできますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、茨城メモリアルパークは随時見学を受け付けております。事前にお電話（090-3068-5360）でご連絡いただければ、詳しくご案内いたします。'
      }
    }
  ]
}

export default function HomePage() {
  const backgroundImage = "/images/hero1.jpg"; // PNGからJPGに変更

  return (
    <>
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />

      {/* ヒーローセクション */}
      <section
        className={styles.heroSection}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-labelledby="hero-title"
      >
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 id="hero-title" className={styles.heroTitle}>
              <span className={styles.heroTitleMain}>茨城メモリアルパーク</span>
              <br />
              確かな実績で、ずっと見守る
              <br />
              <span className={styles.heroTitleAccent}>月1万円の個別永代墓</span>
            </h1>
            <p className={styles.heroText}>
              土浦市藤沢の地で培った信頼。神宮寺×カツミ石材がお守りする茨城メモリアルパーク。
            </p>
          </div>
        </div>
      </section>

      {/* 3つの安心ポイント */}
      <section 
        className={styles.safetyPointsSection}
        aria-labelledby="safety-points-title"
      >
        <div className={styles.container}>
          <h2 id="safety-points-title" className={styles.sectionTitle}>
            茨城メモリアルパーク 3つの安心ポイント
          </h2>
          <div className={styles.safetyPointsGrid}>
            <article className={styles.safetyPoint}>
              <div className={styles.pointNumber} aria-hidden="true">01</div>
              <h3 className={styles.pointTitle}>継承者不要</h3>
              <p className={styles.pointText}>
                茨城メモリアルパークなら、お子様やお孫様に負担をかけることなく、永代にわたり丁寧に供養いたします。
              </p>
            </article>
            <article className={styles.safetyPoint}>
              <div className={styles.pointNumber} aria-hidden="true">02</div>
              <h3 className={styles.pointTitle}>個別供養</h3>
              <p className={styles.pointText}>
                茨城メモリアルパークは合祀ではなく、お一人お一人を個別にお祀りするため、安心してお任せいただけます。
              </p>
            </article>
            <article className={styles.safetyPoint}>
              <div className={styles.pointNumber} aria-hidden="true">03</div>
              <h3 className={styles.pointTitle}>安心の価格</h3>
              <p className={styles.pointText}>
                茨城メモリアルパークは年間12万円（月1万円）の明確な料金設定。追加費用の心配がありません。
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 比較表セクション */}
      <section 
        className={styles.comparisonSection}
        aria-labelledby="comparison-title"
      >
        <div className={styles.container}>
          <h2 id="comparison-title" className={styles.sectionTitle}>
            従来のお墓と茨城メモリアルパークの違い
          </h2>
          <div className={styles.comparisonTable}>
            <table className={styles.table} role="table" aria-label="従来のお墓と茨城メモリアルパークのリース型永代供養の比較">
              <thead>
                <tr>
                  <th className={styles.tableHeader}>項目</th>
                  <th className={styles.tableHeaderTraditional}>従来のお墓</th>
                  <th className={styles.tableHeaderLease}>茨城メモリアルパーク</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.tableRowHeader}>初期費用</td>
                  <td className={styles.tableCell}>150万円〜300万円</td>
                  <td className={styles.tableCellHighlight}>年12万円から</td>
                </tr>
                <tr>
                  <td className={styles.tableRowHeader}>継承</td>
                  <td className={styles.tableCell}>子孫による継承が必要</td>
                  <td className={styles.tableCellHighlight}>継承者不要</td>
                </tr>
                <tr>
                  <td className={styles.tableRowHeader}>管理</td>
                  <td className={styles.tableCell}>年間管理費が必要</td>
                  <td className={styles.tableCellHighlight}>7年忌以降は無料（年会費1万円のみ）</td>
                </tr>
                <tr>
                  <td className={styles.tableRowHeader}>墓じまい</td>
                  <td className={styles.tableCell}>高額な撤去費用</td>
                  <td className={styles.tableCellHighlight}>心配不要</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ご利用の流れ */}
      <section 
        className={styles.flowSection}
        aria-labelledby="flow-title"
      >
        <div className={styles.container}>
          <h2 id="flow-title" className={styles.sectionTitle}>
            茨城メモリアルパーク ご利用の流れ
          </h2>
          <div className={styles.flowSteps}>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>STEP 1</div>
              <h3 className={styles.stepTitle}>お問い合わせ</h3>
              <p className={styles.stepText}>
                茨城メモリアルパークへお電話またはお問い合わせフォームからご連絡ください。どんな些細なことでもお気軽にご相談いただけます。
              </p>
            </div>
            <div className={styles.flowArrow} aria-hidden="true">→</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>STEP 2</div>
              <h3 className={styles.stepTitle}>現地見学</h3>
              <p className={styles.stepText}>
                実際に茨城メモリアルパークの施設をご見学いただき、雰囲気や立地をご確認ください。ご納得いただけるまでご説明いたします。
              </p>
            </div>
            <div className={styles.flowArrow} aria-hidden="true">→</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>STEP 3</div>
              <h3 className={styles.stepTitle}>ご契約・工事</h3>
              <p className={styles.stepText}>
                茨城メモリアルパークとのご契約後、石工事を行います。工事完了後すぐにご利用いただけます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 施設紹介 */}
      <section 
        className={styles.facilitySection}
        aria-labelledby="facility-title"
      >
        <div className={styles.container}>
          <h2 id="facility-title" className={styles.sectionTitle}>
            茨城メモリアルパーク 施設のご紹介
          </h2>
          <div className={styles.facilityContent}>
            <div className={styles.facilityImageWrapper}>
              <Image 
                src="/images/facility.jpg" 
                alt="茨城メモリアルパーク - 土浦市藤沢の緑豊かな永代供養墓施設" 
                width={600}
                height={400}
                className={styles.facilityImage}
                loading="lazy"
              />
            </div>
            <div className={styles.facilityText}>
              <h3 className={styles.facilitySubtitle}>茨城県土浦市の緑豊かな静かな環境</h3>
              <p className={styles.facilityDescription}>
                茨城メモリアルパークは茨城県土浦市藤沢の静かな住宅地に位置し、緑に囲まれた落ち着いた環境です。一般的なお墓と同様に、お花や線香、塔婆もお供えいただけます。駐車場も完備しており、土浦市内はもちろん、つくば市、牛久市、阿見町、かすみがうら市からもお参りにお越しいただきやすい立地です。
              </p>
              
            </div>
          </div>
        </div>
      </section>

      {/* アクセス */}
      <section 
        className={styles.accessSection}
        aria-labelledby="access-title"
      >
        <div className={styles.container}>
          <h2 id="access-title" className={styles.sectionTitle}>
            茨城メモリアルパーク アクセス
          </h2>
          <div className={styles.accessContent}>
            <div className={styles.accessInfoSection}>
              <div className={styles.facilityHeader}>
                <h3 className={styles.facilityName}>茨城メモリアルパーク（神宮寺内）</h3>
                <p className={styles.facilityAddress}>〒300-4116 茨城県土浦市藤沢1535</p>
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <div className={styles.iconWrapper}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h4>茨城メモリアルパークへのお問い合わせ</h4>
                    <p>
                      <a href="tel:0903068360" className={styles.phoneLink}>
                        090-3068-5360
                      </a>
                      <span className={styles.phoneNote}>（カツミ石材）</span>
                    </p>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.iconWrapper}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h4>茨城メモリアルパーク見学受付時間</h4>
                    <p>9:00〜17:00（年中無休）</p>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.iconWrapper}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h4>駐車場</h4>
                    <p>茨城メモリアルパーク内完備（無料）</p>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.iconWrapper}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.48 2 5.5 3.37 3.5 5.5l3 3C7.63 7.36 9.23 6.5 11 6.22V11h2V6.22c1.77.28 3.37 1.14 4.5 2.28l3-3C18.5 3.37 15.52 2 12 2zm-1 13v7h2v-7h3l-4-4-4 4h3z"/>
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h4>茨城メモリアルパークへのアクセス</h4>
                    <p>常磐線 土浦駅から車で約15分</p>
                    <p className={styles.subText}>つくば市・牛久市・阿見町からもアクセス良好</p>
                  </div>
                </div>
              </div>
              <div className={styles.directionsButtonWrapper}>
                <Link
                  href="https://maps.google.com/maps/dir/?api=1&destination=茨城メモリアルパーク&destination_place_id=ChIJF5gEWInSDWAR94VUJOcG8rg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsButton}
                  aria-label="茨城メモリアルパークへのルートをGoogleマップで確認（新しいタブ）"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                  </svg>
                  茨城メモリアルパークへのルート案内
                </Link>
              </div>
            </div>
            <div className={styles.mapSection}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103127.3417869581!2d140.08402975820314!3d36.124449000000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60220d8958049817%3A0xb8ca06ee24554f87!2z6Iyo5Z-O44Oh44Oi44Oq44Ki44Or44OR44O844Kv!5e0!3m2!1sja!2sjp!4v1750747455031!5m2!1sja!2sjp" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '450px' }}
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="茨城メモリアルパークの地図"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 料金プラン */}
      <section 
        className={styles.pricingSection}
        aria-labelledby="pricing-plan"
      >
        <div className={styles.container}>
          <h2 id="pricing-plan" className={styles.sectionTitle}>
            茨城メモリアルパーク 明確で安心の料金プラン
          </h2>
          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <h3 className={styles.pricingTitle}>茨城メモリアルパーク リース型永代供養墓</h3>
              <div className={styles.priceMain}>
                <span className={styles.priceAmount}>年間 12万円</span>
                <span className={styles.priceNote}>（月々1万円相当）</span>
              </div>
            </div>
            <table 
              className={styles.pricingTable}
              role="table"
              aria-label="茨城メモリアルパーク料金プラン詳細"
            >
              <tbody>
                <tr>
                  <th className={styles.pricingRowHeader} scope="row">年間利用料</th>
                  <td className={styles.pricingCell}>
                    <strong>12万円 / 年</strong>
                  </td>
                </tr>
                <tr>
                  <th className={styles.pricingRowHeader} scope="row">7年忌以降</th>
                  <td className={styles.pricingCell}>
                    <strong className={styles.freeText}>無料</strong>
                  </td>
                </tr>
                <tr>
                  <th className={styles.pricingRowHeader} scope="row">年会費等</th>
                  <td className={styles.pricingCell}>
                    無料（7年忌以降 10,000円/年）
                  </td>
                </tr>
                <tr>
                  <th className={styles.pricingRowHeader} scope="row">含まれるもの</th>
                  <td className={styles.pricingCell}>
                    石工事・永代使用料・個別供養
                    <br/>
                    最大三十三回忌まで
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={styles.pricingNote}>
              <p>※茨城メモリアルパークでは一般的なお墓と同じように、お花や線香、塔婆もお供えいただけます</p>
              <p>※追加費用は一切かかりません</p>
            </div>
          </div>
        </div>
      </section>

      {/* お客様の声 */}
      <section 
        className={styles.testimonialsSection}
        aria-labelledby="testimonials-title"
      >
        <div className={styles.container}>
          <h2 id="testimonials-title" className={styles.sectionTitle}>
            茨城メモリアルパークをご利用いただいた方のお声
          </h2>
          <div className={styles.testimonialsGrid}>
            <article className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <p className={styles.testimonialText}>
                  「子どもたちに負担をかけたくなくて、茨城メモリアルパークにお世話になりました。個別に供養していただけるので安心です。料金も明確で、将来の心配がなくなりました。」
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <span className={styles.authorInfo}>70代女性・土浦市在住</span>
              </div>
            </article>
            <article className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <p className={styles.testimonialText}>
                  「夫を亡くして、お墓のことで悩んでいた時に茨城メモリアルパークを知りました。宗派を問わず、丁寧に対応していただき、本当に感謝しています。」
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <span className={styles.authorInfo}>60代女性・つくば市在住</span>
              </div>
            </article>
            <article className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <p className={styles.testimonialText}>
                  「高額な墓石代に悩んでいましたが、茨城メモリアルパークの月1万円から始められるシステムは本当に助かります。施設も綺麗で、安心してお任せできます。」
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <span className={styles.authorInfo}>65歳男性・牛久市在住</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 実績と安心のパートナー */}
      <section 
        className={styles.partnersSection}
        aria-labelledby="trusted-partners"
      >
        <div className={styles.container}>
          <h2 id="trusted-partners" className={styles.sectionTitle}>
            茨城メモリアルパーク 地域に根ざした確かな実績と信頼
          </h2>
          <div className={styles.partnersContent}>
            <article className={styles.partnerCard}>
              <h3 className={styles.partnerTitle}>茨城メモリアルパークの供養を担う「神宮寺」</h3>
              <p className={styles.partnerDescription}>
                茨城メモリアルパークでは、宗派を問わず、心を込めて供養を行います。長年の経験と実績で、皆様の大切な方を永代にわたりお守りいたします。
              </p>
            </article>
            <article className={styles.partnerCard}>
              <h3 className={styles.partnerTitle}>茨城メモリアルパークの施工を手がける「カツミ石材」</h3>
              <p className={styles.partnerDescription}>
                茨城メモリアルパークの石工事は、土浦市で長年の実績を持つカツミ石材が担当。確かな技術と丁寧な工事で、安心してお任せいただける施設をご提供します。
              </p>
            </article>
          </div>
          <div className={styles.partnersCTA}>
            <Link
              href="/about-us"
              className={styles.partnersButton}
              aria-label="茨城メモリアルパークのパートナーについて詳しく見る"
            >
              茨城メモリアルパークのパートナーについて詳しく見る
            </Link>
          </div>
        </div>
      </section>

      {/* よくある質問 */}
      <section 
        className={styles.faqSection}
        aria-labelledby="faq-section"
      >
        <div className={styles.container}>
          <h2 id="faq-section" className={styles.sectionTitle}>
            茨城メモリアルパーク よくあるご質問
          </h2>
          <dl className={styles.faqList}>
            <div className={styles.faqItem}>
              <dt className={styles.faqQuestion}>
                Q. 茨城メモリアルパークでお墓を引き継ぐ必要はありますか？
              </dt>
              <dd className={styles.faqAnswer}>
                A. いいえ、茨城メモリアルパークは継承者がいなくても永代にわたり供養されます。お子様やお孫様に負担をかけることはありません。
              </dd>
            </div>

            <div className={styles.faqItem}>
              <dt className={styles.faqQuestion}>
                Q. 茨城メモリアルパークでは合祀されますか？
              </dt>
              <dd className={styles.faqAnswer}>
                A. いいえ。茨城メモリアルパークではご契約者ごとに個別供養を行います。合祀に抵抗がある方にも安心してご利用いただけます。
              </dd>
            </div>

            <div className={styles.faqItem}>
              <dt className={styles.faqQuestion}>
                Q. 茨城メモリアルパークは宗派に制限はありますか？
              </dt>
              <dd className={styles.faqAnswer}>
                A. 茨城メモリアルパークはどの宗派の方でもご利用いただけます。宗派を問わずお受けしております。
              </dd>
            </div>

            <div className={styles.faqItem}>
              <dt className={styles.faqQuestion}>
                Q. 茨城メモリアルパークの7年忌以降の管理はどうなりますか？
              </dt>
              <dd className={styles.faqAnswer}>
                A. 茨城メモリアルパークでは7年忌以降は年会費10,000円のみで、永代にわたり管理・供養いたします。お墓の撤去費用などは一切かかりません。
              </dd>
            </div>

            <div className={styles.faqItem}>
              <dt className={styles.faqQuestion}>
                Q. 茨城メモリアルパークの見学はできますか？
              </dt>
              <dd className={styles.faqAnswer}>
                A. はい、茨城メモリアルパークは随時見学を受け付けております。事前にお電話（090-3068-5360）でご連絡いただければ、詳しくご案内いたします。
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <CTA />
    </>
  );
}