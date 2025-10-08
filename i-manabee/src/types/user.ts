// ユーザー関連の型定義
export interface User {
  id: string;
  email: string;
  displayName?: string;
  plan: 'free' | 'kids' | 'friends' | 'premium';
  planType?: 'free' | 'kids' | 'friends' | 'premium'; // Alias for backward compatibility
  createdAt: string | any; // Firestore Timestamp or string
  lastLogin: string | any; // Firestore Timestamp or string
  consents: UserConsents;
  settings: UserSettings;
  payment?: PaymentInfo;
}

export interface UserConsents {
  terms: {
    accepted: boolean;
    timestamp: string | any; // Firestore Timestamp or string
    version?: string;
  };
  privacy: {
    accepted: boolean;
    timestamp: string | any; // Firestore Timestamp or string
    version?: string;
  };
  coppa?: {
    accepted: boolean;
    timestamp: string | any; // Firestore Timestamp or string
    parentEmail?: string;
    version?: string;
  };
  voiceInput?: {
    accepted: boolean;
    timestamp: string | any; // Firestore Timestamp or string
    version?: string;
  };
}

export interface UserSettings {
  emailNotifications: boolean;
  weeklyReports: boolean;
  safetyAlerts: boolean;
  emergencyContact?: string;
  language?: 'ja' | 'en'; // 将来の多言語対応
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