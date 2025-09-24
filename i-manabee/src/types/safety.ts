// 安全性関連の型定義
export interface SafetyLog {
  id: string;
  childId: string;
  parentId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  keyword: string;
  message: string;
  context: string; // 前後のメッセージ
  parentNotified: boolean;
  notifiedAt?: string;
  resolved: boolean;
}

export interface SafetyKeyword {
  word: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'suicide' | 'bullying' | 'abuse' | 'violence' | 'inappropriate';
  action: 'log' | 'notify' | 'alert' | 'emergency';
}

export interface SafetyRule {
  id: string;
  keywords: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  response: string;
  notifyParent: boolean;
  blockMessage: boolean;
  emergencyContact?: boolean;
}

export interface EmergencyContact {
  organization: string;
  phone: string;
  website?: string;
  description: string;
  availableHours: string;
  targetAge: 'all' | 'child' | 'teen' | 'adult';
}

export interface SafetyAnalysis {
  isSafe: boolean;
  flaggedKeywords: string[];
  severity: 'low' | 'medium' | 'high' | 'critical' | null;
  recommendedAction: 'proceed' | 'warn' | 'block' | 'emergency';
  alternativeResponse?: string;
}