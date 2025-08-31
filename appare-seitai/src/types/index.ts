// サイト設定の型定義
export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  ogImage: string;
  favicon: string;
  themeColor: string;
  owner: OwnerInfo; // 追加
  contact: ContactInfo;
  business: BusinessInfo;
  seo: SEOConfig;
  developer: DeveloperInfo;
}

// オーナー情報の型定義（新規追加）
export interface OwnerInfo {
  name: string;
  nameKana: string;
  nameRomaji: string;
  title: string;
  qualification: string;
  image: string;
  description: string;
}

export interface ContactInfo {
  tel: string;
  telDisplay: string;
  lineId: string;
  lineUrl: string;
  instagramId: string;
  instagramUrl: string;
}

export interface BusinessInfo {
  name: string;
  type: string;
  priceRange: string;
  address: Address;
  geo: GeoCoordinates;
  openingHours: string[];
  closedDays: string[]; // 追加
  telephone: string;
  paymentAccepted: string[];
  amenityFeature: AmenityFeature[];
  founder: string; // 追加
}

export interface Address {
  postalCode: string;
  addressCountry: string;
  addressRegion: string;
  addressLocality: string;
  streetAddress: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface AmenityFeature {
  name: string;
  value: string;
}

export interface SEOConfig {
  canonicalUrl: string;
  locale: string;
  robots: string;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
}

export interface DeveloperInfo {
  name: string;
  url: string;
}

// メニュー関連の型定義
export interface MenuData {
  categories: MenuCategory[];
  additionalServices?: Service[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string; // 追加
  popular?: boolean; // 追加
  badge?: string;
  badgeType?: 'popular' | 'new' | 'limited';
  note?: string; // 追加
  notes?: MenuNote[];
  items: MenuItem[];
  discount?: { // 追加
    first?: string;
    birthday?: string;
  };
}

export interface MenuNote {
  type: 'discount' | 'info' | 'warning';
  text: string;
  position?: 'top' | 'bottom';
}

export interface MenuItem {
  id?: string; // 追加
  name: string;
  duration?: number | string; // 追加
  price: number;
  originalPrice?: number;
  description?: string;
  popular?: boolean; // 追加
  note?: string; // 追加
  discountPrice?: number; // 追加
  discountNote?: string; // 追加
}

export interface Service {
  name: string;
  description: string;
}

// イベント関連の型定義
export interface EventImage {
  src: string;
  alt?: string;
  title?: string;
  date?: string;
}

// コンポーネントのプロパティ型
export interface ComponentProps {
  className?: string;
  id?: string;
  data?: any;
}

export interface CTAButtonProps {
  type: 'tel' | 'line' | 'instagram';
  label: string;
  info: string;
  href: string;
}

// 構造化データの型定義
export interface StructuredData {
  '@context': string;
  '@type': string | string[];
  [key: string]: any;
}

// ユーティリティ型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type HTMLString = string;

// DOM要素の型
export type QuerySelector = string;
export type ElementOrNull = Element | null;
export type NodeListOrNull = NodeList | null;