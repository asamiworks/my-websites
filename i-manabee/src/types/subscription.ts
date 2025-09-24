// サブスクリプション関連の型定義
export interface Plan {
  id: 'free' | 'kids' | 'friends' | 'premium';
  name: string;
  displayName: string;
  price: number; // 月額料金（円）
  features: PlanFeatures;
  limits: PlanLimits;
  color: string;
  popular?: boolean;
}

export interface PlanFeatures {
  tokensPerPeriod: number; // -1 = 無制限
  periodsPerDay: number; // 1日の期間数
  maxChildren: number; // -1 = 無制限
  aiModels: string[];
  weeklyReports: boolean;
  prioritySupport: boolean;
  dataExport: boolean;
  archiveAccess: boolean;
}

export interface PlanLimits {
  messagesPerSession: number;
  maxTokensPerMessage: number;
  dailyApiCost: number; // 円
  monthlyApiCost: number; // 円
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsageStats {
  currentPeriod: {
    tokensUsed: number;
    messagesCount: number;
    apiCost: number;
    lastReset: string;
  };
  daily: {
    date: string;
    tokensUsed: number;
    messagesCount: number;
    subjects: Record<string, number>;
  }[];
  weekly: {
    weekStart: string;
    totalTokens: number;
    totalMessages: number;
    averageSessionTime: number;
    topSubjects: string[];
  }[];
}