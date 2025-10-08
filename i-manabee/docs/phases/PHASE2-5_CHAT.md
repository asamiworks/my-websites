# 💬 Phase 2.5: チャット拡張実装仕様

最終更新: 2025-10-07  
Version: 1.0.0  
実装期間: Week 7-8（2025-11-18 〜 2025-12-01）

---

## 📚 前提ドキュメント

**必読（Claude CODEはこれらを先に読むこと）**:
1. [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - UIコンポーネント
2. [TYPE_REFERENCE.md](../TYPE_REFERENCE.md) - Message, MessageSuggestion型
3. [MESSAGE_TEMPLATES.md](../MESSAGE_TEMPLATES.md) - メッセージ候補システム ⭐
4. [DIRECTORY_STRUCTURE.md](../DIRECTORY_STRUCTURE.md) - ファイル配置

---

## 🎯 このフェーズの目的

メッセージ候補機能を実装し、子どもたちがAIに質問しやすくなるようにする。また、チャット履歴を保存して後から見返せるようにする。

### 達成目標
- [ ] 静的メッセージ候補（84個）が表示される
- [ ] 動的ルールベース候補が会話に応じて変わる
- [ ] 候補をタップするとメッセージが入力される
- [ ] チャット履歴がFirestoreに保存される
- [ ] 過去の会話を一覧で見られる
- [ ] 会話の続きができる

---

## ✅ 実装チェックリスト

### Week 7: メッセージ候補機能（Day 43-49）

#### Day 43-44: 静的テンプレート実装
- [ ] `data/message-templates.ts` 作成
- [ ] 全84個のテンプレート定義
- [ ] 教科×年齢グループ別の分類

#### Day 45-46: 動的ルールベース実装
- [ ] `data/suggestion-rules.ts` 作成
- [ ] `lib/suggestions/suggestionEngine.ts` 作成
- [ ] SuggestionEngine実装
- [ ] キーワード抽出ロジック
- [ ] ルールマッチング

#### Day 47-48: UI統合
- [ ] `components/chat/MessageSuggestions.tsx` 作成
- [ ] チャット画面に統合
- [ ] タップで入力欄に反映
- [ ] レスポンシブデザイン対応

#### Day 49: テスト・調整
- [ ] 全教科での動作確認
- [ ] ルールの優先度調整
- [ ] UI/UXの微調整

### Week 8: チャット履歴機能（Day 50-56）

#### Day 50-51: 履歴保存
- [ ] `lib/chat/history.ts` 作成
- [ ] Firestoreスキーマ設計
- [ ] 会話保存関数
- [ ] メッセージ追加関数

#### Day 52-53: 履歴一覧UI
- [ ] `app/(dashboard)/history/page.tsx` 作成
- [ ] `components/chat/ConversationList.tsx` 作成
- [ ] `components/chat/ConversationCard.tsx` 作成
- [ ] 検索・フィルター機能

#### Day 54-55: 会話の続き
- [ ] 過去の会話を読み込む
- [ ] コンテキスト保持
- [ ] メッセージ追加

#### Day 56: 統合テスト
- [ ] 全機能の動作確認
- [ ] パフォーマンステスト
- [ ] バグ修正
- [ ] PROGRESS.md更新

---

## 🏗️ アーキテクチャ

### メッセージ候補フロー
チャット画面表示
↓
教科・年齢グループ取得
↓
SuggestionEngine.getSuggestions()
├─ 会話履歴解析
│   ├─ キーワード抽出
│   └─ トピック検出
│
├─ ルールベース候補（0-2個）
│   ├─ マッチするルールを検索
│   └─ 優先度順にソート
│
└─ 静的テンプレート候補（残り）
└─ ランダムまたは順番に選択
↓
合計4個の候補を表示
↓
ユーザーがタップ
↓
入力欄に反映 → 送信

### チャット履歴フロー
メッセージ送信
↓
会話IDを確認
├─ 新規 → 会話ドキュメント作成
└─ 既存 → 既存の会話を使用
↓
メッセージドキュメント作成
├─ conversationsコレクション更新
└─ messagesサブコレクションに追加
↓
Firestoreに保存

### ディレクトリ構成（新規作成分）
src/
├── app/
│   └── (dashboard)/
│       └── history/
│           ├── page.tsx              ✨ 新規（履歴一覧）
│           └── [id]/
│               └── page.tsx          ✨ 新規（会話詳細）
│
├── components/
│   └── chat/
│       ├── MessageSuggestions.tsx    ✨ 新規
│       ├── ConversationList.tsx      ✨ 新規
│       └── ConversationCard.tsx      ✨ 新規
│
├── lib/
│   ├── suggestions/
│   │   └── suggestionEngine.ts       ✨ 新規
│   │
│   └── chat/
│       └── history.ts                ✨ 新規
│
└── data/
├── message-templates.ts          ✨ 新規（84個）
└── suggestion-rules.ts           ✨ 新規

---

## 📱 画面仕様

### 1. チャット画面にメッセージ候補追加

#### UI要件
┌─────────────────────────────────────┐
│  算数 - たろう            [戻る]     │
├─────────────────────────────────────┤
│                                     │
│  [まなびー先生のメッセージ]          │
│                                     │
│  [ユーザーのメッセージ]              │
│                                     │
├─────────────────────────────────────┤
│  💡 次はこんなことを聞いてみよう！   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 分数の足し算を練習したい ✨  │   │ ← 動的ルールベース
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 三角形の面積の求め方を教えて │   │ ← 静的テンプレート
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 比例と反比例の違いは？       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ グラフの読み方を練習したい   │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  [メッセージを入力...        ] [送信]│
└─────────────────────────────────────┘

#### コード例

**`components/chat/MessageSuggestions.tsx`**
```tsx
'use client';

import { useEffect, useState } from 'react';
import { SuggestionEngine } from '@/lib/suggestions/suggestionEngine';
import type { Subject, AgeGroup, Message, MessageSuggestion } from '@/types';

interface MessageSuggestionsProps {
  subject: Subject;
  ageGroup: AgeGroup;
  conversationHistory: Message[];
  onSelect: (text: string) => void;
}

export function MessageSuggestions({ 
  subject, 
  ageGroup, 
  conversationHistory,
  onSelect 
}: MessageSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<MessageSuggestion[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const engine = new SuggestionEngine();
    const results = engine.getSuggestions(
      subject,
      ageGroup,
      conversationHistory
    );
    setSuggestions(results);
  }, [subject, ageGroup, conversationHistory]);
  
  if (!isVisible || suggestions.length === 0) return null;
  
  const handleSelect = (text: string) => {
    onSelect(text);
    setIsVisible(false);
    // 2秒後に再表示
    setTimeout(() => setIsVisible(true), 2000);
  };
  
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          💡 {conversationHistory.length > 0 
            ? '次はこんなことを聞いてみよう！' 
            : 'こんなことが聞けるよ！'}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion.text)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg border transition-all
                hover:scale-105 active:scale-95
                ${suggestion.source === 'rule-based'
                  ? 'bg-honey-yellow bg-opacity-10 border-honey-yellow text-gray-800 font-medium'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              <span className="text-sm whitespace-nowrap">
                {suggestion.text}
              </span>
              {suggestion.source === 'rule-based' && (
                <span className="ml-2 text-xs">✨</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
チャット画面に統合（app/chat/page.tsx）
tsx'use client';

import { useState } from 'react';
import { MessageSuggestions } from '@/components/chat/MessageSuggestions';
// ... 他のインポート

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  
  // ... 既存のコード
  
  const handleSuggestionSelect = (text: string) => {
    setInputText(text);
    // 自動で送信する場合
    // handleSendMessage(text);
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header>...</header>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
      
      {/* Suggestions */}
      <MessageSuggestions
        subject={currentSubject}
        ageGroup={currentChild.ageGroup}
        conversationHistory={messages}
        onSelect={handleSuggestionSelect}
      />
      
      {/* Input */}
      <div className="border-t p-4">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="メッセージを入力..."
        />
        <button onClick={handleSendMessage}>送信</button>
      </div>
    </div>
  );
}

2. チャット履歴一覧 (/history)
UI要件
┌─────────────────────────────────────┐
│  チャット履歴                        │
├─────────────────────────────────────┤
│                                     │
│  [検索...] [教科▼] [子ども▼]        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔢 算数 - たろう             │   │
│  │ 分数の計算について          │   │
│  │ 2025-11-20 14:30            │   │
│  │ 10件のメッセージ             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📖 国語 - はなこ             │   │
│  │ 物語の読解について          │   │
│  │ 2025-11-19 16:45            │   │
│  │ 8件のメッセージ              │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
コード例
app/(dashboard)/history/page.tsx
tsx'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/useChildren';
import { ConversationList } from '@/components/chat/ConversationList';
import { getConversations } from '@/lib/chat/history';
import type { Conversation, Subject } from '@/types';

export default function HistoryPage() {
  const { user } = useAuth();
  const { children } = useChildren();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    subject?: Subject;
    childId?: string;
    search?: string;
  }>({});
  
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      try {
        const data = await getConversations(user.id, filter);
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [user, filter]);
  
  if (!user) return null;
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        チャット履歴
      </h1>
      
      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="検索..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg"
          onChange={(e) => setFilter({ 
            ...filter, 
            subject: e.target.value as Subject 
          })}
        >
          <option value="">すべての教科</option>
          <option value="math">算数・数学</option>
          <option value="japanese">国語</option>
          <option value="english">英語</option>
          <option value="science">理科</option>
          <option value="social">社会</option>
          <option value="programming">プログラミング</option>
          <option value="counseling">悩み相談</option>
        </select>
        
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
      </div>
      
      {/* Conversations */}
      {loading ? (
        <p className="text-gray-600">読み込み中...</p>
      ) : conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">まだチャット履歴がありません</p>
        </div>
      ) : (
        <ConversationList conversations={conversations} />
      )}
    </div>
  );
}
components/chat/ConversationCard.tsx
tsximport Link from 'next/link';
import type { Conversation } from '@/types';

interface ConversationCardProps {
  conversation: Conversation;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const subjectEmoji = getSubjectEmoji(conversation.subject);
  const subjectLabel = getSubjectLabel(conversation.subject);
  
  return (
    <Link href={`/history/${conversation.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{subjectEmoji}</span>
            <div>
              <h3 className="font-bold text-gray-800">
                {subjectLabel} - {conversation.childName}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">
                {conversation.title || '無題の会話'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {new Date(conversation.lastMessageAt.seconds * 1000).toLocaleString('ja-JP')}
          </span>
          <span>
            {conversation.messageCount}件のメッセージ
          </span>
        </div>
      </div>
    </Link>
  );
}

function getSubjectEmoji(subject: string): string {
  const emojis: Record<string, string> = {
    math: '🔢',
    japanese: '📖',
    english: '🌍',
    science: '🔬',
    social: '🗺️',
    programming: '💻',
    counseling: '💭',
  };
  return emojis[subject] || '💬';
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

🔧 SuggestionEngine実装
lib/suggestions/suggestionEngine.ts
typescriptimport { MESSAGE_TEMPLATES } from '@/data/message-templates';
import { SUGGESTION_RULES } from '@/data/suggestion-rules';
import type { 
  Subject, 
  AgeGroup, 
  Message, 
  MessageSuggestion,
} from '@/types';

interface ConversationAnalysis {
  extractedKeywords: string[];
  detectedTopics: string[];
  messageCount: number;
}

export class SuggestionEngine {
  /**
   * 会話履歴から次の質問を提案
   */
  getSuggestions(
    subject: Subject,
    ageGroup: AgeGroup,
    conversationHistory: Message[]
  ): MessageSuggestion[] {
    
    // 1. 会話履歴を解析
    const analysis = this.analyzeConversation(conversationHistory);
    
    // 2. ルールベースの提案を生成（最大2個）
    const ruleBased = this.getRuleBasedSuggestions(
      subject,
      analysis,
      2
    );
    
    // 3. 静的テンプレートを取得（残りを埋める）
    const remainingCount = 4 - ruleBased.length;
    const staticSuggestions = this.getStaticSuggestions(
      subject,
      ageGroup,
      remainingCount
    );
    
    // 4. 結合して返す
    return [...ruleBased, ...staticSuggestions];
  }
  
  /**
   * 会話履歴からキーワードを抽出
   */
  private analyzeConversation(
    messages: Message[]
  ): ConversationAnalysis {
    const recentMessages = messages.slice(-5);  // 直近5件
    const allText = recentMessages
      .map(m => m.content)
      .join(' ');
    
    // キーワード抽出
    const keywords = this.extractKeywords(allText);
    
    return {
      extractedKeywords: keywords,
      detectedTopics: this.detectTopics(keywords),
      messageCount: messages.length,
    };
  }
  
  /**
   * キーワード抽出
   */
  private extractKeywords(text: string): string[] {
    const importantWords = [
      // 算数
      '分数', '分母', '分子', '小数', '整数',
      '足し算', '引き算', '掛け算', '割り算',
      '三角形', '四角形', '円', '面積', '体積',
      '比例', '反比例', 'グラフ',
      
      // 国語
      '物語', '登場人物', '気持ち', '読解',
      '作文', '感想文', '文章', '表現',
      
      // 英語
      'be動詞', '一般動詞', '過去形', '文法',
      '会話', '単語', '発音',
      
      // 理科
      '実験', '観察', '植物', '動物',
      '化学', '物理', '地球', '宇宙',
      
      // プログラミング
      '変数', '関数', 'if文', 'ループ',
      'ゲーム', 'アプリ',
      
      // 学習状態
      'わかった', 'できた', 'わからない', '難しい',
    ];
    
    return importantWords.filter(word => text.includes(word));
  }
  
  /**
   * トピック検出
   */
  private detectTopics(keywords: string[]): string[] {
    const topicMap: Record<string, string[]> = {
      '分数': ['分数', '分母', '分子'],
      '図形': ['三角形', '四角形', '円', '面積'],
      '読解': ['物語', '登場人物', '気持ち'],
      '文法': ['be動詞', '一般動詞', '過去形'],
    };
    
    const topics: string[] = [];
    for (const [topic, relatedKeywords] of Object.entries(topicMap)) {
      if (relatedKeywords.some(kw => keywords.includes(kw))) {
        topics.push(topic);
      }
    }
    
    return topics;
  }
  
  /**
   * ルールにマッチする提案を取得
   */
  private getRuleBasedSuggestions(
    subject: Subject,
    analysis: ConversationAnalysis,
    maxCount: number
  ): MessageSuggestion[] {
    const matchedRules = SUGGESTION_RULES
      .filter(rule => {
        // 教科が一致
        if (rule.subject !== subject) return false;
        
        // キーワードが必要数以上一致
        const matchCount = rule.trigger.keywords.filter(keyword =>
          analysis.extractedKeywords.includes(keyword)
        ).length;
        
        return matchCount >= rule.trigger.requiredCount;
      })
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxCount);
    
    return matchedRules.flatMap(rule =>
      rule.suggestions.map((text, index) => ({
        id: `${rule.id}-${index}`,
        text,
        source: 'rule-based' as const,
        priority: rule.priority,
      }))
    ).slice(0, maxCount);
  }
  
  /**
   * 静的テンプレートを取得
   */
  private getStaticSuggestions(
    subject: Subject,
    ageGroup: AgeGroup,
    count: number
  ): MessageSuggestion[] {
    const templates = MESSAGE_TEMPLATES[subject][ageGroup];
    
    // ランダムに選択
    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, count).map((text, index) => ({
      id: `static-${subject}-${ageGroup}-${index}`,
      text,
      source: 'static' as const,
      priority: 0,
    }));
  }
}

🔧 チャット履歴実装
lib/chat/history.ts
typescriptimport {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Conversation, Message, Subject } from '@/types';

/**
 * 新しい会話を作成
 */
export async function createConversation(params: {
  userId: string;
  childId: string;
  childName: string;
  subject: Subject;
  title?: string;
}): Promise<string> {
  const conversation: Omit<Conversation, 'id'> = {
    userId: params.userId,
    childId: params.childId,
    childName: params.childName,
    subject: params.subject,
    title: params.title,
    messageCount: 0,
    createdAt: serverTimestamp() as any,
    lastMessageAt: serverTimestamp() as any,
  };
  
  const docRef = await addDoc(collection(db, 'conversations'), conversation);
  return docRef.id;
}

/**
 * メッセージを追加
 */
export async function addMessage(params: {
  conversationId: string;
  message: Omit<Message, 'id' | 'timestamp'>;
}): Promise<void> {
  const { conversationId, message } = params;
  
  // メッセージを追加
  const messageData = {
    ...message,
    timestamp: serverTimestamp(),
  };
  
  await addDoc(
    collection(db, 'conversations', conversationId, 'messages'),
    messageData
  );
  
  // 会話情報を更新
  const conversationRef = doc(db, 'conversations', conversationId);
  const conversationDoc = await getDoc(conversationRef);
  
  if (conversationDoc.exists()) {
    const data = conversationDoc.data();
    
    await updateDoc(conversationRef, {
      messageCount: data.messageCount + 1,
      lastMessageAt: serverTimestamp(),
      // タイトルが未設定なら最初のユーザーメッセージから生成
      title: data.title || (message.role === 'user' 
        ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
        : data.title),
    });
  }
}

/**
 * 会話一覧を取得
 */
export async function getConversations(
  userId: string,
  filters?: {
    subject?: Subject;
    childId?: string;
    search?: string;
  }
): Promise<Conversation[]> {
  let q = query(
    collection(db, 'conversations'),
    where('userId', '==', userId),
    orderBy('lastMessageAt', 'desc'),
    limit(50)
  );
  
  // フィルター適用
  if (filters?.subject) {
    q = query(q, where('subject', '==', filters.subject));
  }
  
  if (filters?.childId) {
    q = query(q, where('childId', '==', filters.childId));
  }
  
  const snapshot = await getDocs(q);
  let conversations = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Conversation[];
  
  // テキスト検索（クライアント側）
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    conversations = conversations.filter(conv =>
      conv.title?.toLowerCase().includes(searchLower) ||
      conv.childName.toLowerCase().includes(searchLower)
    );
  }
  
  return conversations;
}

/**
 * 会話の詳細とメッセージを取得
 */
export async function getConversationWithMessages(
  conversationId: string
): Promise<{ conversation: Conversation; messages: Message[] } | null> {
  const conversationRef = doc(db, 'conversations', conversationId);
  const conversationDoc = await getDoc(conversationRef);
  
  if (!conversationDoc.exists()) {
    return null;
  }
  
  // メッセージ取得
  const messagesQuery = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  
  const messagesSnapshot = await getDocs(messagesQuery);
  const messages = messagesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Message[];
  
  return {
    conversation: {
      id: conversationDoc.id,
      ...conversationDoc.data(),
    } as Conversation,
    messages,
  };
}

/**
 * 会話を削除
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  // メッセージをすべて削除
  const messagesQuery = query(
    collection(db, 'conversations', conversationId, 'messages')
  );
  const messagesSnapshot = await getDocs(messagesQuery);
  
  const deletePromises = messagesSnapshot.docs.map(doc =>
    doc.ref.delete()
  );
  
  await Promise.all(deletePromises);
  
  // 会話ドキュメントを削除
  await doc(db, 'conversations', conversationId).delete();
}

🧪 テスト
手動テストチェックリスト
メッセージ候補

 静的テンプレートが表示される
 教科別に正しいテンプレートが表示される
 年齢グループ別に適切な言葉遣い
 タップすると入力欄に反映される
 動的ルールベース候補が会話に応じて変わる
 ルールベース候補に✨マークが表示される

チャット履歴

 メッセージが保存される
 会話一覧が表示される
 検索・フィルターが機能する
 過去の会話を読み込める
 会話の続きができる
 削除ができる


📝 Claude CODEへの指示
実装手順
Day 43-44: 静的テンプレート

data/message-templates.ts 作成
84個すべて定義
MESSAGE_TEMPLATES.md参照

Day 45-46: 動的ルールベース

data/suggestion-rules.ts 作成
lib/suggestions/suggestionEngine.ts 実装

Day 47-48: UI統合

components/chat/MessageSuggestions.tsx 作成
チャット画面に統合

Day 50-51: 履歴保存

lib/chat/history.ts 作成
Firestore統合

Day 52-53: 履歴一覧

/history ページ作成

Day 54-55: 会話の続き

会話詳細ページ作成


🎯 完了基準

 メッセージ候補が機能する
 動的ルールベースが動作する
 チャット履歴が保存される
 履歴一覧が見られる
 会話の続きができる
 すべてのテストが成功
 PROGRESS.md更新


最終更新: 2025-10-07
次のフェーズ: PHASE2-6_SAFETY.md