# 📊 Phase 2.4: 使用量管理実装仕様

最終更新: 2025-10-07  
Version: 1.0.0  
実装期間: Week 6（2025-11-11 〜 2025-11-17）

---

## 📚 前提ドキュメント

**必読（Claude CODEはこれらを先に読むこと）**:
1. [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - UIコンポーネント
2. [TYPE_REFERENCE.md](../TYPE_REFERENCE.md) - Usage, TokenLimit型
3. [DIRECTORY_STRUCTURE.md](../DIRECTORY_STRUCTURE.md) - ファイル配置
4. [完全仕様書](../../i-manabee完全仕様書.md) - トークン制限の詳細

**参考資料**:
- [料金プラン](../MASTER_PLAN.md) - プラン別の制限

---

## 🎯 このフェーズの目的

トークン使用量を追跡し、プラン別の制限を適用する。ユーザーが使用状況を確認できるUIを提供する。

### 達成目標
- [ ] トークン使用量をリアルタイムで追跡できる
- [ ] プラン別の制限が正しく機能する
- [ ] 1日2期制（6時・18時リセット）が動作する
- [ ] 使用量ダッシュボードで状況が見える
- [ ] 使用履歴グラフが表示される
- [ ] 制限超過時に適切なメッセージが表示される

---

## ✅ 実装チェックリスト

### Day 36-37: トークンカウントシステム

#### Day 36: トークンカウンター実装
- [ ] `lib/usage/tokenCounter.ts` 作成
- [ ] tiktoken統合（GPT用）
- [ ] Gemini/Claude用の概算カウンター
- [ ] UniversalTokenCounter実装

#### Day 37: Firestore使用量記録
- [ ] `lib/usage/tracker.ts` 作成
- [ ] 使用量記録関数
- [ ] 期別集計
- [ ] 日次集計

### Day 38-39: 制限チェック機能

#### Day 38: Limiter実装
- [ ] `lib/usage/limiter.ts` 作成
- [ ] プラン別制限取得
- [ ] 残量チェック関数
- [ ] 制限超過判定

#### Day 39: API統合
- [ ] `app/api/usage/route.ts` 作成
- [ ] 現在の使用量取得API
- [ ] 制限チェックAPI
- [ ] チャットAPIに制限チェック追加

### Day 40-41: 使用量UI

#### Day 40: ダッシュボードコンポーネント
- [ ] `app/(dashboard)/usage/page.tsx` 作成
- [ ] `components/dashboard/UsageChart.tsx` 作成
- [ ] `components/dashboard/UsageSummary.tsx` 作成
- [ ] 残量表示コンポーネント

#### Day 41: 使用履歴グラフ
- [ ] Recharts統合
- [ ] 日別使用量グラフ
- [ ] 教科別使用量グラフ
- [ ] 期別使用量表示

### Day 42: テスト・最適化

- [ ] 全機能の動作確認
- [ ] エッジケーステスト
- [ ] パフォーマンス最適化
- [ ] PROGRESS.md更新

---

## 🏗️ アーキテクチャ

### トークン追跡フロー
ユーザーがメッセージ送信
↓
チャットAPI呼び出し
↓

現在の使用量を取得
↓
制限チェック
├─ 制限内 → AIリクエスト続行
└─ 制限超過 → エラーレスポンス
↓
AIレスポンス取得
↓
トークン数カウント
↓
Firestoreに使用量記録
├─ usageコレクション更新（期別）
└─ 日次集計更新
↓
レスポンス返却


### 期のリセット仕組み
Cloud Functions (Scheduled)
↓
毎日 6:00 と 18:00 に実行
↓
全ユーザーの期別使用量をリセット
├─ morning期（6:00）: evening期の値を morning期に移動、evening期をリセット
└─ evening期（18:00）: morning期の値を evening期に移動、morning期をリセット

### ディレクトリ構成（新規作成分）
src/
├── app/
│   ├── (dashboard)/
│   │   └── usage/
│   │       └── page.tsx              ✨ 新規
│   │
│   └── api/
│       └── usage/
│           ├── route.ts              ✨ 新規（使用量取得）
│           └── history/
│               └── route.ts          ✨ 新規（履歴取得）
│
├── components/
│   └── dashboard/
│       ├── UsageChart.tsx            ✨ 新規
│       ├── UsageSummary.tsx          ✨ 新規
│       └── UsageProgress.tsx         ✨ 新規
│
├── lib/
│   └── usage/
│       ├── tokenCounter.ts           ✨ 新規
│       ├── tracker.ts                ✨ 新規
│       └── limiter.ts                ✨ 新規
│
└── stores/
└── usageStore.ts                 ✨ 新規

---

## 📱 画面仕様

### 1. 使用状況ダッシュボード (`/usage`)

#### UI要件
┌─────────────────────────────────────────────────────┐
│  使用状況                                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  今期の使用状況（朝の期: 6:00-18:00）               │
│  ┌─────────────────────────────────────────────┐   │
│  │ ■■■■■■■■■■░░░░░░░░░░  2,500 / 4,000   │   │
│  │                                             │   │
│  │ 残り: 1,500トークン                         │   │
│  │ リセットまで: 3時間12分                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  教科別使用状況                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 算数  ■■■■■░  800 トークン               │   │
│  │ 国語  ■■■░░░  500 トークン               │   │
│  │ 英語  ■■■■░░  700 トークン               │   │
│  │ 理科  ■■■░░░  500 トークン               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  使用履歴（過去7日間）                              │
│  ┌─────────────────────────────────────────────┐   │
│  │        ┃                                    │   │
│  │    ┃   ┃       ┃                            │   │
│  │ ┃  ┃   ┃   ┃   ┃       ┃                    │   │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━             │   │
│  │ 月  火  水  木  金  土  日                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘

#### コード例

**`app/(dashboard)/usage/page.tsx`**
```tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UsageSummary } from '@/components/dashboard/UsageSummary';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { UsageProgress } from '@/components/dashboard/UsageProgress';
import type { Usage } from '@/types';

export default function UsagePage() {
  const { user } = useAuth();
  const [currentUsage, setCurrentUsage] = useState<Usage | null>(null);
  const [history, setHistory] = useState<Usage[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchUsage = async () => {
      try {
        // 現在の使用量を取得
        const response = await fetch('/api/usage');
        const data = await response.json();
        setCurrentUsage(data.current);
        
        // 履歴を取得
        const historyResponse = await fetch('/api/usage/history');
        const historyData = await historyResponse.json();
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to fetch usage:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsage();
    
    // 1分ごとに更新
    const interval = setInterval(fetchUsage, 60000);
    return () => clearInterval(interval);
  }, [user]);
  
  if (!user) return null;
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        使用状況
      </h1>
      
      {/* Current Usage Summary */}
      {currentUsage && (
        <>
          <UsageSummary usage={currentUsage} plan={user.plan} />
          
          {/* Subject Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              教科別使用状況
            </h2>
            <div className="space-y-3">
              {Object.entries(currentUsage.dailyTotal.subjectBreakdown).map(
                ([subject, tokens]) => (
                  <UsageProgress
                    key={subject}
                    label={getSubjectLabel(subject)}
                    current={tokens}
                    max={getCurrentPeriodLimit(currentUsage, user.plan)}
                    color={getSubjectColor(subject)}
                  />
                )
              )}
            </div>
          </div>
        </>
      )}
      
      {/* Usage History Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          使用履歴（過去7日間）
        </h2>
        <UsageChart data={history} />
      </div>
      
      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">
          💡 トークンを節約するコツ
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 質問を具体的に、簡潔にすると効率的です</li>
          <li>• 長い会話は新しいチャットで始めるとトークンを節約できます</li>
          <li>• プレミアムプランなら無制限で使えます</li>
        </ul>
      </div>
    </div>
  );
}

// ヘルパー関数
function getSubjectLabel(subject: string): string {
  const labels: Record<string, string> = {
    math: '算数・数学',
    japanese: '国語',
    english: '英語',
    science: '理科',
    social: '社会',
    programming: 'プログラミング',
    counseling: '悩み相談',
  };
  return labels[subject] || subject;
}

function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    math: '#2196F3',
    japanese: '#FF6B6B',
    english: '#4CAF50',
    science: '#9C27B0',
    social: '#FF9800',
    programming: '#00BCD4',
    counseling: '#FFB300',
  };
  return colors[subject] || '#9E9E9E';
}

function getCurrentPeriodLimit(usage: Usage, plan: string): number {
  const now = new Date();
  const hour = now.getHours();
  const isMorning = hour >= 6 && hour < 18;
  
  const limits: Record<string, { morning: number; evening: number }> = {
    free: { morning: 1000, evening: 1000 },
    kids: { morning: 4000, evening: 4000 },
    friends: { morning: 8000, evening: 8000 },
    premium: { morning: Infinity, evening: Infinity },
  };
  
  const limit = limits[plan] || limits.free;
  return isMorning ? limit.morning : limit.evening;
}
components/dashboard/UsageSummary.tsx
tsximport type { Usage } from '@/types';

interface UsageSummaryProps {
  usage: Usage;
  plan: string;
}

export function UsageSummary({ usage, plan }: UsageSummaryProps) {
  const now = new Date();
  const hour = now.getHours();
  const isMorning = hour >= 6 && hour < 18;
  
  const currentPeriod = isMorning ? usage.periods.morning : usage.periods.evening;
  const limit = getPeriodLimit(plan, isMorning);
  const percentage = limit === Infinity ? 0 : (currentPeriod.tokens / limit) * 100;
  const remaining = limit === Infinity ? Infinity : limit - currentPeriod.tokens;
  
  // リセットまでの時間計算
  const nextReset = new Date();
  if (isMorning) {
    nextReset.setHours(18, 0, 0, 0);
  } else {
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(6, 0, 0, 0);
  }
  const msUntilReset = nextReset.getTime() - now.getTime();
  const hoursUntilReset = Math.floor(msUntilReset / (1000 * 60 * 60));
  const minutesUntilReset = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60));
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          今期の使用状況（{isMorning ? '朝の期' : '夜の期'}: {isMorning ? '6:00-18:00' : '18:00-6:00'}）
        </h2>
        <span className="text-sm text-gray-600">
          リセットまで: {hoursUntilReset}時間{minutesUntilReset}分
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-honey-yellow to-honey-yellow-dark transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex items-center justify-between text-lg">
        <span className="font-medium text-gray-700">
          使用量: {currentPeriod.tokens.toLocaleString()} トークン
        </span>
        {limit === Infinity ? (
          <span className="font-bold text-green-600">
            無制限プラン ✨
          </span>
        ) : (
          <span className="font-medium text-gray-700">
            制限: {limit.toLocaleString()} トークン
          </span>
        )}
      </div>
      
      {remaining !== Infinity && (
        <p className="mt-2 text-gray-600">
          残り: {remaining.toLocaleString()} トークン
        </p>
      )}
      
      {/* Warning */}
      {percentage > 80 && percentage < 100 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ 残りわずかです。プランのアップグレードをご検討ください。
          </p>
        </div>
      )}
      
      {percentage >= 100 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            ❌ 今期の制限に達しました。次のリセットまでお待ちいただくか、プランをアップグレードしてください。
          </p>
        </div>
      )}
    </div>
  );
}

function getPeriodLimit(plan: string, isMorning: boolean): number {
  const limits: Record<string, number> = {
    free: 1000,
    kids: 4000,
    friends: 8000,
    premium: Infinity,
  };
  return limits[plan] || limits.free;
}
components/dashboard/UsageProgress.tsx
tsxinterface UsageProgressProps {
  label: string;
  current: number;
  max: number;
  color?: string;
}

export function UsageProgress({ 
  label, 
  current, 
  max, 
  color = '#FFB300' 
}: UsageProgressProps) {
  const percentage = max === Infinity ? 0 : (current / max) * 100;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">
          {current.toLocaleString()} トークン
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
components/dashboard/UsageChart.tsx
tsx'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Usage } from '@/types';

interface UsageChartProps {
  data: Usage[];
}

export function UsageChart({ data }: UsageChartProps) {
  // データを整形
  const chartData = data.map((usage) => ({
    date: new Date(usage.date).toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
    }),
    tokens: usage.dailyTotal.totalTokens,
    messages: usage.dailyTotal.totalMessages,
  }));
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="tokens"
          stroke="#FFB300"
          strokeWidth={2}
          name="トークン数"
        />
        <Line
          type="monotone"
          dataKey="messages"
          stroke="#2196F3"
          strokeWidth={2}
          name="メッセージ数"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

🔧 トークンカウンター実装
lib/usage/tokenCounter.ts
typescriptimport { encoding_for_model } from 'tiktoken';
import type { AIModel } from '@/types';

export class UniversalTokenCounter {
  private gptEncoder = encoding_for_model('gpt-3.5-turbo');
  
  /**
   * テキストのトークン数をカウント
   */
  count(text: string, model: AIModel): number {
    switch (model) {
      case 'gpt-4o-mini':
        return this.countGPT(text);
        
      case 'gemini-2.5-flash-lite':
        return this.countGemini(text);
        
      case 'claude-sonnet-4.5':
        return this.countClaude(text);
        
      default:
        return this.countApproximate(text);
    }
  }
  
  /**
   * GPT系モデルのトークン数（正確）
   */
  private countGPT(text: string): number {
    return this.gptEncoder.encode(text).length;
  }
  
  /**
   * Geminiのトークン数（概算）
   * Geminiは文字数/4が目安
   */
  private countGemini(text: string): number {
    return Math.ceil(text.length / 4);
  }
  
  /**
   * Claudeのトークン数（概算）
   * Claudeは約1.3倍のトークン数
   */
  private countClaude(text: string): number {
    const baseTokens = Math.ceil(text.length / 3);
    return Math.ceil(baseTokens * 1.3);
  }
  
  /**
   * 概算（安全マージン込み）
   */
  private countApproximate(text: string): number {
    return Math.ceil(text.length / 2.5);
  }
  
  /**
   * API費用計算（円）
   */
  calculateCost(tokens: number, model: AIModel): number {
    const pricing: Record<AIModel, number> = {
      'gpt-4o-mini': 0.002,            // $0.002/1K tokens
      'gemini-2.5-flash-lite': 0.00035, // $0.00035/1K tokens
      'claude-sonnet-4.5': 0.00025,    // $0.00025/1K tokens
    };
    
    const pricePerK = pricing[model] || 0.002;
    const usdCost = (tokens / 1000) * pricePerK;
    const jpyCost = usdCost * 150; // 為替レート
    
    return jpyCost;
  }
}

// シングルトンインスタンス
export const tokenCounter = new UniversalTokenCounter();

lib/usage/tracker.ts
typescriptimport { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Usage, Subject, AIModel } from '@/types';

/**
 * 使用量を記録
 */
export async function trackUsage(params: {
  userId: string;
  tokens: number;
  messageCount: number;
  subject: Subject;
  model: AIModel;
}): Promise<void> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const hour = new Date().getHours();
  const isMorning = hour >= 6 && hour < 18;
  const period = isMorning ? 'morning' : 'evening';
  
  const usageRef = doc(db, 'usage', `${params.userId}_${today}`);
  
  try {
    const usageDoc = await getDoc(usageRef);
    
    if (usageDoc.exists()) {
      // 既存ドキュメントを更新
      const data = usageDoc.data() as Usage;
      
      await updateDoc(usageRef, {
        [`periods.${period}.messages`]: data.periods[period].messages + params.messageCount,
        [`periods.${period}.tokens`]: data.periods[period].tokens + params.tokens,
        'dailyTotal.totalMessages': data.dailyTotal.totalMessages + params.messageCount,
        'dailyTotal.totalTokens': data.dailyTotal.totalTokens + params.tokens,
        'dailyTotal.apiCost': data.dailyTotal.apiCost + calculateCost(params.tokens, params.model),
        [`dailyTotal.subjectBreakdown.${params.subject}`]:
          (data.dailyTotal.subjectBreakdown[params.subject] || 0) + params.tokens,
      });
    } else {
      // 新規ドキュメントを作成
      const newUsage: Usage = {
        userId: params.userId,
        date: today,
        periods: {
          morning: {
            messages: period === 'morning' ? params.messageCount : 0,
            tokens: period === 'morning' ? params.tokens : 0,
            resetAt: getNextResetTime('morning'),
            remaining: 0, // 後で計算
          },
          evening: {
            messages: period === 'evening' ? params.messageCount : 0,
            tokens: period === 'evening' ? params.tokens : 0,
            resetAt: getNextResetTime('evening'),
            remaining: 0,
          },
        },
        dailyTotal: {
          totalMessages: params.messageCount,
          totalTokens: params.tokens,
          apiCost: calculateCost(params.tokens, params.model),
          subjectBreakdown: {
            [params.subject]: params.tokens,
          },
        },
      };
      
      await setDoc(usageRef, newUsage);
    }
  } catch (error) {
    console.error('Failed to track usage:', error);
    throw error;
  }
}

/**
 * 現在の使用量を取得
 */
export async function getCurrentUsage(userId: string): Promise<Usage | null> {
  const today = new Date().toISOString().split('T')[0];
  const usageRef = doc(db, 'usage', `${params.userId}_${today}`);
  
  const usageDoc = await getDoc(usageRef);
  
  if (!usageDoc.exists()) {
    return null;
  }
  
  return usageDoc.data() as Usage;
}

/**
 * 使用履歴を取得（過去N日間）
 */
export async function getUsageHistory(
  userId: string,
  days: number = 7
): Promise<Usage[]> {
  const history: Usage[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const usageRef = doc(db, 'usage', `${userId}_${dateStr}`);
    const usageDoc = await getDoc(usageRef);
    
    if (usageDoc.exists()) {
      history.push(usageDoc.data() as Usage);
    }
  }
  
  return history.reverse(); // 古い順に
}

// ヘルパー関数
function getNextResetTime(period: 'morning' | 'evening'): Date {
  const now = new Date();
  const reset = new Date();
  
  if (period === 'morning') {
    reset.setHours(6, 0, 0, 0);
    if (now.getHours() >= 6) {
      reset.setDate(reset.getDate() + 1);
    }
  } else {
    reset.setHours(18, 0, 0, 0);
    if (now.getHours() >= 18) {
      reset.setDate(reset.getDate() + 1);
    }
  }
  
  return reset;
}

function calculateCost(tokens: number, model: AIModel): number {
  const pricing: Record<AIModel, number> = {
    'gpt-4o-mini': 0.002,
    'gemini-2.5-flash-lite': 0.00035,
    'claude-sonnet-4.5': 0.00025,
  };
  
  const pricePerK = pricing[model] || 0.002;
  return (tokens / 1000) * pricePerK * 150; // 円換算
}

lib/usage/limiter.ts
typescriptimport { getCurrentUsage } from './tracker';
import type { Plan } from '@/types';

export interface TokenLimit {
  plan: Plan;
  messagesPerPeriod: number | 'unlimited';
  tokensPerPeriod: number | 'unlimited';
}

export const TOKEN_LIMITS: Record<Plan, TokenLimit> = {
  free: {
    plan: 'free',
    messagesPerPeriod: 5,
    tokensPerPeriod: 1000,
  },
  kids: {
    plan: 'kids',
    messagesPerPeriod: 'unlimited',
    tokensPerPeriod: 4000,
  },
  friends: {
    plan: 'friends',
    messagesPerPeriod: 'unlimited',
    tokensPerPeriod: 8000,
  },
  premium: {
    plan: 'premium',
    messagesPerPeriod: 'unlimited',
    tokensPerPeriod: 'unlimited',
  },
};

/**
 * 制限チェック
 */
export async function checkLimit(
  userId: string,
  plan: Plan
): Promise<{ allowed: boolean; reason?: string; remaining?: number }> {
  const usage = await getCurrentUsage(userId);
  const limit = TOKEN_LIMITS[plan];
  
  const hour = new Date().getHours();
  const isMorning = hour >= 6 && hour < 18;
  
  // 使用量がない場合は許可
  if (!usage) {
    return { allowed: true };
  }
  
  const currentPeriod = isMorning ? usage.periods.morning : usage.periods.evening;
  
  // メッセージ数チェック
  if (
    limit.messagesPerPeriod !== 'unlimited' &&
    currentPeriod.messages >= limit.messagesPerPeriod
  ) {
    return {
      allowed: false,
      reason: `今期のメッセージ数上限（${limit.messagesPerPeriod}回）に達しました`,
      remaining: 0,
    };
  }
  
  // トークン数チェック
  if (
    limit.tokensPerPeriod !== 'unlimited' &&
    currentPeriod.tokens >= limit.tokensPerPeriod
  ) {
    return {
      allowed: false,
      reason: `今期のトークン数上限（${limit.tokensPerPeriod}トークン）に達しました`,
      remaining: 0,
    };
  }
  
  // 残量計算
  const remaining =
    limit.tokensPerPeriod === 'unlimited'
      ? Infinity
      : limit.tokensPerPeriod - currentPeriod.tokens;
  
  return { allowed: true, remaining };
}

🔗 API統合
チャットAPIに制限チェックを追加
app/api/chat/route.ts（更新）
typescriptimport { checkLimit } from '@/lib/usage/limiter';
import { trackUsage } from '@/lib/usage/tracker';
import { tokenCounter } from '@/lib/usage/tokenCounter';

export async function POST(request: Request) {
  const { message, childId, subject } = await request.json();
  
  // ユーザー情報取得
  const user = await getUser();
  
  // 制限チェック ⭐ 追加
  const limitCheck = await checkLimit(user.id, user.plan);
  
  if (!limitCheck.allowed) {
    return Response.json(
      { error: limitCheck.reason },
      { status: 429 }
    );
  }
  
  // AIリクエスト
  const aiResponse = await getAIResponse(message, subject);
  
  // トークン数カウント ⭐ 追加
  const model = getModelForSubject(subject);
  const userTokens = tokenCounter.count(message, model);
  const assistantTokens = tokenCounter.count(aiResponse, model);
  const totalTokens = userTokens + assistantTokens;
  
  // 使用量記録 ⭐ 追加
  await trackUsage({
    userId: user.id,
    tokens: totalTokens,
    messageCount: 1,
    subject,
    model,
  });
  
  return Response.json({
    message: aiResponse,
    tokens: totalTokens,
    remaining: limitCheck.remaining,
  });
}

🧪 テスト
手動テストチェックリスト
トークンカウント

 GPTのトークン数が正確
 Gemini/Claudeの概算が妥当
 費用計算が正確

使用量記録

 メッセージ送信後、Firestoreに記録される
 期別に正しく集計される
 教科別に正しく集計される

制限チェック

 無料プラン: 5回/1000トークンで制限
 キッズプラン: 4000トークンで制限
 フレンズプラン: 8000トークンで制限
 プレミアムプラン: 制限なし

UI表示

 使用量が正しく表示される
 グラフが表示される
 残量が正しく表示される
 制限超過時に警告が表示される


📝 Claude CODEへの指示
実装手順
Day 36: トークンカウンター

lib/usage/tokenCounter.ts 作成
tiktoken統合
テスト

Day 37: 使用量記録

lib/usage/tracker.ts 作成
Firestore統合

Day 38: 制限チェック

lib/usage/limiter.ts 作成
プラン別制限定義

Day 39: API統合

チャットAPIに統合
制限超過時のエラー処理

Day 40-41: UI実装

/usage ページ作成
グラフコンポーネント

Day 42: テスト

全機能確認
バグ修正


🎯 完了基準

 トークンカウントが正確
 使用量がFirestoreに記録される
 プラン別制限が機能する
 使用量ダッシュボードが表示される
 すべてのテストが成功
 PROGRESS.md更新


最終更新: 2025-10-07
次のフェーズ: PHASE2-5_CHAT.md