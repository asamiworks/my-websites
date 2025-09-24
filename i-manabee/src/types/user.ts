// ユーザー関連の型定義
export interface User {
  id: string;
  email: string;
  plan: 'free' | 'kids' | 'friends' | 'premium';
  createdAt: string;
  lastLogin: string;
  consents: UserConsents;
  settings: UserSettings;
  payment?: PaymentInfo;
}

export interface UserConsents {
  terms: {
    accepted: boolean;
    timestamp: string;
  };
  privacy: {
    accepted: boolean;
    timestamp: string;
  };
  coppa?: {
    accepted: boolean;
    timestamp: string;
    parentEmail: string;
  };
  voiceInput?: {
    accepted: boolean;
    timestamp: string;
  };
}

export interface UserSettings {
  emailNotifications: boolean;
  weeklyReports: boolean;
  safetyAlerts: boolean;
  emergencyContact?: string;
}

export interface PaymentInfo {
  stripeCustomerId: string;
  subscriptionId: string;
  nextBillingDate: string;
}

export interface Child {
  id: string;
  parentId: string;
  nickname: string;
  birthMonth: string; // YYYY-MM
  avatar: string;
  pin: string; // bcrypt hashed
  ageGroup: 'junior' | 'middle' | 'senior';
  createdAt: string;
  lastActive: string;
  isActive: boolean;
}