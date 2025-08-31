import { Metadata } from 'next'

// サイト基本情報
const siteConfig = {
  name: 'PILIAS ARTMAKE',
  title: 'PILIAS ARTMAKE | 医療アートメイク・パラメディカルアートメイク専門',
  description: '医療アートメイクとパラメディカルアートメイクの専門クリニック。銀座・柏・横浜で展開。眉毛、リップ、傷跡修正、白斑、口唇口蓋裂など幅広い施術に対応。',
  url: 'https://pilias-artmake.com',
  ogImage: 'https://pilias-artmake.com/og-image.jpg',
  keywords: [
    '医療アートメイク',
    'パラメディカルアートメイク',
    '眉毛アートメイク',
    'リップアートメイク',
    '傷跡修正',
    '白斑',
    '口唇口蓋裂',
    'ストレッチマーク',
    '銀座',
    '柏',
    '横浜',
    'PILIAS ARTMAKE'
  ]
}

// ページ別メタデータ
const pageMetadata: Record<string, Metadata> = {
  home: {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    openGraph: {
      title: siteConfig.title,
      description: siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: 'PILIAS ARTMAKE'
        }
      ],
      locale: 'ja_JP',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.ogImage]
    },
    alternates: {
      canonical: siteConfig.url
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  },
  
  eyebrow: {
    title: '眉毛アートメイク | PILIAS ARTMAKE',
    description: '自然な仕上がりの眉毛アートメイク。毛並み、パウダー、MIX技法で理想の眉毛を実現。施術の流れ、料金、ダウンタイムについて詳しくご説明します。',
    keywords: ['眉毛アートメイク', '毛並み', 'パウダー眉', 'MIX技法', '3D眉', '4D眉'],
    openGraph: {
      title: '眉毛アートメイク | PILIAS ARTMAKE',
      description: '自然な仕上がりの眉毛アートメイク。毛並み、パウダー、MIX技法で理想の眉毛を実現。',
      url: `${siteConfig.url}/artmake-features/eyebrow`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/artmake-features/eyebrow`
    }
  },
  
  lip: {
    title: 'リップアートメイク | PILIAS ARTMAKE',
    description: '美しい唇を24時間キープ。フルリップ、リップライン、グラデーションリップなど、お客様に合わせたデザインをご提案します。',
    keywords: ['リップアートメイク', 'フルリップ', 'リップライン', 'グラデーションリップ', '唇アートメイク'],
    openGraph: {
      title: 'リップアートメイク | PILIAS ARTMAKE',
      description: '美しい唇を24時間キープ。フルリップ、リップライン、グラデーションリップなど。',
      url: `${siteConfig.url}/artmake-features/lip`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/artmake-features/lip`
    }
  },
  
  paramedical: {
    title: 'パラメディカルアートメイク | PILIAS ARTMAKE',
    description: '医療補助としてのアートメイク。傷跡修正、白斑、口唇口蓋裂、ストレッチマークなど、お悩みに寄り添う施術をご提供します。',
    keywords: ['パラメディカルアートメイク', '医療補助', '傷跡修正', '白斑', '口唇口蓋裂', 'ストレッチマーク'],
    openGraph: {
      title: 'パラメディカルアートメイク | PILIAS ARTMAKE',
      description: '医療補助としてのアートメイク。傷跡修正、白斑、口唇口蓋裂、ストレッチマークなど。',
      url: `${siteConfig.url}/paramedical`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/paramedical`
    }
  },
  
  scar: {
    title: '傷跡修正 | パラメディカルアートメイク | PILIAS ARTMAKE',
    description: '傷跡を目立たなくするパラメディカルアートメイク。手術跡、外傷跡などに対応。自然な仕上がりで自信を取り戻します。',
    keywords: ['傷跡修正', 'パラメディカルアートメイク', '手術跡', '外傷跡', 'スカーカモフラージュ'],
    openGraph: {
      title: '傷跡修正 | パラメディカルアートメイク | PILIAS ARTMAKE',
      description: '傷跡を目立たなくするパラメディカルアートメイク。手術跡、外傷跡などに対応。',
      url: `${siteConfig.url}/paramedical/scar`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/paramedical/scar`
    }
  },
  
  vitiligo: {
    title: '白斑カモフラージュ | パラメディカルアートメイク | PILIAS ARTMAKE',
    description: '白斑でお悩みの方へ。医療アートメイクで自然な肌色を再現。QOL向上をサポートします。',
    keywords: ['白斑', 'パラメディカルアートメイク', '白斑カモフラージュ', '尋常性白斑', '医療アートメイク'],
    openGraph: {
      title: '白斑カモフラージュ | パラメディカルアートメイク | PILIAS ARTMAKE',
      description: '白斑でお悩みの方へ。医療アートメイクで自然な肌色を再現。',
      url: `${siteConfig.url}/paramedical/vitiligo`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/paramedical/vitiligo`
    }
  },
  
  cleftLip: {
    title: '口唇口蓋裂修正 | パラメディカルアートメイク | PILIAS ARTMAKE',
    description: '口唇口蓋裂の手術跡を自然にカバー。繊細な技術で唇の輪郭を美しく整えます。',
    keywords: ['口唇口蓋裂', 'パラメディカルアートメイク', '口唇裂', '口蓋裂', '医療アートメイク'],
    openGraph: {
      title: '口唇口蓋裂修正 | パラメディカルアートメイク | PILIAS ARTMAKE',
      description: '口唇口蓋裂の手術跡を自然にカバー。繊細な技術で唇の輪郭を美しく整えます。',
      url: `${siteConfig.url}/paramedical/cleft-lip`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/paramedical/cleft-lip`
    }
  },
  
  stretchMarks: {
    title: 'ストレッチマーク修正 | パラメディカルアートメイク | PILIAS ARTMAKE',
    description: '妊娠線や肉割れを目立たなくするパラメディカルアートメイク。自然な肌色で美しい肌へ。',
    keywords: ['ストレッチマーク', '妊娠線', '肉割れ', 'パラメディカルアートメイク', '医療アートメイク'],
    openGraph: {
      title: 'ストレッチマーク修正 | パラメディカルアートメイク | PILIAS ARTMAKE',
      description: '妊娠線や肉割れを目立たなくするパラメディカルアートメイク。',
      url: `${siteConfig.url}/paramedical/stretch-marks`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/paramedical/stretch-marks`
    }
  },
  
  flow: {
    title: '施術の流れ | PILIAS ARTMAKE',
    description: 'カウンセリングから施術、アフターケアまでの流れを詳しくご説明。安心して施術を受けていただけます。',
    keywords: ['施術の流れ', 'カウンセリング', 'アートメイク手順', 'アフターケア'],
    openGraph: {
      title: '施術の流れ | PILIAS ARTMAKE',
      description: 'カウンセリングから施術、アフターケアまでの流れを詳しくご説明。',
      url: `${siteConfig.url}/flow`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/flow`
    }
  },
  
  pricing: {
    title: '料金表 | PILIAS ARTMAKE',
    description: '医療アートメイク・パラメディカルアートメイクの料金一覧。明確な料金体系で安心。モニター価格もご用意。',
    keywords: ['アートメイク料金', '価格', 'モニター価格', '料金表'],
    openGraph: {
      title: '料金表 | PILIAS ARTMAKE',
      description: '医療アートメイク・パラメディカルアートメイクの料金一覧。明確な料金体系で安心。',
      url: `${siteConfig.url}/pricing`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/pricing`
    }
  },
  
  clinics: {
    title: '提携院・アクセス | PILIAS ARTMAKE',
    description: '銀座・柏・横浜の提携院情報。各院へのアクセス、診療時間をご案内します。',
    keywords: ['提携院', 'アクセス', '銀座', '柏', '横浜', '診療時間'],
    openGraph: {
      title: '提携院・アクセス | PILIAS ARTMAKE',
      description: '銀座・柏・横浜の提携院情報。各院へのアクセス、診療時間をご案内。',
      url: `${siteConfig.url}/clinics`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/clinics`
    }
  },
  
  greeting: {
    title: '代表挨拶 | PILIAS ARTMAKE',
    description: 'PILIAS ARTMAKE代表からのご挨拶。私たちの理念と想いをお伝えします。',
    keywords: ['代表挨拶', '理念', 'PILIAS ARTMAKE'],
    openGraph: {
      title: '代表挨拶 | PILIAS ARTMAKE',
      description: 'PILIAS ARTMAKE代表からのご挨拶。私たちの理念と想いをお伝えします。',
      url: `${siteConfig.url}/about/greeting`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/about/greeting`
    }
  },
  
  gallery: {
    title: '施術症例 | PILIAS ARTMAKE',
    description: '眉毛、リップ、パラメディカルアートメイクの施術症例をご紹介。ビフォーアフターでご確認いただけます。',
    keywords: ['施術症例', 'ビフォーアフター', '症例写真', 'アートメイク事例'],
    openGraph: {
      title: '施術症例 | PILIAS ARTMAKE',
      description: '眉毛、リップ、パラメディカルアートメイクの施術症例をご紹介。',
      url: `${siteConfig.url}/gallery`,
      siteName: siteConfig.name,
      type: 'article'
    },
    alternates: {
      canonical: `${siteConfig.url}/gallery`
    }
  }
}

// メタデータ取得関数
export function getPageMetadata(page: string): Metadata {
  const metadata = pageMetadata[page]
  
  if (!metadata) {
    // デフォルトのメタデータを返す
    return {
      title: siteConfig.title,
      description: siteConfig.description,
      keywords: siteConfig.keywords,
      openGraph: {
        title: siteConfig.title,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.name,
        locale: 'ja_JP',
        type: 'website'
      }
    }
  }
  
  return metadata
}

// サイト情報取得
export function getSiteConfig() {
  return siteConfig
}

// デフォルトメタデータ
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ],
    locale: 'ja_JP',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
}