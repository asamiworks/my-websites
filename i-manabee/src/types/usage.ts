// 使用量管理関連の型定義

export type AIModel = 'gpt-4o-mini' | 'gemini-2.5-flash-lite' | 'claude-sonnet-4.5';

export type Subject =
  | 'math'
  | 'japanese'
  | 'english'
  | 'science'
  | 'social'
  | 'programming'
  | 'counseling'
  | 'general';

export interface PeriodUsage {
  messages: number;
  tokens: number;
  resetAt: Date | string;
  remaining: number;
}

export interface DailyUsage {
  totalMessages: number;
  totalTokens: number;
  apiCost: number;
  subjectBreakdown: Record<Subject, number>;
}

export interface Usage {
  userId: string;
  date: string; // YYYY-MM-DD
  periods: {
    morning: PeriodUsage;
    evening: PeriodUsage;
  };
  dailyTotal: DailyUsage;
}

export interface TokenLimit {
  plan: Plan;
  messagesPerPeriod: number | 'unlimited';
  tokensPerPeriod: number | 'unlimited';
}

export interface UsageStats {
  currentPeriod: PeriodUsage;
  dailyTotal: DailyUsage;
  remaining: {
    messages: number | 'unlimited';
    tokens: number | 'unlimited';
  };
  resetTime: Date;
}

export type Plan = 'free' | 'kids' | 'friends' | 'premium';