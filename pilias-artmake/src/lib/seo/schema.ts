import { Thing, WithContext } from 'schema-dts'

// 組織情報
export const organizationSchema = {
  '@type': 'Organization' as const,
  '@id': 'https://pilias-artmake.com/#organization',
  name: 'PILIAS ARTMAKE',
  url: 'https://pilias-artmake.com',
  logo: 'https://pilias-artmake.com/images/logo.png',
  description: '医療アートメイクとパラメディカルアートメイクの専門クリニック',
  sameAs: [
    'https://www.instagram.com/asuka_artmake_para/',
  ],
}

// 医療ビジネススキーマ
export const medicalBusinessSchema = {
  '@type': 'MedicalBusiness' as const,
  '@id': 'https://pilias-artmake.com/#medicalbusiness',
  name: 'PILIAS ARTMAKE',
  description: '医療アートメイク・パラメディカルアートメイク専門クリニック',
  url: 'https://pilias-artmake.com',
  telephone: '',
  priceRange: '¥30,000-¥55,000',
  medicalSpecialty: 'PlasticSurgery',
  hasOfferCatalog: {
    '@type': 'OfferCatalog' as const,
    name: '施術メニュー',
    itemListElement: [
      {
        '@type': 'Offer' as const,
        itemOffered: {
          '@type': 'Service' as const,
          name: '眉毛アートメイク',
          description: '毛並み・パウダー・MIX技法による眉毛アートメイク',
        },
      },
      {
        '@type': 'Offer' as const,
        itemOffered: {
          '@type': 'Service' as const,
          name: 'リップアートメイク',
          description: '自然で美しいリップカラーを長期間キープ',
        },
      },
      {
        '@type': 'Offer' as const,
        itemOffered: {
          '@type': 'Service' as const,
          name: 'パラメディカルアートメイク',
          description: '傷痕・白斑・ストレッチマークなどの医療補助アートメイク',
        },
      },
    ],
  },
  areaServed: [
    {
      '@type': 'City' as const,
      name: '銀座',
    },
    {
      '@type': 'City' as const,
      name: '柏',
    },
    {
      '@type': 'City' as const,
      name: '横浜',
    },
  ],
}

// 提携院のローカルビジネススキーマ
export const clinicsSchema = {
  ginza: {
    '@type': 'LocalBusiness' as const,
    name: 'PILIAS ARTMAKE 銀座提携院',
    description: '銀座・新橋エリアの医療アートメイク提携院',
    address: {
      '@type': 'PostalAddress' as const,
      addressLocality: '銀座',
      addressRegion: '東京都',
      addressCountry: 'JP',
    },
  },
  kashiwa: {
    '@type': 'LocalBusiness' as const,
    name: 'PILIAS ARTMAKE 柏提携院',
    description: '千葉県柏市の医療アートメイク提携院',
    address: {
      '@type': 'PostalAddress' as const,
      addressLocality: '柏市',
      addressRegion: '千葉県',
      addressCountry: 'JP',
    },
  },
  yokohama: {
    '@type': 'LocalBusiness' as const,
    name: 'PILIAS ARTMAKE 横浜提携院',
    description: '横浜の医療アートメイク提携院',
    address: {
      '@type': 'PostalAddress' as const,
      addressLocality: '横浜市',
      addressRegion: '神奈川県',
      addressCountry: 'JP',
    },
  },
}

// FAQスキーマ
export const faqSchema = {
  '@type': 'FAQPage' as const,
  mainEntity: [
    {
      '@type': 'Question' as const,
      name: 'アートメイクの持続期間はどのくらいですか？',
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: '個人差はありますが、通常1〜3年程度持続します。肌質や生活習慣により変動します。',
      },
    },
    {
      '@type': 'Question' as const,
      name: 'アートメイクは何回で完成しますか？',
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: '通常2〜3回の施術で完成します。1回目で土台を作り、2回目以降で色や形を調整していきます。',
      },
    },
    {
      '@type': 'Question' as const,
      name: '施術中の痛みはありますか？',
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: '麻酔クリームを使用するため、痛みは最小限に抑えられます。個人差はありますが、多くの方が許容できる程度です。',
      },
    },
    {
      '@type': 'Question' as const,
      name: 'ダウンタイムはどのくらいですか？',
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: '眉毛は3〜7日、リップは1週間程度で薄いかさぶたが剥がれます。この期間は施術部位のケアが必要です。',
      },
    },
    {
      '@type': 'Question' as const,
      name: 'モニター価格はありますか？',
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: 'はい、モニター価格をご用意しています。全顔写真のSNS掲載と2回目施術にご協力いただける方が対象です。',
      },
    },
  ],
}

// 構造化データを生成する関数
export function generateStructuredData(type: string, data?: any): WithContext<Thing> {
  const baseContext = {
    '@context': 'https://schema.org' as const,
  }

  switch (type) {
    case 'organization':
      return {
        ...baseContext,
        ...organizationSchema,
      } as WithContext<Thing>
    case 'medical':
      return {
        ...baseContext,
        ...medicalBusinessSchema,
      } as WithContext<Thing>
    case 'faq':
      return {
        ...baseContext,
        ...faqSchema,
      } as WithContext<Thing>
    case 'clinic':
      return {
        ...baseContext,
        ...data,
      } as WithContext<Thing>
    default:
      return {
        '@context': 'https://schema.org',
        '@type': 'Thing',
      } as WithContext<Thing>
  }
}

// JSON-LD用の文字列生成関数
export function generateJsonLd(type: string, data?: any): string {
  const structuredData = generateStructuredData(type, data)
  return JSON.stringify(structuredData)
}