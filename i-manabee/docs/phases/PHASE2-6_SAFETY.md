# 🛡️ Phase 2.6: 安全性強化実装仕様

最終更新: 2025-10-07  
Version: 1.0.0  
実装期間: Week 9-10（2025-12-02 〜 2025-12-15）

---

## 📚 前提ドキュメント

**必読（Claude CODEはこれらを先に読むこと）**:
1. [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - UIコンポーネント
2. [TYPE_REFERENCE.md](../TYPE_REFERENCE.md) - SafetyAlert, WeeklyReport型
3. [DIRECTORY_STRUCTURE.md](../DIRECTORY_STRUCTURE.md) - ファイル配置
4. [完全仕様書](../../i-manabee完全仕様書.md) - 安全性監視の詳細

---

## 🎯 このフェーズの目的

Phase 1で実装した基本的な安全性監視を強化し、保護者への通知機能と週次レポート機能を追加する。

### 達成目標
- [ ] 緊急キーワード検知が強化される（3段階）
- [ ] 保護者にリアルタイムでメール通知が届く
- [ ] 週次レポートが自動生成される
- [ ] ダッシュボードでアラート履歴が見られる
- [ ] 保護者が安全設定をカスタマイズできる

---

## ✅ 実装チェックリスト

### Week 9: 緊急検知と通知（Day 57-63）

#### Day 57-58: キーワード検知強化
- [ ] `lib/safety/detector.ts` 強化
- [ ] 3段階のレベル分け（Info/Warning/Critical）
- [ ] コンテキスト分析の改善
- [ ] 誤検知削減ロジック

#### Day 59-60: 通知システム
- [ ] `lib/notifications/email.ts` 作成
- [ ] SendGrid統合
- [ ] メールテンプレート作成
- [ ] `app/api/notifications/route.ts` 作成

#### Day 61-62: アラート管理
- [ ] `app/(dashboard)/alerts/page.tsx` 作成
- [ ] `components/safety/AlertList.tsx` 作成
- [ ] `components/safety/AlertCard.tsx` 作成
- [ ] アラート履歴表示

#### Day 63: テスト・調整
- [ ] 検知精度テスト
- [ ] 通知テスト
- [ ] UI確認

### Week 10: 週次レポート（Day 64-70）

#### Day 64-65: レポート生成
- [ ] `lib/reports/generator.ts` 作成
- [ ] Cloud Functions (週次バッチ)
- [ ] レポートデータ集計
- [ ] PDF生成（オプション）

#### Day 66-67: レポートUI
- [ ] `app/(dashboard)/reports/page.tsx` 作成
- [ ] `components/reports/WeeklyReport.tsx` 作成
- [ ] グラフ・チャート統合
- [ ] ダウンロード機能

#### Day 68-69: 設定画面
- [ ] `app/(dashboard)/settings/page.tsx` 強化
- [ ] 通知設定
- [ ] レポート配信設定
- [ ] キーワードカスタマイズ

#### Day 70: 統合テスト・最終調整
- [ ] 全機能の動作確認
- [ ] エンドツーエンドテスト
- [ ] Phase 2完了確認
- [ ] PROGRESS.md最終更新

---

## 🏗️ アーキテクチャ

### 安全性監視フロー
メッセージ送信
↓
SafetyDetector.analyze()
├─ キーワードマッチング（3段階）
│   ├─ Info: 記録のみ
│   ├─ Warning: 通知＋記録
│   └─ Critical: 即時通知＋記録
│
├─ コンテキスト分析
│   ├─ 前後のメッセージを確認
│   └─ 誤検知判定
│
└─ スコアリング
↓
レベル判定
├─ Info → Firestore記録のみ
├─ Warning → Firestore記録 ＋ 保護者通知（1時間に1回まで）
└─ Critical → Firestore記録 ＋ 即時通知
↓
保護者ダッシュボードに表示

### 週次レポート生成フロー
Cloud Functions (毎週日曜 22:00)
↓
全ユーザーをループ
↓
過去1週間のデータ集計
├─ 使用状況（教科別、時間別）
├─ 成長指標（学習パターン）
├─ 安全性アラート
└─ おすすめ学習内容
↓
レポート生成
├─ Firestoreに保存
└─ メール送信（設定に応じて）
↓
保護者が確認

### ディレクトリ構成（新規作成分）
src/
├── app/
│   ├── (dashboard)/
│   │   ├── alerts/
│   │   │   └── page.tsx              ✨ 新規
│   │   ├── reports/
│   │   │   ├── page.tsx              ✨ 新規
│   │   │   └── [id]/
│   │   │       └── page.tsx          ✨ 新規
│   │   └── settings/
│   │       └── page.tsx              # 強化
│   │
│   └── api/
│       └── notifications/
│           └── route.ts              ✨ 新規
│
├── components/
│   ├── safety/
│   │   ├── AlertList.tsx             ✨ 新規
│   │   ├── AlertCard.tsx             ✨ 新規
│   │   └── SafetySettings.tsx        ✨ 新規
│   │
│   └── reports/
│       ├── WeeklyReport.tsx          ✨ 新規
│       ├── ReportChart.tsx           ✨ 新規
│       └── ReportSummary.tsx         ✨ 新規
│
├── lib/
│   ├── safety/
│   │   └── detector.ts               # 強化
│   │
│   ├── notifications/
│   │   └── email.ts                  ✨ 新規
│   │
│   └── reports/
│       └── generator.ts              ✨ 新規
│
└── functions/
└── src/
└── weeklyReports.ts          ✨ 新規（Cloud Functions）

---

## 📱 画面仕様

### 1. アラート履歴 (`/alerts`)

#### UI要件
┌─────────────────────────────────────┐
│  安全性アラート                      │
├─────────────────────────────────────┤
│                                     │
│  [すべて▼] [子ども▼] [レベル▼]     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🚨 Critical                  │   │
│  │ たろう - 悩み相談             │   │
│  │                              │   │
│  │ 「死にたい」というキーワード  │   │
│  │ を検出しました               │   │
│  │                              │   │
│  │ 2025-12-10 14:32             │   │
│  │ [詳細を見る]                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ⚠️ Warning                   │   │
│  │ はなこ - 悩み相談             │   │
│  │                              │   │
│  │ 「いじめ」に関連する会話      │   │
│  │                              │   │
│  │ 2025-12-09 16:15             │   │
│  │ [詳細を見る]                 │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘

#### コード例

**`app/(dashboard)/alerts/page.tsx`**
```tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/useChildren';
import { AlertList } from '@/components/safety/AlertList';
import { getSafetyAlerts } from '@/lib/safety/detector';
import type { SafetyAlert, AlertLevel } from '@/types';

export default function AlertsPage() {
  const { user } = useAuth();
  const { children } = useChildren();
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    childId?: string;
    level?: AlertLevel;
  }>({});
  
  useEffect(() => {
    if (!user) return;
    
    const fetchAlerts = async () => {
      try {
        const data = await getSafetyAlerts(user.id, filter);
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
  }, [user, filter]);
  
  if (!user) return null;
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          安全性アラート
        </h1>
        <p className="text-gray-600">
          お子様の安全を守るため、気になる会話を自動検知しています
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex gap-4">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg"
          onChange={(e) => setFilter({ ...filter, childId: e.target.value })}
        >
          <option value="">すべての子ども</option>
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.nickname}
            </option>
          ))}
        </select>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg"
          onChange={(e) => setFilter({ 
            ...filter, 
            level: e.target.value as AlertLevel 
          })}
        >
          <option value="">すべてのレベル</option>
          <option value="critical">🚨 Critical（緊急）</option>
          <option value="warning">⚠️ Warning（警告）</option>
          <option value="info">ℹ️ Info（情報）</option>
        </select>
      </div>
      
      {/* Alerts */}
      {loading ? (
        <p className="text-gray-600">読み込み中...</p>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            アラートはありません
          </h2>
          <p className="text-gray-600">
            お子様の会話に問題は検出されていません
          </p>
        </div>
      ) : (
        <AlertList alerts={alerts} />
      )}
      
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">
          💡 安全性監視について
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 子どもの安全を守るため、AIが会話を自動でチェックします</li>
          <li>• 緊急性の高い内容は即座にメール通知されます</li>
          <li>• 設定画面から通知の頻度を調整できます</li>
        </ul>
      </div>
    </div>
  );
}
components/safety/AlertCard.tsx
tsximport Link from 'next/link';
import type { SafetyAlert } from '@/types';

interface AlertCardProps {
  alert: SafetyAlert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const levelConfig = {
    critical: {
      icon: '🚨',
      label: 'Critical',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
    },
    warning: {
      icon: '⚠️',
      label: 'Warning',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
    },
    info: {
      icon: 'ℹ️',
      label: 'Info',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
    },
  };
  
  const config = levelConfig[alert.level];
  
  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-6`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <span className={`font-bold ${config.textColor}`}>
              {config.label}
            </span>
            <p className="text-sm text-gray-600">
              {alert.childName} - {getSubjectLabel(alert.subject)}
            </p>
          </div>
        </div>
        
        <span className="text-sm text-gray-500">
          {new Date(alert.timestamp.seconds * 1000).toLocaleString('ja-JP')}
        </span>
      </div>
      
      <div className={`mb-3 ${config.textColor}`}>
        <p className="font-medium mb-1">{alert.reason}</p>
        {alert.keywords && alert.keywords.length > 0 && (
          <p className="text-sm">
            検出キーワード: {alert.keywords.join(', ')}
          </p>
        )}
      </div>
      
      {alert.context && (
        <div className="bg-white rounded p-3 mb-3">
          <p className="text-sm text-gray-700 line-clamp-3">
            {alert.context}
          </p>
        </div>
      )}
      
      <div className="flex gap-2">
        <Link href={`/history/${alert.conversationId}`}>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
            会話を見る
          </button>
        </Link>
        
        {alert.level === 'critical' && (
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
            対応済みにする
          </button>
        )}
      </div>
    </div>
  );
}

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

2. 週次レポート (/reports)
UI要件
┌─────────────────────────────────────┐
│  週次レポート                        │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 2025年12月第1週              │   │
│  │ (12/2 - 12/8)               │   │
│  │                              │   │
│  │ 📊 今週の学習               │   │
│  │ • 合計25回のチャット         │   │
│  │ • 算数が一番人気 (10回)      │   │
│  │ • 平日の夕方に集中           │   │
│  │                              │   │
│  │ 📈 成長のポイント           │   │
│  │ • 分数の理解が深まっています │   │
│  │ • 質問の仕方が上手になりました│   │
│  │                              │   │
│  │ [PDFダウンロード] [詳細]    │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
コード例
components/reports/WeeklyReport.tsx
tsximport { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { WeeklyReport } from '@/types';

interface WeeklyReportProps {
  report: WeeklyReport;
}

export function WeeklyReportComponent({ report }: WeeklyReportProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {report.weekLabel}
        </h2>
        <p className="text-gray-600">
          {report.startDate} 〜 {report.endDate}
        </p>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">
            {report.summary.totalMessages}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            合計メッセージ
          </div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600">
            {report.summary.totalTokens.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            トークン使用量
          </div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">
            {report.summary.activeSubjects}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            学習した教科
          </div>
        </div>
      </div>
      
      {/* Subject Breakdown Chart */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          📊 教科別使用状況
        </h3>
        <BarChart width={600} height={300} data={report.subjectBreakdown}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="messages" fill="#FFB300" name="メッセージ数" />
        </BarChart>
      </div>
      
      {/* Insights */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          📈 今週の学習ハイライト
        </h3>
        <ul className="space-y-2">
          {report.insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-gray-700">{insight}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Safety Alerts */}
      {report.safetyAlerts > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-yellow-900 mb-2">
            ⚠️ 安全性アラート
          </h3>
          <p className="text-sm text-yellow-800">
            今週は{report.safetyAlerts}件のアラートがありました。
            <Link href="/alerts" className="underline ml-1">
              詳細を確認
            </Link>
          </p>
        </div>
      )}
      
      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          💡 来週のおすすめ
        </h3>
        <ul className="space-y-2">
          {report.recommendations.map((rec, index) => (
            <li key={index} className="text-gray-700">
              • {rec}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t">
        <button className="px-6 py-3 bg-honey-yellow text-white rounded-lg hover:bg-honey-yellow-dark">
          PDFをダウンロード
        </button>
        <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          メールで送信
        </button>
      </div>
    </div>
  );
}

🔧 安全性検知強化
lib/safety/detector.ts（強化版）
typescriptimport type { Message, SafetyAlert, AlertLevel, Subject } from '@/types';

interface KeywordConfig {
  level: AlertLevel;
  keywords: string[];
  contextRequired?: boolean;
}

const SAFETY_KEYWORDS: KeywordConfig[] = [
  // Critical（緊急）- 即時通知
  {
    level: 'critical',
    keywords: [
      '死にたい', '自殺', '消えたい', '生きていたくない',
      '殺す', '刺す', '爆破', 'テロ',
    ],
    contextRequired: true,
  },
  
  // Warning（警告）- 1時間に1回通知
  {
    level: 'warning',
    keywords: [
      'いじめ', 'いじめられ', '無視され', '仲間はずれ',
      '暴力', '叩かれ', '蹴られ', '殴られ',
      '怖い', '助けて', '辛い', '苦しい',
    ],
    contextRequired: true,
  },
  
  // Info（情報）- 記録のみ
  {
    level: 'info',
    keywords: [
      '悲しい', '寂しい', '不安', '心配',
      'ストレス', 'プレッシャー', '疲れた',
    ],
    contextRequired: false,
  },
];

export class SafetyDetector {
  /**
   * メッセージを分析して安全性をチェック
   */
  async analyze(
    message: Message,
    conversationHistory: Message[],
    childId: string,
    subject: Subject
  ): Promise<SafetyAlert | null> {
    const content = message.content.toLowerCase();
    
    // キーワードマッチング
    for (const config of SAFETY_KEYWORDS) {
      const matchedKeywords = config.keywords.filter(keyword =>
        content.includes(keyword)
      );
      
      if (matchedKeywords.length === 0) continue;
      
      // コンテキスト確認が必要な場合
      if (config.contextRequired) {
        const isFalsePositive = this.checkFalsePositive(
          content,
          matchedKeywords,
          conversationHistory
        );
        
        if (isFalsePositive) continue;
      }
      
      // アラート作成
      return {
        level: config.level,
        childId,
        childName: '', // 呼び出し側で設定
        subject,
        reason: this.generateReason(config.level, matchedKeywords),
        keywords: matchedKeywords,
        context: message.content,
        conversationId: '', // 呼び出し側で設定
        timestamp: new Date(),
        resolved: false,
      };
    }
    
    return null;
  }
  
  /**
   * 誤検知チェック
   */
  private checkFalsePositive(
    content: string,
    keywords: string[],
    history: Message[]
  ): boolean {
    // 例: 「死にたいくらい眠い」→ 誤検知
    const falsePositivePatterns = [
      '死にたいくらい',
      '死ぬほど',
      '殺す（ゲーム）',
    ];
    
    for (const pattern of falsePositivePatterns) {
      if (content.includes(pattern)) {
        return true;
      }
    }
    
    // 教科の文脈チェック
    // 例: 理科で「死」について学んでいる
    if (history.length > 0) {
      const recentContext = history.slice(-3)
        .map(m => m.content)
        .join(' ')
        .toLowerCase();
      
      // 学習コンテキスト
      if (
        recentContext.includes('勉強') ||
        recentContext.includes('教えて') ||
        recentContext.includes('問題')
      ) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * アラート理由を生成
   */
  private generateReason(level: AlertLevel, keywords: string[]): string {
    switch (level) {
      case 'critical':
        return `緊急: 「${keywords[0]}」など深刻なキーワードを検出しました。すぐにお子様の様子を確認してください。`;
      case 'warning':
        return `警告: 「${keywords[0]}」など気になるキーワードが含まれています。`;
      case 'info':
        return `情報: お子様が「${keywords[0]}」などネガティブな感情を表現しています。`;
      default:
        return 'キーワードを検出しました。';
    }
  }
}

/**
 * アラート一覧取得
 */
export async function getSafetyAlerts(
  userId: string,
  filter?: {
    childId?: string;
    level?: AlertLevel;
  }
): Promise<SafetyAlert[]> {
  // Firestoreからアラートを取得
  // 実装は省略
  return [];
}

🔧 通知システム
lib/notifications/email.ts
typescriptimport sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * メール送信
 */
export async function sendEmail(params: EmailParams): Promise<void> {
  try {
    await sgMail.send({
      from: process.env.SENDGRID_FROM_EMAIL!,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * 安全性アラート通知
 */
export async function sendSafetyAlert(params: {
  parentEmail: string;
  parentName: string;
  childName: string;
  level: string;
  reason: string;
  context: string;
}): Promise<void> {
  const subject = `【まなびー】${params.level === 'critical' ? '緊急' : ''}安全性アラート - ${params.childName}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FFB300; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 20px; border: 1px solid #ddd; border-top: none; }
          .alert-critical { background: #FEE; border-left: 4px solid #F44; padding: 15px; margin: 15px 0; }
          .alert-warning { background: #FFC; border-left: 4px solid #FA0; padding: 15px; margin: 15px 0; }
          .button { display: inline-block; background: #FFB300; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐝 まなびー 安全性アラート</h1>
          </div>
          <div class="content">
            <p>こんにちは、${params.parentName}さん</p>
            
            <div class="alert-${params.level}">
              <h2>${params.level === 'critical' ? '🚨 緊急アラート' : '⚠️ 警告'}</h2>
              <p><strong>お子様:</strong> ${params.childName}</p>
              <p><strong>内容:</strong> ${params.reason}</p>
            </div>
            
            <h3>会話の一部</h3>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${params.context}
            </p>
            
            <p>
              ${params.level === 'critical' 
                ? 'すぐにお子様の様子を確認してください。必要に応じて、専門家への相談をご検討ください。'
                : 'お時間のあるときに、お子様の様子を確認してください。'}
            </p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/alerts" class="button">
              アラートを確認する
            </a>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="font-size: 12px; color: #666;">
              このメールは i-manabee の安全性監視システムから自動送信されています。<br>
              通知設定は<a href="${process.env.NEXT_PUBLIC_APP_URL}/settings">設定画面</a>から変更できます。
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  const text = `
まなびー 安全性アラート

お子様: ${params.childName}
レベル: ${params.level}
内容: ${params.reason}

会話の一部:
${params.context}

詳細: ${process.env.NEXT_PUBLIC_APP_URL}/alerts
  `;
  
  await sendEmail({
    to: params.parentEmail,
    subject,
    text,
    html,
  });
}

/**
 * 週次レポート送信
 */
export async function sendWeeklyReport(params: {
  parentEmail: string;
  parentName: string;
  reportUrl: string;
  summary: string;
}): Promise<void> {
  const subject = '【まなびー】今週の学習レポート';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FFB300; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 20px; border: 1px solid #ddd; border-top: none; }
          .button { display: inline-block; background: #FFB300; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐝 まなびー 週次レポート</h1>
          </div>
          <div class="content">
            <p>こんにちは、${params.parentName}さん</p>
            
            <p>今週のお子様の学習状況をまとめました。</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ${params.summary}
            </div>
            
            <a href="${params.reportUrl}" class="button">
              詳細レポートを見る
            </a>
            
            <p style="margin-top: 30px;">
              引き続き、まなびーと一緒に楽しく学習していきましょう！
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  await sendEmail({
    to: params.parentEmail,
    subject,
    text: `まなびー 週次レポート\n\n${params.summary}\n\n詳細: ${params.reportUrl}`,
    html,
  });
}

🧪 テスト
手動テストチェックリスト
安全性検知

 Criticalキーワードで即時通知
 Warningキーワードで通知（1時間に1回）
 Infoキーワードで記録のみ
 誤検知が削減されている
 コンテキスト分析が機能する

通知システム

 メール通知が届く
 メールの内容が適切
 リンクが正しく機能する

週次レポート

 レポートが生成される
 データが正確
 グラフが表示される
 PDFダウンロードができる


📝 Claude CODEへの指示
実装手順
Day 57-58: 検知強化

lib/safety/detector.ts 強化
3段階レベル分け
誤検知削減

Day 59-60: 通知システム

SendGrid設定
lib/notifications/email.ts 実装
メールテンプレート

Day 61-62: アラート管理

/alerts ページ作成
AlertCard コンポーネント

Day 64-65: レポート生成

lib/reports/generator.ts 作成
Cloud Functions 実装

Day 66-67: レポートUI

/reports ページ作成
グラフ統合

Day 68-69: 設定画面

/settings 強化
通知設定

Day 70: 最終確認

全機能テスト
Phase 2 完了確認


🎯 完了基準

 安全性検知が3段階で動作
 通知メールが届く
 週次レポートが生成される
 アラート履歴が見られる
 すべてのテストが成功
 Phase 2 完了！ 🎉
 PROGRESS.md最終更新
 🎊 Phase 2完了後
Phase 2完了おめでとうございます！
次のステップ:

Phase 3計画の詳細化
ユーザーフィードバック収集
収益化開始
マーケティング強化


最終更新: 2025-10-07
次のフェーズ: Phase 3（Phase 2完了後に計画）