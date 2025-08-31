// 国土交通省 土地総合情報システムAPI 型定義

// 都道府県情報
export interface Prefecture {
    prefectureCode: string;
    prefectureName: string;
  }
  
  // 市区町村情報
  export interface City {
    cityCode: string;
    cityName: string;
  }
  
  // 地価公示・都道府県地価調査データ
  export interface LandPriceData {
    // 基本情報
    prefectureCode: string;
    prefectureName: string;
    cityCode: string;
    cityName: string;
    
    // 地点情報
    stationName?: string;        // 最寄駅
    distance?: number;           // 駅からの距離（m）
    address: string;             // 住所
    landUse: string;            // 用途
    
    // 価格情報
    currentPrice: number;        // 現在価格（円/㎡）
    previousPrice?: number;      // 前年価格（円/㎡）
    changeRate?: number;         // 変動率（%）
    
    // 調査情報
    surveyYear: number;          // 調査年
    surveyType: 'LandPrice' | 'PrefectureLandPrice'; // 地価公示 or 都道府県地価調査
    
    // 土地属性
    area?: number;               // 面積（㎡）
    shape?: string;              // 形状
    frontage?: number;           // 間口（m）
    depth?: number;              // 奥行（m）
    direction?: string;          // 方位
    currentUse?: string;         // 現況
    buildingStructure?: string;  // 建物構造
    floorsAbove?: number;        // 地上階数
    floorsBelow?: number;        // 地下階数
    
    // その他
    remarks?: string;            // 備考
  }
  
  // API レスポンス型
  export interface LandPriceApiResponse {
    status: string;
    data: LandPriceData[];
  }
  
  // 地価推移データ（アプリケーション用）
  export interface LandPriceHistory {
    year: number;
    averagePrice: number;
    dataCount: number;
    changeRate?: number;
  }
  
  // 地域の地価統計（アプリケーション用）
  export interface AreaLandPriceStats {
    prefectureCode: string;
    prefectureName: string;
    cityCode: string;
    cityName: string;
    
    // 最新データ
    latestYear: number;
    averagePrice: number;      // 平均価格（円/㎡）
    medianPrice: number;       // 中央価格（円/㎡）
    maxPrice: number;          // 最高価格（円/㎡）
    minPrice: number;          // 最低価格（円/㎡）
    dataPoints: number;        // データ地点数
    
    // 推移データ
    history: LandPriceHistory[];
    
    // 変動情報
    yearOverYearChange: number;   // 前年比（%）
    fiveYearChange?: number;      // 5年前比（%）
    
    lastUpdated: Date;
  }