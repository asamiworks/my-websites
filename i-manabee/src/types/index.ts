// 共通型定義とAPIレスポンス
export * from './user';
export * from './chat';
export * from './safety';
export * from './subscription';

// 共通の型定義
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ValidationError[];
  statusCode: number;
}

// UI関連の型
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: string;
  retryable?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: string;
}

// 年齢グループ関連
export type AgeGroup = 'junior' | 'middle' | 'senior';

export interface AgeGroupConfig {
  id: AgeGroup;
  name: string;
  displayName: string;
  ageRange: string;
  description: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  features: {
    maxSessionTime: number; // 分
    autoLogout: boolean;
    parentOverride: boolean;
    voiceInput: boolean;
  };
}

// 教科関連
export type Subject = '算数・数学' | '理科' | '英語' | '国語' | '社会' | 'プログラミング' | '悩み相談' | '一般';

export interface SubjectConfig {
  id: Subject;
  name: string;
  description: string;
  icon: string;
  aiModel: string;
  color: string;
  ageGroups: AgeGroup[];
}

// 環境変数の型定義
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_FIREBASE_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  NEXT_PUBLIC_FIREBASE_APP_ID: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  GOOGLE_AI_API_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  SESSION_SECRET: string;
}