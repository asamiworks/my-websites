# YouthWorks 開発仕様書
最終更新: 2025-01-21 20:00

## プロジェクト概要
- **サービス名**: YouthWorks (youth-works.com)
- **目的**: 6-12歳向けの安心して使える学習AI
- **開始日**: 2025-01-20
- **開発者**: AsamiWorks
- **現在のステータス**: MVP開発中（UI実装完了、API接続待ち）
- **開発環境**: C:\Users\洋輔\Documents\GitHub\my-websites\youth-works

## ビジネスモデル
### 料金プラン
| プラン | 料金 | 利用制限 | AI | 機能 |
|--------|------|----------|-----|------|
| 無料 | 0円 | 1日10回 | OpenAI GPT-3.5-turbo | 単一チャット |
| プレミアム | 500円/月 | 無制限 | Claude 3 Haiku | 科目別ルーム、悩み相談 |

### コスト試算（更新版）
- 無料ユーザー: 約9円/月（GPT-3.5使用）
- プレミアムユーザー: 約180円/月（Claude Haiku使用、利益320円）
- 損益分岐点: 15%の課金率
- 1000人で黒字化（150人課金で月75,000円）

## 技術スタック
| カテゴリ | 技術 | 状態 |
|----------|------|------|
| Frontend | HTML/CSS/JavaScript (Vanilla) | ✅ |
| Backend | Node.js + Express | ✅ |
| AI (Free) | OpenAI GPT-3.5-turbo | 🔄 |
| AI (Premium) | Claude 3 Haiku | 🔄 |
| Database | Firebase Firestore | 🔄 |
| Auth | Firebase Auth | 🔄 |
| Hosting | Firebase Hosting (予定) | ⬜ |
| Payment | Stripe | ⬜ |

## ディレクトリ構造（更新版）
```
youth-works/
├── 📄 HTML Files
│   ├── index.html          # ログイン画面
│   ├── chat.html           # 単一チャット（無料プラン）
│   ├── chat-select.html    # ルーム選択（プレミアム）※旧room-select
│   ├── chat-room.html      # 科目別チャット（プレミアム）
│   └── parent.html         # 保護者管理画面（未実装）
├── 🎨 CSS Files
│   ├── css/style.css       # 基本スタイル
│   ├── css/chat.css        # チャット画面（アイコンボタン対応）
│   ├── css/room-select.css # ルーム選択
│   └── css/chat-room.css   # 科目別チャット（アイコンボタン対応）
├── 📜 JavaScript Files
│   ├── js/app.js           # ログイン処理
│   ├── js/firebase-config.js # Firebase設定
│   ├── js/chat.js          # 単一チャット制御（OpenAI連携）
│   ├── js/room-select.js   # ルーム選択制御
│   └── js/chat-room.js     # 科目別チャット制御（Claude連携）
├── 🔧 Server Files
│   ├── server.js           # Expressメインサーバー
│   └── api/
│       ├── claude.js       # Claude API処理
│       └── openai.js       # OpenAI API処理
└── ⚙️ Config Files
    ├── package.json        # 依存関係
    ├── .env.local          # 環境変数（要作成）
    ├── .gitignore          # Git除外設定
    ├── PROJECT.md          # このファイル
    └── DEVLOG.md           # 開発ログ
```

## 機能実装状況

### ✅ 実装済み
- [x] ログイン/新規登録画面
- [x] プラン別振り分け（ローカルストレージ判定）
- [x] 無料プラン用単一チャット（UI）
- [x] プレミアム用ルーム選択画面
- [x] 科目別チャットルーム（8種類）
- [x] メッセージ送受信（UI完成）
- [x] 使用回数カウント（ローカル）
- [x] レスポンシブデザイン
- [x] 思考中インジケーター
- [x] クイックヒント機能
- [x] 年齢別UI（6-8歳、9-12歳）
- [x] 送信ボタンのアイコン化（紙飛行機）
- [x] APIキー取得と設定
- [x] 本番環境でのAPI接続テスト
- [x] Claude API接続（Haiku）
- [x] OpenAI API接続（GPT-3.5）

### 🔄 開発中
- [ ] Firebase Auth実装
- [ ] Firestore保存

### ⬜ 未実装（優先順位順）
1. **高優先度**
   - [ ] 使用制限機能（1日10回）

2. **中優先度**
   - [ ] 保護者管理画面
   - [ ] 悩み相談アラート機能
   - [ ] メール通知

3. **低優先度**
   - [ ] Stripe決済統合
   - [ ] 学習履歴詳細
   - [ ] 音声入出力

## 科目別ルーム設定（年齢対応）
| アイコン | ルーム名（9-12歳） | ルーム名（6-8歳） | 特記事項 |
|---------|-------------------|------------------|----------|
| 📐/🔢 | 算数・数学 | さんすう | 年齢別アイコン |
| 🌍 | 英語 | えいご | - |
| 📖 | 国語 | こくご | - |
| 🔬 | 理科 | りか | - |
| 🗺️ | 社会 | しゃかい | - |
| 💭 | 悩み相談 | そうだん | 保護者通知 |
| 📝 | 宿題ヘルプ | しゅくだい | - |
| 💬 | フリートーク | おはなし | - |

## 環境変数設定（.env.local）
```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# AI APIs
CLAUDE_API_KEY=sk-ant-api03-xxxxx
OPENAI_API_KEY=sk-xxxxx

# Environment
NODE_ENV=development
PORT=3000
```

## API仕様詳細
### Claude API (Premium)
- **モデル**: claude-3-haiku-20240307
- **max_tokens**: 1000
- **料金**: $0.25/$1.25 per 1M tokens
- **用途**: プレミアムプラン全機能

### OpenAI API (Free)
- **モデル**: gpt-3.5-turbo
- **max_tokens**: 500
- **料金**: $0.5/$1.5 per 1M tokens
- **用途**: 無料プラン（1日5回制限）

## 年齢別対応詳細
### 6-8歳向け
- ひらがな多用
- 大きめのフォントサイズ（1.1rem）
- シンプルな言葉遣い
- 絵文字を多く使用
- 励ましの言葉を頻繁に

### 9-12歳向け
- 漢字使用（ルビなし）
- 標準フォントサイズ（1rem）
- より詳細な説明
- 論理的な説明を含む

## テスト手順
### プラン別テスト
- 無料プラン: test@example.com でログイン
- プレミアム: premium@test.com でログイン

### 機能テスト
1. ログイン機能（年齢選択含む）
2. チャット送受信（アイコンボタン）
3. ルーム切り替え（プレミアムのみ）
4. レスポンシブ確認（スマホ/タブレット/PC）
5. 年齢別UI切り替え

## デプロイ計画
- **Phase 1**: ローカル開発（完了）
- **Phase 2**: Firebase設定とAPI接続（現在）
- **Phase 3**: テスト環境デプロイ
- **Phase 4**: 本番環境リリース

## セキュリティ考慮事項
- APIキーはサーバー側で管理（環境変数）
- 子どもの個人情報は最小限
- 悩み相談は保護者通知機能必須
- HTTPS必須
- レート制限実装（1分100リクエスト）
- Firebase認証トークン検証

## 今後の拡張案
- 音声入力/出力（Web Speech API）
- 学習レポート機能（PDF生成）
- グループ学習機能
- 学校向けB2Bプラン
- 保護者向けアプリ

## 既知の問題
- サーバー起動時にCORS設定必要
- モバイルSafariでのtextarea自動リサイズ
- Firebase設定前はダミーデータ使用

## 連絡先・リンク
- 開発者: AsamiWorks
- サイト: youth-works.com（予定）
- リポジトリ: [プライベート]
- APIドキュメント: 内部Wiki参照