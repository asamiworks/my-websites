i-manabee（あいまなびー）完全仕様書
最終更新: 2025-09-24 | Version: 9.0.0 | 完全実装版

📋 プロジェクト概要
yamlサービス名: i-manabee（あいまなびー）
通称: まなびー
URL: https://i-manabee.com
キャッチコピー: AI体験は「まなびー」
対象年齢: 6-18歳
開発者: AsamiWorks（浅見洋輔）
開始日: 2025-09-24
開発環境: C:\Users\洋輔\Documents\GitHub\my-websites\i-manabee
🎯 ミッション
6-18歳の子どもたちに「安心して使えるAI学習体験」を提供し、AIリテラシー教育の新しいスタンダードを創造する
🐝 ブランドアイデンティティ
yamlメインカラー: #FFB300（ハニーイエロー）
サブカラー: #FF6B6B（ハートピンク）、#4CAF50（安心グリーン）
キャラクター: まなびー先生（ハートを持った蜂）
ロゴ: i ❤️ 🐝
ペルソナ: 勉強が大好きで、子どもたちを優しく見守る蜂の先生

⚖️ 法的コンプライアンス
特定商取引法に基づく表記
yaml事業者名: AsamiWorks
代表者名: 浅見洋輔
所在地: [登記住所 or バーチャルオフィス]
電話番号: [専用番号取得予定]
メールアドレス: support@i-manabee.com
販売価格: 各プランページに記載
支払方法: クレジットカード（前払い）
支払時期: 月額課金（毎月同日）
サービス提供時期: 決済完了後即時
返金・キャンセル: 初回登録7日以内全額返金
必須法的ページ
yaml/terms          # 利用規約
/privacy        # プライバシーポリシー
/sct            # 特定商取引法に基づく表記
/contact        # お問い合わせ
/coppa          # 児童プライバシー保護方針
/ai-disclaimer  # AI利用に関する免責事項
COPPA（児童オンラインプライバシー保護法）準拠
yaml13歳未満の対応:
  - 保護者の明示的同意取得フロー
  - 同意記録の保存（タイムスタンプ付き）
  - 個人情報収集の最小化
  - 第三者提供の原則禁止
  - 保護者によるデータ削除権の保証
  
実装:
  - 生年月日から自動判定
  - 専用同意フォーム表示
  - データ処理制限フラグ
  - 定期的な同意確認（年1回）
AI生成コンテンツの責任範囲
markdown【免責事項】
1. AIの回答は参考情報であり、正確性を保証しません
2. 学習成果は個人差があり、成績向上を約束しません  
3. AIは医療・法律等の専門的助言を提供しません
4. 生成された内容による損害の責任は負いません
5. 保護者の監督下での利用を前提とします

🚨 API暴走対策・リスク管理
緊急停止システム
typescript// API利用料金の上限設定
const apiLimits = {
  alerts: {
    perMinute: 100,        // 1分間のリクエスト数
    perHour: 1000,         // 1時間のAPI費用（円）
    perDay: 3000,          // 1日のAPI費用（円）
    perMonth: 30000        // 月間のAPI費用（円）
  },
  
  actions: {
    softLimit: {
      threshold: 0.8,      // 警告閾値（80%）
      action: "管理者通知 + ログ記録"
    },
    hardLimit: {
      threshold: 1.0,      // 停止閾値（100%）
      action: "自動サービス停止 + 緊急通知"
    },
    emergency: {
      threshold: 1.5,      // 緊急閾値（150%）
      action: "全APIコール即時停止"
    }
  }
};

// DDoS攻撃対策
const ddosProtection = {
  rateLimit: {
    windowMs: 60000,       // 1分間
    max: 50,              // 最大リクエスト数
    message: "リクエストが多すぎます"
  },
  
  ipBlocking: {
    maxAttempts: 100,     // 1時間あたり
    blockDuration: 3600,  // ブロック時間（秒）
    whiteList: ["127.0.0.1"]
  },
  
  cloudflare: {          // Phase 3以降
    enabled: true,
    level: "medium"
  }
};
無限ループ防止
typescript// メッセージ送信の制御
const loopPrevention = {
  maxConsecutiveMessages: 3,     // 連続送信上限
  cooldownPeriod: 1000,          // クールダウン（ms）
  maxTokensPerMessage: 2000,     // 1メッセージの上限
  maxConversationLength: 100,    // 会話の最大長
  
  circuitBreaker: {
    threshold: 10,               // エラー回数
    timeout: 60000,             // リセット時間
    halfOpenRequests: 3         // 半開状態のリクエスト数
  }
};

💾 データバックアップ・災害対策
バックアップ戦略
yamlMVP (Phase 1):
  頻度: 週1回手動
  方法: Firebase Admin SDK経由
  保存先: Google Drive
  世代管理: 3世代
  
Growth (Phase 2):
  頻度: 日次自動
  方法: Cloud Functions定期実行
  保存先: Cloud Storage
  世代管理: 7世代
  
Scale (Phase 3-4):
  頻度: リアルタイム + 日次スナップショット
  方法: Firestore自動バックアップ
  保存先: マルチリージョン
  世代管理: 30世代
災害復旧計画（DRP）
yaml目標指標:
  RTO（復旧時間目標）: 
    MVP: 24時間
    Production: 4時間
  RPO（復旧時点目標）:
    MVP: 1週間前
    Production: 1時間前

復旧手順:
  1. 障害検知:
     - 自動監視アラート
     - ユーザー報告
     
  2. 初動対応（30分以内）:
     - 静的メンテナンスページ表示
     - ユーザーへの通知（メール/SNS）
     - 原因調査開始
     
  3. 復旧作業:
     - 最新バックアップの確認
     - データリストア実行
     - 動作確認
     
  4. サービス再開:
     - 段階的なアクセス開放
     - 監視強化
     - 事後報告書作成
     
  5. 補償対応:
     - 影響期間の日割り返金
     - お詫びメール送信
データ移行計画
typescript// Firebaseからの移行準備（将来的なベンダーロックイン回避）
interface MigrationPlan {
  exportFormats: {
    users: "JSON",
    chats: "JSON + メッセージ別ファイル",
    usage: "CSV",
    safety: "JSON"
  },
  
  tools: {
    export: "Firebase Admin SDK",
    transform: "Custom Node.js Scripts", 
    import: "Target DB SDK"
  },
  
  timeline: {
    preparation: "2週間",
    testing: "1週間", 
    migration: "1日（メンテナンス）",
    validation: "3日"
  }
}

🎤 音声入力機能と同意管理
Web Speech API使用規約
yaml保護者への説明事項:
  - 音声データはブラウザ内で処理
  - サーバーに音声データは送信・保存しない
  - Google/Apple等の音声認識サービスを使用
  - 認識精度は100%ではない
  
13歳未満の同意フロー:
  1. 初回利用時にポップアップ表示
  2. 保護者のメールアドレス入力
  3. 確認メール送信
  4. メール内リンクから同意
  5. 同意記録をFirestoreに保存
  
ブラウザ対応:
  対応: Chrome, Edge, Safari（iOS 14.5+）
  非対応: Firefox, IE
  フォールバック: テキスト入力に切り替え
実装コード
typescript// 音声入力の同意確認
const requestVoicePermission = async (childAge: number) => {
  if (childAge < 13) {
    const consent = await checkParentConsent('voice_input');
    if (!consent) {
      await sendConsentEmail();
      return false;
    }
  }
  
  try {
    const permission = await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    console.error('音声入力の許可が得られませんでした');
    return false;
  }
};

🆘 悩み相談の専門家連携
緊急時対応フロー
yamlレベル1（最重要・即時対応）:
  キーワード: ["死にたい", "消えたい", "自殺", "リストカット"]
  対応:
    1. AIが共感的メッセージを即座に返信
    2. 相談窓口を自動表示
    3. 保護者へ即時メール+SMS通知
    4. 管理者へアラート
    5. 24時間以内に保護者へ電話確認（Phase 3）
    
レベル2（重要・24時間以内）:
  キーワード: ["いじめ", "虐待", "暴力", "家出"]
  対応:
    1. AIが励ましと相談を促すメッセージ
    2. 24時間以内に保護者へメール通知
    3. 週次レポートで詳細報告
    
レベル3（要観察・週次報告）:
  キーワード: ["学校行きたくない", "友達いない", "つらい"]
  対応:
    1. AIが通常のサポート対応
    2. 週次レポートに記載
    3. 頻度が高い場合は保護者通知
専門機関連携（Phase 3以降）
yaml連携予定機関:
  - チャイルドライン支援センター
  - 日本いのちの電話連盟
  - 全国子ども会連合会
  
連携内容:
  - 相談窓口情報の定期更新
  - 対応マニュアルの監修
  - 緊急時の直接連携体制
  
カウンセラー監修:
  - 応答テンプレートの作成
  - NGワードリストの定期見直し
  - false positive/negativeの分析

❌ スコープ外（実装しない機能）
yaml絶対に実装しない:
  - 動画通話/音声通話機能
  - 子ども同士のチャット機能
  - SNS的な機能（いいね、フォロー、共有等）
  - 宿題の写真撮影→自動解答機能
  - 保護者同士の交流機能
  - ゲーミフィケーション（ポイント、バッジ、ランキング等）
  - オフライン対応
  - 学校/塾との連携機能
  - AIによる成績予測
  - カレンダー/スケジュール管理
  - 外部教材との連携
  - 広告表示（全プラン広告なし）
  
Phase 4以降検討:
  - ネイティブアプリ（iOS/Android）
  - 詳細な学習分析（学習時間グラフ、理解度チャート等）
  - 初回割引・クーポン機能
  - B2B向けAPI提供

🚀 段階的実装計画
Phase 1: MVP（0-3ヶ月）
yaml目標ユーザー数: 1-50人
月間インフラコスト: 500円
API費用想定: 500円/月
必要会員数: 2人（損益分岐点）
開発期間: 1ヶ月

実装機能:
  ✅ 基本的なチャット機能（同期レスポンス）
  ✅ Firebase認証（メール/パスワード）
  ✅ PINコード認証（4桁数字）
  ✅ トークン制限（期ごとリセット）
  ✅ 子どもプロファイル（1人のみ）
  ✅ NGワード検知（基本）
  ✅ 緊急キーワード通知
  ✅ API暴走対策
  ✅ 週次手動バックアップ
  
技術スタック:
  - Next.js 14 (Node.js Runtime)
  - Firebase Auth/Firestore
  - OpenAI API (GPT-3.5)
  - Vercel (Free tier)
  
Firebase制限対策:
  - 読み取り: 50,000回/日まで
  - 書き込み: 20,000回/日まで
  - 同時接続: 100まで
Phase 2: Growth（3-6ヶ月）
yaml目標ユーザー数: 50-200人
月間インフラコスト: 2,000円
API費用想定: 3,000円/月
必要会員数: 10人（損益分岐点）
開発期間: 2ヶ月

追加機能:
  ✅ ストリーミングレスポンス
  ✅ 音声入力（Web Speech API）
  ✅ 複数子どもプロファイル（3人まで）
  ✅ 教科別AI切り替え
  ✅ Stripe決済統合
  ✅ 週次レポート（自動メール）
  ✅ Redis導入（キャッシュ）
  ✅ 日次自動バックアップ
  
追加技術:
  - Redis (Upstash)
  - Gemini API
  - Claude API
  - Stripe
  - SendGrid（メール）
  
パフォーマンス改善:
  - Redisで頻繁アクセスデータをキャッシュ
  - バッチ処理で書き込み最適化
Phase 3: Scale（6-12ヶ月）
yaml目標ユーザー数: 200-1000人
月間インフラコスト: 5,000円
API費用想定: 15,000円/月
必要会員数: 40人（損益分岐点）
開発期間: 3ヶ月

追加機能:
  ✅ 5人までの子どもプロファイル
  ✅ 詳細な利用分析ダッシュボード
  ✅ 管理者向け監視画面
  ✅ APIサーバー分離
  ✅ A/Bテスト基盤
  ✅ リアルタイムバックアップ
  ✅ CloudFlare DDoS対策
  
インフラ進化:
  - Docker化
  - Cloud Run
  - Cloud SQL
  - Grafana監視
  - Sentry（エラー監視）
Phase 4: Enterprise（12ヶ月〜）
yaml目標ユーザー数: 1000人以上
月間インフラコスト: 15,000円〜
API費用想定: 50,000円/月
必要会員数: 100人（損益分岐点）
開発期間: 6ヶ月

追加機能:
  ✅ 無制限プロファイル（プレミアム）
  ✅ 専門機関連携
  ✅ B2B API提供
  ✅ 多言語対応準備
  ✅ データ分析基盤（BigQuery）
  
完全インフラ:
  - Kubernetes
  - マルチリージョン
  - BigQuery
  - Datadog
  - 24/7監視体制

💰 料金プランと収支計画
料金プラン詳細
yaml無料プラン:
  料金: 0円
  利用制限: 5回 かつ 1,000トークン/期
  リセット: 6時・18時（1日2期制）
  子ども数: 1人
  AI: GPT-3.5-turbo
  データ保存: 無期限
  API費用/人: 約20円/月
  
まなびーキッズ:
  料金: 480円/月
  利用制限: 4,000トークン/期
  リセット: 6時・18時
  子ども数: 1人（小学3年生まで）
  AI: GPT-3.5 → Phase2で教科別
  週次レポート: Phase2から
  API費用/人: 約140円/月
  粗利益: 340円（70.8%）
  
まなびーフレンズ:
  料金: 880円/月
  利用制限: 8,000トークン/期（家族共有）
  リセット: 6時・18時
  子ども数: 3人まで
  AI: GPT-3.5 → Phase2で教科別
  週次レポート: あり
  API費用/人: 約220円/月
  粗利益: 660円（75%）
  
まなびープレミアム:
  料金: 1,540円/月
  利用制限: 無制限
  子ども数: 5人まで
  AI: 最新の教科別AI
  週次レポート: 詳細版
  優先サポート: あり
  API費用/人: 約480円/月
  粗利益: 1,060円（68.8%）
トークンカウント統一システム
typescript// 各AIモデル対応のトークンカウンター
import { encoding_for_model } from 'tiktoken';

class UniversalTokenCounter {
  private gptEncoder = encoding_for_model('gpt-3.5-turbo');
  
  count(text: string, model: string): number {
    switch(model) {
      case 'gpt-3.5-turbo':
      case 'gpt-4':
        return this.gptEncoder.encode(text).length;
        
      case 'claude-3-haiku':
        // Claudeは約1.3倍のトークン数
        return Math.ceil(text.length / 3 * 1.3);
        
      case 'gemini-1.5-flash':
        // Geminiは文字数/4が目安
        return Math.ceil(text.length / 4);
        
      default:
        // 安全マージンを含めた概算
        return Math.ceil(text.length / 2.5);
    }
  }
  
  // 料金計算
  calculateCost(tokens: number, model: string): number {
    const pricing = {
      'gpt-3.5-turbo': 0.002,    // $0.002/1K tokens
      'gpt-4': 0.03,              // $0.03/1K tokens
      'claude-3-haiku': 0.00025,  // $0.00025/1K tokens
      'gemini-1.5-flash': 0.00035 // $0.00035/1K tokens
    };
    
    return (tokens / 1000) * (pricing[model] || 0.002) * 150; // 円換算
  }
}

🤖 教科別AI配置戦略
無料プラン
yaml全教科: GPT-3.5-turbo
理由: コスト最小化
有料プラン（Phase 2以降）
yaml算数・数学:
  AI: Gemini 1.5 Flash
  理由: 計算精度が最高
  想定利用率: 30%
  
理科:
  AI: Gemini 1.5 Flash
  理由: 実験・化学式の正確性
  想定利用率: 15%
  
英語:
  AI: GPT-4o mini
  理由: ネイティブ表現の自然さ
  想定利用率: 20%
  
国語:
  AI: Claude 3 Haiku
  理由: 読解・作文添削の質
  想定利用率: 15%
  
社会:
  AI: Claude 3 Haiku
  理由: 論理的思考の促進
  想定利用率: 10%
  
プログラミング:
  AI: Claude 3 Haiku
  理由: コード品質と説明力
  想定利用率: 5%
  
悩み相談:
  AI: Claude 3 Haiku
  理由: 安全性と共感性
  想定利用率: 5%

📁 ディレクトリ構造（MVP版）
i-manabee/
├── 📄 README.md
├── 📄 package.json
├── 📄 .env.local
├── 📄 .gitignore
├── 📄 next.config.js
├── 📄 tsconfig.json
├── 📄 firebase.json
├── 📄 firestore.rules
├── 📄 firestore.indexes.json
│
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 (auth)/             
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── 📁 (legal)/            # 法的ページ
│   │   │   ├── terms/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   ├── sct/page.tsx
│   │   │   └── coppa/page.tsx
│   │   ├── 📁 (dashboard)/
│   │   │   ├── page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── subscription/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx
│   │   ├── 📁 chat/
│   │   │   └── page.tsx
│   │   ├── 📁 api/
│   │   │   ├── 📁 auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   └── pin/route.ts
│   │   │   ├── 📁 chat/
│   │   │   │   └── route.ts
│   │   │   ├── 📁 safety/
│   │   │   │   ├── check/route.ts
│   │   │   │   └── alert/route.ts
│   │   │   ├── 📁 monitor/         # API監視
│   │   │   │   ├── usage/route.ts
│   │   │   │   └── limit/route.ts
│   │   │   └── 📁 backup/
│   │   │       └── manual/route.ts
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── error.tsx
│   │
│   ├── 📁 components/
│   │   ├── 📁 chat/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── InputArea.tsx
│   │   │   └── VoiceInput.tsx
│   │   ├── 📁 safety/
│   │   │   ├── EmergencyDialog.tsx
│   │   │   └── HelplineInfo.tsx
│   │   ├── 📁 profile/
│   │   │   ├── ChildCard.tsx
│   │   │   ├── AvatarSelector.tsx
│   │   │   └── PinDialog.tsx
│   │   └── 📁 ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Alert.tsx
│   │       └── Loading.tsx
│   │
│   ├── 📁 lib/
│   │   ├── 📁 firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   └── admin.ts
│   │   ├── 📁 ai/
│   │   │   ├── openai.ts
│   │   │   ├── prompts.ts
│   │   │   └── token-counter.ts
│   │   ├── 📁 safety/
│   │   │   ├── keywords.ts
│   │   │   ├── detector.ts
│   │   │   └── notifier.ts
│   │   ├── 📁 monitor/           # API監視
│   │   │   ├── api-limiter.ts
│   │   │   ├── ddos-protection.ts
│   │   │   └── circuit-breaker.ts
│   │   ├── 📁 backup/
│   │   │   └── firebase-backup.ts
│   │   └── 📁 utils/
│   │       ├── constants.ts
│   │       ├── validators.ts
│   │       └── helpers.ts
│   │
│   ├── 📁 hooks/
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── useProfile.ts
│   │   ├── useTokenUsage.ts
│   │   └── useSafety.ts
│   │
│   ├── 📁 stores/                 # 状態管理
│   │   ├── authStore.ts
│   │   ├── chatStore.ts
│   │   └── profileStore.ts
│   │
│   ├── 📁 styles/
│   │   ├── 📁 themes/
│   │   │   ├── junior.module.css
│   │   │   ├── middle.module.css
│   │   │   └── senior.module.css
│   │   └── variables.css
│   │
│   └── 📁 types/
│       ├── user.ts
│       ├── chat.ts
│       ├── safety.ts
│       └── subscription.ts
│
├── 📁 public/
│   ├── favicon.ico
│   ├── maintenance.html           # 静的メンテナンスページ
│   ├── 📁 images/
│   │   ├── logo.svg
│   │   ├── manabee.svg
│   │   └── 📁 avatars/
│   │       └── [8種類の動物].svg
│   └── 📁 sounds/
│       └── notification.mp3
│
├── 📁 scripts/
│   ├── backup.ts                 # 手動バックアップ
│   ├── restore.ts                # リストア
│   ├── reset-tokens.ts           # トークンリセット
│   ├── check-limits.ts           # API制限チェック
│   └── test-safety.ts            # 安全性テスト
│
├── 📁 tests/
│   ├── 📁 unit/
│   │   ├── safety.test.ts
│   │   ├── token-counter.test.ts
│   │   └── api-limiter.test.ts
│   ├── 📁 integration/
│   │   └── chat-flow.test.ts
│   └── 📁 e2e/
│       └── user-journey.test.ts
│
└── 📁 docs/
    ├── setup.md
    ├── api.md
    ├── safety-guidelines.md
    ├── disaster-recovery.md
    └── legal-compliance.md

🗄️ データベース設計（Firestore）
typescript// コレクション構造
interface FirestoreSchema {
  // ユーザー（保護者）
  users: {
    [userId: string]: {
      email: string;
      plan: 'free' | 'kids' | 'friends' | 'premium';
      createdAt: Timestamp;
      lastLogin: Timestamp;
      
      // 同意記録
      consents: {
        terms: { accepted: boolean; timestamp: Timestamp; };
        privacy: { accepted: boolean; timestamp: Timestamp; };
        coppa?: { accepted: boolean; timestamp: Timestamp; parentEmail: string; };
        voiceInput?: { accepted: boolean; timestamp: Timestamp; };
      };
      
      // 設定
      settings: {
        emailNotifications: boolean;
        weeklyReports: boolean;
        safetyAlerts: boolean;
        emergencyContact?: string;  // 緊急連絡先
      };
      
      // 支払い情報（Phase 2以降）
      payment?: {
        stripeCustomerId: string;
        subscriptionId: string;
        nextBillingDate: Timestamp;
      };
    };
  };
  
  // 子どもプロファイル
  children: {
    [childId: string]: {
      parentId: string;
      nickname: string;
      birthMonth: string;  // YYYY-MM
      avatar: string;
      pin: string;  // bcrypt hashed
      ageGroup: 'junior' | 'middle' | 'senior';
      createdAt: Timestamp;
      lastActive: Timestamp;
      isActive: boolean;
    };
  };
  
  // チャット履歴
  chats: {
    [chatId: string]: {
      childId: string;
      startedAt: Timestamp;
      lastMessageAt: Timestamp;
      messages: Array<{
        role: 'user' | 'assistant';
        content: string;
        timestamp: Timestamp;
        tokens: number;
        flagged?: boolean;  // 安全性フラグ
      }>;
      metadata: {
        totalTokens: number;
        messageCount: number;
        subject?: string;
        aiModel: string;
      };
    };
  };
  
  // 利用状況追跡
  usage: {
    [userId: string]: {
      [date: string]: {  // YYYY-MM-DD
        periods: {
          morning: {  // 6:00-18:00
            messages: number;
            tokens: number;
            resetAt: Timestamp;
          };
          evening: {  // 18:00-6:00
            messages: number;
            tokens: number;
            resetAt: Timestamp;
          };
        };
        apiCost: number;  // 概算API費用
        subjects: Record<string, number>;
      };
    };
  };
  
  // 安全ログ
  safetyLogs: {
    [logId: string]: {
      childId: string;
      parentId: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      detectedAt: Timestamp;
      keyword: string;
      message: string;
      context: string;  // 前後のメッセージ
      parentNotified: boolean;
      notifiedAt?: Timestamp;
      resolved: boolean;
    };
  };
  
  // API監視ログ
  apiMonitor: {
    [date: string]: {  // YYYY-MM-DD
      hourly: {
        [hour: string]: {
          requests: number;
          cost: number;
          errors: number;
          avgLatency: number;
        };
      };
      alerts: Array<{
        timestamp: Timestamp;
        type: 'cost' | 'rate' | 'error';
        message: string;
        value: number;
      }>;
    };
  };
}

🎨 UI/UXデザインシステム
カラーパレット
css:root {
  /* Primary Colors */
  --honey-yellow: #FFB300;
  --heart-pink: #FF6B6B;
  --safe-green: #4CAF50;
  
  /* Plan Colors */
  --free-gray: #9E9E9E;
  --kids-blue: #2196F3;
  --friends-purple: #9C27B0;
  --premium-gold: #FFB300;
  
  /* System Colors */
  --error-red: #FF5252;
  --warning-yellow: #FFC107;
  --info-blue: #2196F3;
  --bg-cream: #FFF8E1;
  --text-main: #212121;
  --text-sub: #757575;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.16);
  --shadow-lg: 0 10px 20px rgba(0,0,0,0.19);
}
レスポンシブ設計
css/* Mobile First Approach */
.container {
  width: 100%;
  padding: 0 16px;
}

@media (min-width: 640px) {  /* Tablet */
  .container { max-width: 640px; }
}

@media (min-width: 768px) {  /* Small Desktop */
  .container { max-width: 768px; }
}

@media (min-width: 1024px) { /* Desktop */
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) { /* Large Desktop */
  .container { max-width: 1200px; }
}
UI状態とアニメーション
typescript// ローディング状態
const loadingStates = {
  thinking: {
    text: "まなびー先生が考えています...🐝",
    animation: "bee-flying 2s infinite"
  },
  sending: {
    text: "送信中...",
    animation: "pulse 1.5s infinite"
  },
  saving: {
    text: "保存中...",
    animation: "fade 1s infinite"
  }
};

// CSS アニメーション
const animations = `
  @keyframes bee-flying {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(10px, -5px) rotate(5deg); }
    50% { transform: translate(-10px, 5px) rotate(-5deg); }
    75% { transform: translate(5px, -10px) rotate(3deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

🔒 セキュリティ実装詳細
認証フロー
typescript// 保護者認証
const parentAuth = {
  registration: {
    passwordRules: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: true
    },
    emailVerification: true,
    captcha: true  // Phase 2
  },
  
  session: {
    duration: 7 * 24 * 60 * 60 * 1000,  // 7日間
    refreshToken: true,
    secureOnly: true
  }
};

// 子どもPIN認証
const childAuth = {
  pinRules: {
    length: 4,
    numeric: true,
    maxAttempts: 5,
    lockoutDuration: 300000  // 5分
  },
  
  session: {
    duration: 15 * 60 * 1000,  // 15分
    autoExtend: true,
    parentOverride: true
  }
};
データ暗号化
typescript// 個人情報の暗号化
import crypto from 'crypto';

class DataEncryption {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;
  
  constructor() {
    this.key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  }
  
  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }
  
  decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

📊 運用・監視体制
監視項目（Phase 1: 手動 → Phase 3: 自動）
yamlリアルタイム監視:
  - サービス稼働状態（5分間隔）
  - API応答時間
  - エラー率
  - 同時接続ユーザー数
  
日次監視:
  - API利用料金
  - 新規登録数
  - アクティブユーザー数
  - 安全性アラート件数
  
週次レビュー:
  - 利用傾向分析
  - コスト分析
  - ユーザーフィードバック
  - システム改善点
インシデント対応
yamlレベル1（Critical）:
  症状: サービス全体停止
  初動: 15分以内
  対応: 即座に復旧作業開始
  通知: 全ユーザーへメール
  
レベル2（High）:
  症状: 一部機能停止
  初動: 30分以内
  対応: 影響範囲特定→修正
  通知: 影響ユーザーのみ
  
レベル3（Medium）:
  症状: パフォーマンス低下
  初動: 1時間以内
  対応: 原因調査→最適化
  通知: ステータスページ更新
  
レベル4（Low）:
  症状: 軽微なバグ
  初動: 翌営業日
  対応: 次回リリースで修正
  通知: 不要

💡 将来の収益多様化戦略
Phase 3以降の追加収益源
yaml確度高:
  学習証明書PDF:
    価格: 300円/枚
    内容: 月間学習サマリー
    
  保護者向けセミナー:
    価格: 2,000円/回
    内容: AI活用子育て講座
    
  詳細分析レポート:
    価格: 500円/月
    内容: 学習傾向の詳細分析

確度中:
  B2B API提供:
    対象: 学習塾、学校
    価格: 要相談
    
  まなびーグッズ:
    商品: ステッカー、ノート
    価格: 300-1,000円
    
確度低:
  ネイティブアプリ:
    価格: 買い切り2,000円
    
  オフラインイベント:
    内容: まなびー教室

🚀 実装チェックリスト（MVP: Week 1-4）
Week 1: 基盤構築
markdown- [ ] Next.jsプロジェクト初期化
- [ ] Firebaseプロジェクト作成
- [ ] 環境変数設定
- [ ] 基本UIコンポーネント作成
- [ ] 法的ページ作成（利用規約等）
Week 2: 認証とプロファイル
markdown- [ ] Firebase Auth実装
- [ ] 保護者登録フロー
- [ ] 子どもプロファイル作成
- [ ] PIN認証実装
- [ ] セッション管理
Week 3: チャットとAI
markdown- [ ] OpenAI API連携
- [ ] チャット画面実装
- [ ] メッセージ送受信
- [ ] トークンカウンター
- [ ] 利用制限実装
Week 4: 安全性と仕上げ
markdown- [ ] NGワード検知
- [ ] 緊急通知システム
- [ ] API暴走対策
- [ ] エラーハンドリング
- [ ] 本番デプロイ
- [ ] 動作確認とテスト

📞 お問い合わせ・サポート
yaml開発・運営: AsamiWorks（浅見洋輔）
サポート: support@i-manabee.com
ドキュメント: https://docs.i-manabee.com
ステータス: https://status.i-manabee.com
GitHub: https://github.com/asamiworks/i-manabee
Instagram: @asamiworks
ハッシュタグ: #まなびー #あいまなびー

📝 更新履歴
markdown2025-09-24 v9.0.0
- 法的コンプライアンス追加（特商法、COPPA）
- API暴走対策・DDoS防御詳細化
- データバックアップ・災害対策追加
- 音声入力の同意管理追加
- 専門機関連携フロー追加
- Firebase制限対策明記
- トークンカウント統一システム追加
- セキュリティ実装詳細化
- 運用・監視体制追加
- 収益多様化戦略追加

⚖️ ライセンス
Copyright © 2025 AsamiWorks. All rights reserved.
本仕様書は機密情報を含みます。無断転載・複製を禁じます。