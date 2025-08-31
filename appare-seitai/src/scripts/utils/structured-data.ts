import { SiteConfig, StructuredData } from '../../types';

export function createStructuredData(config: SiteConfig): StructuredData | StructuredData[] {
  const { business, contact, siteUrl, owner } = config;
  
  // Person構造化データ（院長情報）
  const personData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}#owner`,
    name: owner.name,
    alternateName: [owner.nameKana, owner.nameRomaji],
    jobTitle: owner.title,
    worksFor: {
      '@type': 'MedicalBusiness',
      name: business.name
    },
    image: `${siteUrl}${owner.image}`,
    description: owner.description,
    url: `${siteUrl}#director`
  };
  
  // MedicalBusiness構造化データ
  const businessData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': siteUrl,
    name: business.name,
    alternateName: 'あっぱれ整体院',
    url: siteUrl,
    logo: `${siteUrl}/images/icons/logo.png`,
    image: [
      `${siteUrl}/images/hero/hero1.jpg`,
      `${siteUrl}/images/hero/hero2.jpg`,
      `${siteUrl}/images/hero/hero3.jpg`
    ],
    description: config.defaultDescription,
    priceRange: business.priceRange,
    telephone: business.telephone,
    founder: {
      '@type': 'Person',
      name: owner.name,
      alternateName: [owner.nameKana, owner.nameRomaji],
      jobTitle: owner.title
    },
    employee: [
      {
        '@type': 'Person',
        name: owner.name,
        alternateName: [owner.nameKana, owner.nameRomaji],
        jobTitle: owner.title,
        image: `${siteUrl}${owner.image}`
      }
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude
    },
    openingHoursSpecification: parseOpeningHours(business.openingHours),
    sameAs: [
      contact.instagramUrl,
      contact.lineUrl
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: business.telephone,
      contactType: 'reservations',
      availableLanguage: ['Japanese'],
      areaServed: {
        '@type': 'City',
        name: '龍ケ崎市'
      }
    },
    paymentAccepted: business.paymentAccepted,
    amenityFeature: business.amenityFeature.map(feature => ({
      '@type': 'LocationFeatureSpecification',
      name: feature.name,
      value: feature.value
    })),
    medicalSpecialty: [
      'Chiropractic',
      'PhysicalTherapy',
      'Massage'
    ],
    availableService: [
      {
        '@type': 'MedicalTherapy',
        name: '整体・骨盤矯正',
        description: '背骨・骨盤の歪みを整え、身体のバランスを改善',
        provider: {
          '@type': 'Person',
          name: owner.name
        }
      },
      {
        '@type': 'MedicalTherapy',
        name: 'リンパドレナージュ',
        description: 'リンパの流れを促進し、むくみや疲労を改善',
        provider: {
          '@type': 'Person',
          name: owner.name
        }
      },
      {
        '@type': 'MedicalTherapy',
        name: 'ヘッドスパ',
        description: '頭皮マッサージで頭痛・眼精疲労を改善',
        provider: {
          '@type': 'Person',
          name: owner.name
        }
      },
      {
        '@type': 'MedicalTherapy',
        name: '産後骨盤矯正',
        description: '産後の骨盤の歪みを整え、体型回復をサポート',
        provider: {
          '@type': 'Person',
          name: owner.name
        }
      }
    ],
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `tel:${contact.tel}`,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform'
        ]
      },
      result: {
        '@type': 'Reservation',
        name: '施術予約'
      }
    }
  };
  
  // パンくずリストの構造化データ（新規追加）
  const breadcrumbData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '整体・骨盤矯正',
        item: `${siteUrl}#menu`
      }
    ]
  };
  
  // FAQの構造化データ（新規追加）
  const faqData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '施術時間はどのくらいですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '施術時間は30分から120分まで、お客様の症状やご希望に合わせて選べます。初回の方は、カウンセリングを含めて60分程度をおすすめしています。'
        }
      },
      {
        '@type': 'Question',
        name: '予約は必要ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '当院は完全予約制となっております。お電話（0297-64-8008）またはLINE（@rjx1276z）でご予約ください。'
        }
      },
      {
        '@type': 'Question',
        name: '駐車場はありますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'はい、無料駐車場を完備しております。お車でも安心してご来院ください。'
        }
      },
      {
        '@type': 'Question',
        name: '保険は使えますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '申し訳ございませんが、当院では保険診療は行っておりません。自費診療のみとなります。'
        }
      },
      {
        '@type': 'Question',
        name: '産後骨盤矯正はいつから受けられますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '産後2ヶ月から9ヶ月までをオススメしております。産後の体調が安定してからお越しください。'
        }
      }
    ]
  };
  
  // 複数の構造化データを配列で返す
  return [businessData, personData, breadcrumbData, faqData];
}

// 営業時間のパース（改善版）
function parseOpeningHours(hours: string[]): any[] {
  const dayMap: { [key: string]: string } = {
    'Mo': 'Monday',
    'Tu': 'Tuesday',
    'We': 'Wednesday',
    'Th': 'Thursday',
    'Fr': 'Friday',
    'Sa': 'Saturday',
    'Su': 'Sunday'
  };
  
  const specifications: any[] = [];
  
  hours.forEach(hour => {
    const dayMatch = hour.match(/^(Mo|Tu|We|Th|Fr|Sa|Su)/);
    if (!dayMatch) return;
    
    const day = dayMatch[1];
    const timeSlots = hour.substring(day.length).trim();
    const slots = timeSlots.split(',');
    
    slots.forEach(slot => {
      const timeMatch = slot.trim().match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
      if (timeMatch) {
        specifications.push({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: dayMap[day],
          opens: timeMatch[1],
          closes: timeMatch[2]
        });
      }
    });
  });
  
  return specifications;
}