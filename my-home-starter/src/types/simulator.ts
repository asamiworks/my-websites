// src/types/simulator.ts

// 詳細な部屋情報の型定義
export interface RoomDetail {
  id: string;
  size: number;
  preset: string;
}

export interface DetailedRoomData {
  ldkRooms?: RoomDetail[];
  japaneseRooms?: RoomDetail[];
  masterBedrooms?: RoomDetail[];
  westernRooms?: RoomDetail[];
  otherRooms?: RoomDetail[];
}

export interface HouseSizeData {
  totalFloorArea: number;
  floors: number;
  ldkSize: number;
  japaneseRoomSize?: number;
  japaneseRooms?: number;
  masterBedroomSize?: number;
  masterBedroomRooms?: number;
  westernRoomSize?: number;
  westernRooms?: number;
  otherRoomSize?: number;
  otherRooms?: number;
}

export interface BuildingLocation {
  prefecture: string;
  city: string;
}

export interface SimulatorData {
  // 総予算関連
  totalBudget: number;
  annualIncome: number;
  monthlyLoanRepayment: number;
  downPayment: number;
  spouseIncome?: number;
  spouseLoanRepayment?: number;
  miscCosts?: number;           // 諸経費（追加）
  buildingBudget?: number;      // 建物予算（追加）
  
  // 家のサイズ
  houseSizeData: HouseSizeData;
  
  // 詳細な部屋情報
  detailedRoomData?: DetailedRoomData;
  
  // 建築地
  buildingLocation: BuildingLocation;
  ownershipStatus: string;
  landBudget: number;
  parkingCount?: number;
  
  // 土地価格関連（追加）
  ultimateAverage?: number;     // 最終平均値
  areaDescription?: string;     // エリア説明
  landPriceSource?: string;     // 土地価格の出典
  landPriceYear?: number;       // 土地価格の年度
  
  // 診断結果
  houseTypeDiagnosis?: Record<string, number>;
  
  // 必要予算計算結果（追加）
  requiredBuildingBudget?: number;  // 必要建物予算
  requiredUnitPrice?: number;       // 必要坪単価
  
  // 旧形式の個別フィールド（互換性のため）
  selectedPrefecture?: string;
  selectedCity?: string;
  q1?: number;
  q2?: number;
  pricePerTsubo?: number;
  calculatedArea?: number;
  
  // ユーザー情報
  name?: string;
  email?: string;
  
  // メタデータ
  createdAt?: Date;
  updatedAt?: Date;
  migratedAt?: Date;
  lastSyncedAt?: Date;
  lastPartialSyncedAt?: Date;
}

export interface UserState extends SimulatorData {
  nickname: string;
  unreadMessages: number;
}