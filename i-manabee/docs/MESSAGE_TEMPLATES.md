# 💡 i-manabee メッセージ候補システム

最終更新: 2025-10-07  
Version: 2.0.0

---

## 📚 前提ドキュメント

このドキュメントを読む前に、以下を確認してください：
- [TYPE_REFERENCE.md](./TYPE_REFERENCE.md) - `MessageSuggestion`, `SuggestionRule`型
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - メッセージ候補UIの仕様

**実装フェーズ**: Phase 2.5（Week 7-8）

---

## 🎯 システム概要

### 目的
AIを使いこなせていない子どもたちに、自然言語でAIに指示を出す方法を学んでもらう。

### 2段階アプローチ

#### Phase 2.5: 静的 + 動的ルールベース（実装確定）⭐
- 教科×年齢の**84個の固定テンプレート**
- 会話履歴を解析した**ルールベース提案**
- コスト増: **ほぼ0円**（サーバー計算のみ）

#### Phase 3.x: パーソナライズ（将来実装）
- 個人の学習履歴・理解度分析
- 真のパーソナライズ提案
- 収益化達成後に実装

---

## 📋 Part 1: 静的テンプレート（84個）

### 構造
7教科 × 3年齢グループ × 4質問 = 84個

### データ構造
```typescript
// src/data/message-templates.ts

export const MESSAGE_TEMPLATES: Record<Subject, Record<AgeGroup, string[]>> = {
  math: {
    junior: [
      "🔢 たしざんのやりかたをおしえて！",
      "⏰ とけいのよみかたがわからないよ",
      "📐 さんかくとしかくのちがいは？",
      "🍎 りんごが3こ、みかんが2こ。ぜんぶでなんこ？"
    ],
    middle: [
      "📊 分数の計算がわかりません",
      "📐 三角形の面積の求め方を教えて",
      "🧮 比例と反比例の違いは？",
      "📈 グラフの読み方を練習したい"
    ],
    senior: [
      "∫ 積分の基本を理解したい",
      "📐 三角関数の応用問題を解きたい",
      "📊 確率と統計の違いを教えて",
      "∞ 極限の概念を詳しく知りたい"
    ]
  },
  // ... 他の教科も同様
};

📚 教科別テンプレート一覧
🔢 算数・数学（Math）
Junior（小学3年生まで）
typescript[
  "🔢 たしざんのやりかたをおしえて！",
  "⏰ とけいのよみかたがわからないよ",
  "📐 さんかくとしかくのちがいは？",
  "🍎 りんごが3こ、みかんが2こ。ぜんぶでなんこ？"
]
Middle（小学4年〜中学生）
typescript[
  "📊 分数の計算がわかりません",
  "📐 三角形の面積の求め方を教えて",
  "🧮 比例と反比例の違いは？",
  "📈 グラフの読み方を練習したい"
]
Senior（高校生）
typescript[
  "∫ 積分の基本を理解したい",
  "📐 三角関数の応用問題を解きたい",
  "📊 確率と統計の違いを教えて",
  "∞ 極限の概念を詳しく知りたい"
]

📖 国語（Japanese）
Junior
typescript[
  "📖 「ごんぎつね」のおはなしについてききたい！",
  "✏️ さくぶんのかきかたをおしえて",
  "🔤 カタカナとひらがなのつかいわけは？",
  "📚 ものがたりをよむのがすき！おすすめある？"
]
Middle
typescript[
  "📖 物語の要約の書き方を教えて",
  "✏️ 作文で使える表現を知りたい",
  "📝 読書感想文のコツは？",
  "🎭 登場人物の気持ちを考えるには？"
]
Senior
typescript[
  "📖 小説の文学的技法について学びたい",
  "✏️ 小論文の構成を教えて",
  "📚 古典文学の読解のポイントは？",
  "🎨 比喩表現の効果について知りたい"
]

🌍 英語（English）
Junior
typescript[
  "🌍 Hello! ってどういういみ？",
  "🍎 くだものの えいごを おしえて！",
  "🎵 えいごのうたで べんきょうしたい",
  "👋 あいさつの れんしゅうしよう！"
]
Middle
typescript[
  "📝 be動詞と一般動詞の違いは？",
  "🗣️ 英語で自己紹介したい",
  "📚 過去形の作り方を教えて",
  "🌍 簡単な英会話を練習したい"
]
Senior
typescript[
  "📖 長文読解のコツを教えて",
  "✍️ エッセイの書き方を学びたい",
  "🗣️ ディスカッションで使える表現は？",
  "📚 仮定法をマスターしたい"
]

🔬 理科（Science）
Junior
typescript[
  "🌱 しょくぶつは どうやって そだつの？",
  "🦋 ちょうちょは なにを たべるの？",
  "☀️ たいようって なにでできてるの？",
  "💧 みずは どこから くるの？"
]
Middle
typescript[
  "🧪 化学反応って何？",
  "🔬 顕微鏡で見える世界について知りたい",
  "⚡ 電気はどうやって作られるの？",
  "🌍 地球温暖化について教えて"
]
Senior
typescript[
  "⚛️ 原子の構造を詳しく知りたい",
  "🧬 DNAの仕組みを理解したい",
  "🌌 宇宙の成り立ちについて学びたい",
  "⚗️ 化学平衡の計算問題を解きたい"
]

🗺️ 社会（Social Studies）
Junior
typescript[
  "🗾 にほんの けんの かずは？",
  "🏛️ おしろは なんのために あるの？",
  "🚃 でんしゃは どうやって うごくの？",
  "👨‍👩‍👧‍👦 まちには どんな しごとが あるの？"
]
Middle
typescript[
  "🗺️ 日本の地理を覚えたい",
  "📜 歴史の出来事を年表で整理したい",
  "🏛️ 三権分立って何？",
  "🌏 世界の国々について知りたい"
]
Senior
typescript[
  "📖 近代史の流れを理解したい",
  "💼 経済の仕組みを学びたい",
  "⚖️ 憲法の重要条文を覚えたい",
  "🌍 国際関係について考えたい"
]

💻 プログラミング（Programming）
Junior
typescript[
  "🎮 ゲームって どうやって つくるの？",
  "🤖 ロボットを うごかしてみたい！",
  "🎨 えを かく プログラムって？",
  "🔢 コンピューターは どうやって かぞえるの？"
]
Middle
typescript[
  "💻 プログラミングって何から始めればいい？",
  "🐍 Pythonで簡単なゲームを作りたい",
  "🌐 ホームページを作ってみたい",
  "🤔 変数とは何か教えて"
]
Senior
typescript[
  "⚙️ アルゴリズムの効率を改善したい",
  "🗄️ データベースの設計を学びたい",
  "🔐 セキュリティの基礎を知りたい",
  "🚀 Webアプリを作ってみたい"
]

💭 悩み相談（Counseling）
Junior
typescript[
  "😢 ともだちと けんかしちゃった...",
  "😰 べんきょうが むずかしくて つらいよ",
  "😊 たのしかったこと きいてほしい！",
  "🤔 これからの ゆめについて はなしたい"
]
Middle
typescript[
  "😔 学校に行きたくない気持ち",
  "🤝 友達関係で悩んでいます",
  "📚 勉強のやる気が出ない",
  "💭 将来のことが不安"
]
Senior
typescript[
  "😓 進路に悩んでいます",
  "💔 人間関係がうまくいかない",
  "📖 受験のプレッシャーがつらい",
  "🤔 自分の将来について話したい"
]

🔄 Part 2: 動的ルールベース提案⭐
仕組み
会話履歴を解析
  ↓
キーワード抽出
  ↓
マッチするルールを検索
  ↓
次の質問を提案（2-3個）
  ↓
静的テンプレートで残りを埋める（1-2個）
  ↓
合計4個の提案を表示

📐 ルール定義
データ構造
typescript// src/data/suggestion-rules.ts

export const SUGGESTION_RULES: SuggestionRule[] = [
  {
    id: 'math-fraction-basics',
    name: '分数の基本から応用へ',
    subject: 'math',
    trigger: {
      keywords: ['分数', '分母', '分子'],
      requiredCount: 1,
      contextWindow: 5
    },
    suggestions: [
      '分数の足し算を練習したい',
      '分数を小数に変換するには？',
      '分数の割り算の意味を知りたい'
    ],
    priority: 10
  },
  // ... 他のルール
];

🎓 教科別ルール一覧
🔢 算数・数学のルール
分数の流れ
typescript{
  id: 'math-fraction-basics',
  name: '分数の基本から応用へ',
  subject: 'math',
  trigger: {
    keywords: ['分数', '分母', '分子'],
    requiredCount: 1,
    contextWindow: 5
  },
  suggestions: [
    '分数の足し算を練習したい',
    '分数を小数に変換するには？',
    '分数の割り算の意味を知りたい'
  ],
  priority: 10
},
{
  id: 'math-fraction-advanced',
  name: '分数計算から図形へ',
  subject: 'math',
  trigger: {
    keywords: ['分数', '計算', 'できた', 'わかった'],
    requiredCount: 2,
    contextWindow: 5
  },
  suggestions: [
    '分数を使った文章題にチャレンジ',
    '図形の面積を分数で表すには？',
    '比と分数の関係を知りたい'
  ],
  priority: 8
}
図形の流れ
typescript{
  id: 'math-shape-basics',
  name: '図形の基礎',
  subject: 'math',
  trigger: {
    keywords: ['三角形', '四角形', '図形'],
    requiredCount: 1,
    contextWindow: 5
  },
  suggestions: [
    '三角形の面積の求め方を教えて',
    '合同な図形とは何？',
    '角度の計算方法を知りたい'
  ],
  priority: 10
},
{
  id: 'math-shape-area',
  name: '面積から体積へ',
  subject: 'math',
  trigger: {
    keywords: ['面積', '求め方', 'わかった'],
    requiredCount: 2,
    contextWindow: 5
  },
  suggestions: [
    '立体の体積を求めたい',
    '円の面積と円周の関係は？',
    '複雑な図形の面積の求め方'
  ],
  priority: 9
}

📖 国語のルール
読解から作文へ
typescript{
  id: 'japanese-reading-to-writing',
  name: '読解から作文への流れ',
  subject: 'japanese',
  trigger: {
    keywords: ['物語', '読解', '登場人物', '気持ち'],
    requiredCount: 1,
    contextWindow: 5
  },
  suggestions: [
    '読書感想文の書き方を教えて',
    '登場人物の気持ちを文章で表現したい',
    '物語の続きを考えて書きたい'
  ],
  priority: 10
},
{
  id: 'japanese-writing-improvement',
  name: '作文の上達',
  subject: 'japanese',
  trigger: {
    keywords: ['作文', '書いた', '感想文'],
    requiredCount: 1,
    contextWindow: 5
  },
  suggestions: [
    '作文をもっと上手に書くコツは？',
    '表現力を豊かにする方法',
    '文章の構成を学びたい'
  ],
  priority: 9
}

🌍 英語のルール
文法から会話へ
typescript{
  id: 'english-grammar-to-conversation',
  name: '文法から会話練習へ',
  subject: 'english',
  trigger: {
    keywords: ['be動詞', '一般動詞', '文法', 'わかった'],
    requiredCount: 2,
    contextWindow: 5
  },
  suggestions: [
    '簡単な英会話を練習したい',
    '自己紹介を英語で言いたい',
    '日常会話で使える表現を知りたい'
  ],
  priority: 9
},
{
  id: 'english-vocabulary-expansion',
  name: '語彙力の向上',
  subject: 'english',
  trigger: {
    keywords: ['単語', '覚える', 'vocabulary'],
    requiredCount: 1,
    contextWindow: 5
  },
  suggestions: [
    '効率的な単語の覚え方は？',
    'よく使う英単語を教えて',
    '単語帳の使い方を知りたい'
  ],
  priority: 8
}

🔬 理科のルール
観察から実験へ
typescript{
  id: 'science-observation-to-experiment',
  name: '観察から実験へ',
  subject: 'science',
  trigger: {
    keywords: ['観察', '見る', '調べる'],
    requiredCount: 1,
    contextWindow: 5
  },
  suggestions: [
    '家でできる簡単な実験を教えて',
    '観察した結果をどうまとめる？',
    '実験の仮説の立て方を知りたい'
  ],
  priority: 10
},
{
  id: 'science-phenomenon-explanation',
  name: '現象の理解',
  subject: 'science',
  trigger: {
    keywords: ['なぜ', 'どうして', '理由'],
    requiredCount: 1,
    contextWindow: 5
  },
  suggestions: [
    'この現象が起こる仕組みを知りたい',
    '科学的に説明するとどうなる？',
    '日常生活との関係を教えて'
  ],
  priority: 9
}

💻 プログラミングのルール
基礎から実践へ
typescript{
  id: 'programming-basics-to-project',
  name: '基礎から作品作りへ',
  subject: 'programming',
  trigger: {
    keywords: ['変数', '関数', 'if文', 'わかった'],
    requiredCount: 2,
    contextWindow: 5
  },
  suggestions: [
    '簡単なゲームを作ってみたい',
    '自分のアイデアをプログラムにしたい',
    'もっと複雑なことをしてみたい'
  ],
  priority: 9
},
{
  id: 'programming-debugging',
  name: 'デバッグスキル',
  subject: 'programming',
  trigger: {
    keywords: ['エラー', 'うまくいかない', 'バグ'],
    requiredCount: 1,
    contextWindow: 5
  },
  suggestions: [
    'エラーの見つけ方を教えて',
    'デバッグのコツは？',
    'よくある間違いと解決方法'
  ],
  priority: 10
}

💭 悩み相談のルール
共感から具体策へ
typescript{
  id: 'counseling-empathy-to-action',
  name: '悩みから行動へ',
  subject: 'counseling',
  trigger: {
    keywords: ['つらい', '悲しい', '困ってる'],
    requiredCount: 1,
    contextWindow: 3
  },
  suggestions: [
    'どうしたら気持ちが楽になる？',
    '明日からできることを考えたい',
    '誰かに相談する方法を知りたい'
  ],
  priority: 15  // 悩み相談は最優先
},
{
  id: 'counseling-positive-thinking',
  name: '前向き思考',
  subject: 'counseling',
  trigger: {
    keywords: ['できない', '無理', 'ダメ'],
    requiredCount: 1,
    contextWindow: 3
  },
  suggestions: [
    '自分の良いところを見つけたい',
    '小さな成功体験を積むには？',
    '前向きに考える方法を教えて'
  ],
  priority: 12
}

🔧 実装ガイド
SuggestionEngine
typescript// src/lib/suggestions/suggestionEngine.ts

import { MESSAGE_TEMPLATES } from '@/data/message-templates';
import { SUGGESTION_RULES } from '@/data/suggestion-rules';
import type { 
  Subject, 
  AgeGroup, 
  Message, 
  MessageSuggestion,
  ConversationAnalysis 
} from '@/types';

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
   * 会話履歴からキーワードとトピックを抽出
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
      difficulty: this.detectDifficulty(messages),
      messageCount: messages.length,
      lastUpdated: new Date()
    };
  }
  
  /**
   * キーワード抽出（シンプル版）
   */
  private extractKeywords(text: string): string[] {
    // 重要キーワードのリスト
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
      
      // 社会
      '歴史', '地理', '政治', '経済',
      
      // プログラミング
      '変数', '関数', 'if文', 'ループ',
      'ゲーム', 'アプリ',
      
      // 悩み相談
      'つらい', '悲しい', '困ってる', '心配',
      '友達', '学校', '家族',
      
      // 学習状態
      'わかった', 'できた', 'わからない', '難しい'
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
      // ...
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
   * 難易度検出
   */
  private detectDifficulty(messages: Message[]): 'beginner' | 'intermediate' | 'advanced' {
    // メッセージの長さや内容から難易度を推測
    const avgLength = messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length;
    
    if (avgLength < 30) return 'beginner';
    if (avgLength < 60) return 'intermediate';
    return 'advanced';
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
      .sort((a, b) => b.priority - a.priority)  // 優先度順
      .slice(0, maxCount);
    
    // 提案に変換
    return matchedRules.flatMap(rule =>
      rule.suggestions.map((text, index) => ({
        id: `${rule.id}-${index}`,
        text,
        source: 'rule-based' as const,
        priority: rule.priority
      }))
    );
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
    
    // ランダムに選択、または順番に
    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, count).map((text, index) => ({
      id: `static-${subject}-${ageGroup}-${index}`,
      text,
      source: 'static' as const,
      priority: 0
    }));
  }
}

使用例
typescript// components/chat/MessageSuggestions.tsx

import { useEffect, useState } from 'react';
import { SuggestionEngine } from '@/lib/suggestions/suggestionEngine';
import type { Subject, AgeGroup, Message, MessageSuggestion } from '@/types';

interface Props {
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
}: Props) {
  const [suggestions, setSuggestions] = useState<MessageSuggestion[]>([]);
  
  useEffect(() => {
    const engine = new SuggestionEngine();
    const results = engine.getSuggestions(
      subject,
      ageGroup,
      conversationHistory
    );
    setSuggestions(results);
  }, [subject, ageGroup, conversationHistory]);
  
  if (suggestions.length === 0) return null;
  
  return (
    <div className="suggestion-container">
      <p className="suggestion-label">
        💡 {conversationHistory.length > 0 
          ? '次はこんなことを聞いてみよう！' 
          : 'こんなことが聞けるよ！'}
      </p>
      
      <div className="suggestion-scroll">
        {suggestions.map(suggestion => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.text)}
            className={`suggestion-card ${
              suggestion.source === 'rule-based' ? 'suggestion-dynamic' : ''
            }`}
          >
            {suggestion.text}
            {suggestion.source === 'rule-based' && (
              <span className="suggestion-badge">おすすめ</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

📊 期待効果
指標Phase 2.5のみ（静的）Phase 2.5 + 動的エンゲージメント+15%+30%継続率（3ヶ月）+10%+20%平均会話長+20%+40%親の満足度+15%+30%

🧪 テスト
単体テスト
typescript// tests/unit/suggestion-engine.test.ts

import { SuggestionEngine } from '@/lib/suggestions/suggestionEngine';

describe('SuggestionEngine', () => {
  const engine = new SuggestionEngine();
  
  test('静的テンプレートを正しく取得', () => {
    const suggestions = engine.getSuggestions('math', 'junior', []);
    expect(suggestions).toHaveLength(4);
    expect(suggestions.every(s => s.source === 'static')).toBe(true);
  });
  
  test('ルールベース提案が優先される', () => {
    const history = [
      { role: 'user', content: '分数の計算がわかりません', /* ... */ },
      { role: 'assistant', content: '分数は分母を揃えて...', /* ... */ }
    ];
    
    const suggestions = engine.getSuggestions('math', 'middle', history);
    
    // ルールベース提案が含まれているか
    const hasDynamic = suggestions.some(s => s.source === 'rule-based');
    expect(hasDynamic).toBe(true);
  });
});

📞 次のステップ

phases/PHASE2-5_CHAT.md で実装詳細を確認
Phase 2.1〜2.2完了後に実装開始
A/Bテストで効果測定


最終更新: 2025-10-07
管理者: AsamiWorks
