// チャット関連の型定義
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokens: number;
  flagged?: boolean;
}

export interface Chat {
  id: string;
  childId: string;
  startedAt: string;
  lastMessageAt: string;
  messages: ChatMessage[];
  metadata: ChatMetadata;
}

export interface ChatMetadata {
  totalTokens: number;
  messageCount: number;
  subject?: string;
  aiModel: string;
}

export interface TokenUsage {
  userId: string;
  date: string; // YYYY-MM-DD
  periods: {
    morning: UsagePeriod;
    evening: UsagePeriod;
  };
  apiCost: number;
  subjects: Record<string, number>;
}

export interface UsagePeriod {
  messages: number;
  tokens: number;
  resetAt: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google';
  model: string;
  subject: string;
  tokensPerDollar: number;
  maxTokens: number;
}