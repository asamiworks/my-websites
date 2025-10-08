// メッセージ候補システムの型定義

export interface MessageSuggestion {
  id: string;
  text: string;
  source: 'static' | 'rule-based';
  priority: number;
}

export interface ConversationAnalysis {
  extractedKeywords: string[];
  detectedTopics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  messageCount: number;
  lastUpdated: Date;
}

export interface SuggestionRule {
  id: string;
  name: string;
  subject: string;
  trigger: {
    keywords: string[];
    requiredCount: number;
    contextWindow: number;
  };
  suggestions: string[];
  priority: number;
}

// チャット履歴関連
export interface Conversation {
  id: string;
  userId: string;
  childId: string;
  childName: string;
  subject: string;
  title?: string;
  messageCount: number;
  createdAt: any; // Firestore Timestamp
  lastMessageAt: any; // Firestore Timestamp
}

export interface Message {
  id: string;
  conversationId?: string;
  userId?: string;
  childId?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: any; // Firestore Timestamp
  tokens?: number;
  metadata?: {
    model?: string;
    safetyScore?: number;
    reasoning?: string;
    ageGroup?: string;
    promptTokens?: number;
    completionTokens?: number;
    cost?: number;
  };
}