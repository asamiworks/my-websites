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
  planId?: string;
  plan?: 'free' | 'kids' | 'friends' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | 'incomplete';
  currentPeriodStart: {
    seconds: number;
    nanoseconds: number;
  } | string;
  currentPeriodEnd: {
    seconds: number;
    nanoseconds: number;
  } | string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripePriceId?: string;
  createdAt: string | {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt: string | {
    seconds: number;
    nanoseconds: number;
  };
}

export interface Invoice {
  id: string;
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  period: {
    start: Date;
    end: Date;
  };
  paidAt?: Date;
  dueDate: Date;
  url?: string;
  createdAt: Date;
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