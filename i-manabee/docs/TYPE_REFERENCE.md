# 📘 i-manabee 型定義リファレンス

最終更新: 2025-10-07  
Version: 2.0.0

---

## 📚 前提ドキュメント

このドキュメントは以下を詳細化したものです：
- [完全仕様書](../i-manabee完全仕様書.md) - 「データベース設計（Firestore）」セクション

**参照先**: すべてのフェーズドキュメント

---

## 🎯 型定義の方針

### ルール
1. **Single Source of Truth**: すべての型はこのファイルで定義
2. **各フェーズドキュメントでは参照のみ**: 型の再定義は禁止
3. **更新時**: 新しい型を追加する場合は必ずこのファイルに記載
4. **命名規則**: PascalCase（例: `User`, `MessageSuggestion`）

### ファイル配置
```typescript
// src/types/index.ts
// このファイルにすべての型をエクスポート
export * from './user';
export * from './chat';
export * from './payment';
export * from './suggestion';

👤 ユーザー関連型
User（保護者）
typescriptinterface User {
  id: string;
  email: string;
  displayName?: string;
  plan: Plan;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  
  // 同意記録
  consents: UserConsents;
  
  // 設定
  settings: UserSettings;
  
  // 支払い情報（Phase 2.3以降）
  payment?: PaymentInfo;
}

type Plan = 'free' | 'kids' | 'friends' | 'premium';

interface UserConsents {
  terms: ConsentRecord;
  privacy: ConsentRecord;
  coppa?: ConsentRecord;        // 13歳未満の場合
  voiceInput?: ConsentRecord;   // 音声入力使用時
}

interface ConsentRecord {
  accepted: boolean;
  timestamp: Timestamp;
  version?: string;             // 規約のバージョン
  parentEmail?: string;         // COPPA用
}

interface UserSettings {
  emailNotifications: boolean;
  weeklyReports: boolean;
  safetyAlerts: boolean;
  emergencyContact?: string;
  language?: 'ja' | 'en';       // 将来の多言語対応
}

interface PaymentInfo {
  stripeCustomerId: string;
  subscriptionId?: string;
  nextBillingDate?: Timestamp;
  cancelAtPeriodEnd?: boolean;
}

Child（子どもプロファイル）
typescriptinterface Child {
  id: string;
  parentId: string;             // User.id
  nickname: string;             // 表示名
  birthMonth: string;           // YYYY-MM形式
  avatar: AvatarType;
  pin: string;                  // bcrypt hashed
  ageGroup: AgeGroup;
  createdAt: Timestamp;
  lastActive: Timestamp;
  isActive: boolean;
  
  // Phase 3以降
  learningHistory?: LearningHistory;
}

type AgeGroup = 'junior' | 'middle' | 'senior';

// junior: 小学3年生まで（〜9歳）
// middle: 小学4年〜中学生（10〜15歳）
// senior: 高校生（16〜18歳）

type AvatarType = 
  | 'bear'      // くま
  | 'rabbit'    // うさぎ
  | 'cat'       // ねこ
  | 'dog'       // いぬ
  | 'panda'     // パンダ
  | 'lion'      // ライオン
  | 'penguin'   // ペンギン
  | 'fox';      // きつね

💬 チャット関連型
Message
typescriptinterface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Timestamp;
  tokens: number;               // トークン数
  model?: AIModel;              // 使用したAIモデル
  
  // 安全性フラグ
  flagged?: boolean;
  flagReason?: string;
  severity?: SafetySeverity;
}

type AIModel = 
  | 'gemini-2.5-flash-lite'     // 算数・理科
  | 'gpt-4o-mini'               // 国語・英語・社会
  | 'claude-sonnet-4.5';        // プログラミング・悩み相談

type SafetySeverity = 'low' | 'medium' | 'high' | 'critical';

Chat（会話セッション）
typescriptinterface Chat {
  id: string;
  childId: string;
  subject: Subject;
  startedAt: Timestamp;
  lastMessageAt: Timestamp;
  messages: Message[];
  metadata: ChatMetadata;
  
  // 会話の状態
  status: 'active' | 'archived';
}

type Subject = 
  | 'math'          // 算数・数学
  | 'japanese'      // 国語
  | 'english'       // 英語
  | 'science'       // 理科
  | 'social'        // 社会
  | 'programming'   // プログラミング
  | 'counseling';   // 悩み相談

interface ChatMetadata {
  totalTokens: number;
  messageCount: number;
  aiModel: AIModel;
  
  // Phase 2.5以降
  detectedTopics?: string[];    // 抽出されたトピック
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

📊 使用量管理関連型
Usage（使用状況）
typescriptinterface Usage {
  userId: string;
  date: string;                 // YYYY-MM-DD
  periods: {
    morning: PeriodUsage;       // 6:00-18:00
    evening: PeriodUsage;       // 18:00-6:00
  };
  dailyTotal: UsageSummary;
}

interface PeriodUsage {
  messages: number;
  tokens: number;
  resetAt: Timestamp;
  remaining: number;            // 残りトークン数
}

interface UsageSummary {
  totalMessages: number;
  totalTokens: number;
  apiCost: number;              // 概算API費用（円）
  subjectBreakdown: Record<Subject, number>; // 教科別トークン数
}

TokenLimit（プラン別制限）
typescriptinterface TokenLimit {
  plan: Plan;
  messagesPerPeriod: number;    // 期あたりメッセージ数上限
  tokensPerPeriod: number;      // 期あたりトークン数上限
  resetSchedule: 'twice-daily'; // 6時・18時
}

const TOKEN_LIMITS: Record<Plan, TokenLimit> = {
  free: {
    plan: 'free',
    messagesPerPeriod: 5,
    tokensPerPeriod: 1000,
    resetSchedule: 'twice-daily'
  },
  kids: {
    plan: 'kids',
    messagesPerPeriod: Infinity,
    tokensPerPeriod: 4000,
    resetSchedule: 'twice-daily'
  },
  friends: {
    plan: 'friends',
    messagesPerPeriod: Infinity,
    tokensPerPeriod: 8000,       // 家族共有
    resetSchedule: 'twice-daily'
  },
  premium: {
    plan: 'premium',
    messagesPerPeriod: Infinity,
    tokensPerPeriod: Infinity,   // 無制限
    resetSchedule: 'twice-daily'
  }
};

💳 決済関連型（Phase 2.3以降）
Subscription
typescriptinterface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  status: SubscriptionStatus;
  
  // Stripe情報
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  
  // 期間
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  
  // キャンセル
  cancelAtPeriodEnd: boolean;
  canceledAt?: Timestamp;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type SubscriptionStatus = 
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'unpaid';

Invoice
typescriptinterface Invoice {
  id: string;
  userId: string;
  stripeInvoiceId: string;
  amount: number;               // 金額（円）
  status: InvoiceStatus;
  dueDate: Timestamp;
  paidAt?: Timestamp;
  invoiceUrl?: string;          // Stripe Hosted Invoice URL
  createdAt: Timestamp;
}

type InvoiceStatus = 
  | 'draft'
  | 'open'
  | 'paid'
  | 'void'
  | 'uncollectible';

💡 メッセージ候補関連型（Phase 2.5以降）
MessageSuggestion
typescriptinterface MessageSuggestion {
  id: string;
  text: string;
  emoji?: string;
  source: SuggestionSource;
  priority: number;             // 表示優先度（高いほど優先）
  
  // メタデータ
  subject?: Subject;
  ageGroup?: AgeGroup;
  
  // 将来の拡張用
  confidence?: number;          // AI生成の場合の確信度（0-1）
  personalizedFor?: string;     // childId（パーソナライズの場合）
}

type SuggestionSource = 
  | 'static'                    // 固定テンプレート
  | 'rule-based'                // ルールベース動的生成
  | 'ai-generated'              // AI生成（Phase 3.1以降）
  | 'personalized';             // パーソナライズ（Phase 3.2以降）

SuggestionRule
typescriptinterface SuggestionRule {
  id: string;
  name: string;                 // ルールの説明
  subject: Subject;
  ageGroup?: AgeGroup;          // 指定なしは全年齢
  
  // トリガー条件
  trigger: TriggerCondition;
  
  // 提案する質問
  suggestions: string[];
  priority: number;
}

interface TriggerCondition {
  keywords: string[];           // キーワードリスト
  requiredCount: number;        // 最低一致数
  contextWindow: number;        // 直近何メッセージを見るか
  excludeKeywords?: string[];   // 除外キーワード
}

ConversationAnalysis
typescriptinterface ConversationAnalysis {
  extractedKeywords: string[];
  detectedTopics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  messageCount: number;
  lastUpdated: Timestamp;
}

🚨 安全性関連型
SafetyLog
typescriptinterface SafetyLog {
  id: string;
  childId: string;
  parentId: string;
  severity: SafetySeverity;
  detectedAt: Timestamp;
  
  // 検知内容
  keyword: string;
  message: string;              // 問題のあったメッセージ
  context: string;              // 前後のメッセージ
  
  // 通知状況
  parentNotified: boolean;
  notifiedAt?: Timestamp;
  notificationMethod?: 'email' | 'sms' | 'in-app';
  
  // 対応状況
  resolved: boolean;
  resolvedAt?: Timestamp;
  resolvedBy?: string;          // 対応した管理者ID
  notes?: string;               // 対応メモ
}

EmergencyKeyword
typescriptinterface EmergencyKeyword {
  keyword: string;
  severity: SafetySeverity;
  category: KeywordCategory;
  action: EmergencyAction;
}

type KeywordCategory = 
  | 'self-harm'                 // 自傷
  | 'bullying'                  // いじめ
  | 'abuse'                     // 虐待
  | 'depression'                // 抑うつ
  | 'other';

type EmergencyAction = 
  | 'immediate-notify'          // 即時通知
  | 'notify-within-24h'         // 24時間以内通知
  | 'weekly-report'             // 週次レポート
  | 'log-only';                 // ログのみ

📈 分析関連型（Phase 3以降）
LearningHistory
typescriptinterface LearningHistory {
  childId: string;
  
  // 教科別統計
  subjectStats: Record<Subject, SubjectStat>;
  
  // 全体統計
  totalSessions: number;
  totalMessages: number;
  totalLearningTime: number;    // 分
  
  // 学習パターン
  preferredSubjects: Subject[];
  weakSubjects: Subject[];
  learningPeakHours: number[];  // 0-23
  
  updatedAt: Timestamp;
}

interface SubjectStat {
  sessionCount: number;
  messageCount: number;
  averageSessionLength: number; // 分
  lastStudied: Timestamp;
  comprehensionLevel?: number;  // 0-100（Phase 3.2以降）
}

🔧 API型定義
Request/Response型
typescript// チャットAPI
interface ChatRequest {
  message: string;
  childId: string;
  subject: Subject;
  conversationHistory?: Message[];
}

interface ChatResponse {
  message: string;
  tokens: number;
  model: AIModel;
  suggestions?: MessageSuggestion[];  // Phase 2.5以降
}

// ストリーミングレスポンス
interface StreamChunk {
  delta: string;
  done: boolean;
  tokens?: number;
}

認証API（Phase 2.1以降）
typescriptinterface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  expiresAt: number;
}

interface SignupRequest {
  email: string;
  password: string;
  displayName?: string;
}

interface SignupResponse {
  user: User;
  token: string;
}

PIN認証API
typescriptinterface PinVerifyRequest {
  childId: string;
  pin: string;
}

interface PinVerifyResponse {
  success: boolean;
  child?: Child;
  sessionToken?: string;
}

🎨 フロントエンド型定義
State管理（Zustand）
typescript// 認証Store
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

// チャットStore
interface ChatState {
  currentChild: Child | null;
  currentSubject: Subject | null;
  messages: Message[];
  loading: boolean;
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  loadHistory: (chatId: string) => Promise<void>;
  clearMessages: () => void;
}

// プロファイルStore
interface ProfileState {
  children: Child[];
  loading: boolean;
  
  // Actions
  addChild: (data: Omit<Child, 'id' | 'createdAt'>) => Promise<void>;
  updateChild: (id: string, data: Partial<Child>) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
  verifyPin: (childId: string, pin: string) => Promise<boolean>;
}

Form型
typescript// ログインフォーム
interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// サインアップフォーム
interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  displayName?: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

// 子どもプロファイルフォーム
interface ChildFormData {
  nickname: string;
  birthMonth: string;
  avatar: AvatarType;
  pin: string;
  pinConfirm: string;
}

🕐 時刻関連型
Timestamp
Firestoreのタイムスタンプ型を使用：
typescriptimport { Timestamp } from 'firebase/firestore';

// 使用例
interface Example {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 変換ヘルパー
const toDate = (timestamp: Timestamp): Date => timestamp.toDate();
const fromDate = (date: Date): Timestamp => Timestamp.fromDate(date);
const now = (): Timestamp => Timestamp.now();

🎯 バリデーション型（Zod）
typescriptimport { z } from 'zod';

// メールアドレス
export const emailSchema = z.string().email('有効なメールアドレスを入力してください');

// パスワード
export const passwordSchema = z.string()
  .min(8, 'パスワードは8文字以上で入力してください')
  .regex(/[A-Z]/, '大文字を1文字以上含めてください')
  .regex(/[a-z]/, '小文字を1文字以上含めてください')
  .regex(/[0-9]/, '数字を1文字以上含めてください');

// PIN（4桁数字）
export const pinSchema = z.string()
  .regex(/^\d{4}$/, 'PINは4桁の数字で入力してください');

// ニックネーム
export const nicknameSchema = z.string()
  .min(1, 'ニックネームを入力してください')
  .max(20, 'ニックネームは20文字以内で入力してください');

🔄 型の使用例
コンポーネントでの使用
typescript// LoginPage.tsx
import { LoginFormData } from '@/types';

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // ...
};
API Routeでの使用
typescript// app/api/chat/route.ts
import { ChatRequest, ChatResponse } from '@/types';

export async function POST(request: Request) {
  const body: ChatRequest = await request.json();
  
  // ...
  
  const response: ChatResponse = {
    message: aiResponse,
    tokens: tokenCount,
    model: 'gpt-4o-mini'
  };
  
  return Response.json(response);
}

📦 エクスポート構成
src/types/index.ts
typescript// User関連
export type { User, Plan, UserConsents, UserSettings, PaymentInfo } from './user';

// Child関連
export type { Child, AgeGroup, AvatarType } from './child';

// Chat関連
export type { Message, Chat, ChatMetadata, Subject, AIModel } from './chat';

// Usage関連
export type { Usage, PeriodUsage, UsageSummary, TokenLimit } from './usage';

// Payment関連
export type { Subscription, SubscriptionStatus, Invoice, InvoiceStatus } from './payment';

// Suggestion関連
export type { 
  MessageSuggestion, 
  SuggestionRule, 
  SuggestionSource,
  TriggerCondition,
  ConversationAnalysis 
} from './suggestion';

// Safety関連
export type { SafetyLog, SafetySeverity, EmergencyKeyword } from './safety';

// API関連
export type { 
  ChatRequest, 
  ChatResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse 
} from './api';

// State関連
export type { AuthState, ChatState, ProfileState } from './state';

// Form関連
export type { LoginFormData, SignupFormData, ChildFormData } from './forms';

// Constants
export { TOKEN_LIMITS } from './constants';

🔄 更新履歴
Version 2.0.0（2025-10-07）

MessageSuggestion型の追加（Phase 2.5対応）
SuggestionRule型の追加
ConversationAnalysis型の追加
AuthState, ChatState, ProfileState型の追加

Version 1.0.0（2025-09-24）

初版作成
基本型定義


📞 次のステップ

DIRECTORY_STRUCTURE.md でファイル配置を確認
MESSAGE_TEMPLATES.md でメッセージ候補の詳細を確認
phases/PHASE2-1_AUTH.md で実装開始


最終更新: 2025-10-07
管理者: AsamiWorks
