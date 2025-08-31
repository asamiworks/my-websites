// src/types/company.ts

// 基本的な会社情報（公開情報）
export interface CompanyBasicInfo {
    id: string;
    name: string;
    nameKana: string;
    establishedYear: number;
    capital?: number; // 資本金（万円）
    employees?: number; // 従業員数
    
    // 連絡先情報
    address: {
      prefecture: string;
      city: string;
      street: string;
      postalCode: string;
    };
    tel: string;
    fax?: string;
    website?: string;
    email?: string;
    
    // 営業情報
    businessHours?: string;
    holidays?: string;
    
    // 許可・資格
    licenses: {
      constructionLicense: string; // 建設業許可番号
      architectLicense?: string; // 一級建築士事務所登録番号
      takkenLicense?: string; // 宅建業免許番号
    };
    
    // 対応エリア
    serviceAreas: string[]; // 都道府県のリスト
    
    // 基本的な特徴（公開情報から判断できるもの）
    companyType: CompanyType;
    specialties: Specialty[];
    
    // メタ情報
    createdAt: Date;
    updatedAt: Date;
    isVerified: boolean; // 情報が確認済みか
    dataSource: 'public' | 'official' | 'api'; // データソース
  }
  
  // プレミアム会社情報（契約企業のみ）
  export interface CompanyPremiumInfo extends CompanyBasicInfo {
    isPremium: true;
    premiumStartDate: Date;
    premiumEndDate: Date;
    
    // PR情報
    pr: {
      catchphrase: string;
      description: string;
      strengths: string[];
      achievements: Achievement[];
      awards?: Award[];
    };
    
    // 詳細情報
    detailedInfo: {
      averagePrice?: PriceRange; // 平均坪単価
      constructionPeriod?: string; // 平均工期
      annualBuildings?: number; // 年間建築棟数
      warrantyPeriod?: string; // 保証期間
      afterService?: string; // アフターサービス
    };
    
    // メディア
    media: {
      logo?: string; // ロゴURL
      images: CompanyImage[];
      videos?: VideoInfo[];
      catalog?: string; // カタログPDF URL
    };
    
    // 施工事例（許可を得たもののみ）
    showcases?: Showcase[];
    
    // スタッフ情報
    staff?: StaffMember[];
    
    // イベント・キャンペーン
    events?: Event[];
    campaigns?: Campaign[];
    
    // 問い合わせ設定
    inquirySettings: {
      directInquiryEnabled: boolean;
      inquiryEmail?: string;
      inquiryNotification: boolean;
    };
  }
  
  // 会社タイプ
  export type CompanyType = 
    | 'ハウスメーカー'
    | '工務店'
    | '設計事務所'
    | 'ローコスト住宅'
    | '輸入住宅'
    | 'リフォーム会社';
  
  // 得意分野
  export type Specialty = 
    | '注文住宅'
    | '建売住宅'
    | '二世帯住宅'
    | '平屋'
    | '3階建て'
    | 'ZEH住宅'
    | '高気密高断熱'
    | '自然素材'
    | 'デザイン住宅'
    | 'ローコスト住宅'
    | '狭小住宅'
    | '店舗併用住宅'
    | '賃貸併用住宅';
  
  // 価格帯
  export interface PriceRange {
    min: number;
    max: number;
    unit: '万円/坪';
  }
  
  // 実績
  export interface Achievement {
    year: number;
    description: string;
    value?: string;
  }
  
  // 受賞歴
  export interface Award {
    year: number;
    name: string;
    organization: string;
  }
  
  // 会社画像
  export interface CompanyImage {
    id: string;
    url: string;
    caption: string;
    type: 'exterior' | 'interior' | 'office' | 'staff' | 'other';
  }
  
  // 動画情報
  export interface VideoInfo {
    id: string;
    title: string;
    url: string;
    thumbnail?: string;
    duration?: string;
  }
  
  // 施工事例
  export interface Showcase {
    id: string;
    title: string;
    description: string;
    images: string[];
    details: {
      price?: string;
      area?: string;
      family?: string;
      completionDate?: Date;
    };
    tags: string[];
  }
  
  // スタッフ情報
  export interface StaffMember {
    id: string;
    name: string;
    position: string;
    message?: string;
    photo?: string;
    qualifications?: string[];
  }
  
  // イベント情報
  export interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    registrationRequired: boolean;
    registrationUrl?: string;
  }
  
  // キャンペーン情報
  export interface Campaign {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    conditions?: string;
  }
  
  // 検索フィルター
  export interface CompanySearchFilters {
    prefecture?: string;
    city?: string;
    companyTypes?: CompanyType[];
    specialties?: Specialty[];
    priceRange?: {
      min?: number;
      max?: number;
    };
    hasShowcase?: boolean;
    isPremium?: boolean;
  }
  
  // 並び替えオプション
  export type CompanySortOption = 
    | 'recommended' // おすすめ順（プレミアム優先）
    | 'name' // 名前順
    | 'established' // 設立年順
    | 'updated'; // 更新日順
  
  // API レスポンス型
  export interface CompanyListResponse {
    companies: (CompanyBasicInfo | CompanyPremiumInfo)[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }
  
  // 会社詳細レスポンス
  export interface CompanyDetailResponse {
    company: CompanyBasicInfo | CompanyPremiumInfo;
    relatedCompanies?: CompanyBasicInfo[]; // 関連会社
    nearbyCompanies?: CompanyBasicInfo[]; // 近隣の会社
  }