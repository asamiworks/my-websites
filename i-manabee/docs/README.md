# 📚 i-manabee ドキュメント索引

最終更新: 2025-10-07

---

## 🎯 はじめに

このディレクトリには、i-manabee プロジェクトの全ドキュメントが含まれています。

### ドキュメントの役割
- **DRY原則**: 同じ情報は1箇所にのみ記載
- **相互参照**: 各ドキュメントは必要に応じて他のドキュメントを参照
- **段階的開示**: 必要な情報だけを必要なタイミングで参照

---

## 📖 読む順序

### 🆕 初めての方

プロジェクト全体を理解するには、以下の順序で読んでください：

1. [完全仕様書](../i-manabee完全仕様書.md) - プロジェクト全体のビジョン
2. [MASTER_PLAN.md](./MASTER_PLAN.md) - 実装ロードマップ
3. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - デザインガイドライン

### 💻 実装担当者（Claude CODE）

**Phase 2.1（認証システム）を実装する場合**:
必読ドキュメント:

✅ DESIGN_SYSTEM.md
✅ TYPE_REFERENCE.md
✅ DIRECTORY_STRUCTURE.md
✅ phases/PHASE2-1_AUTH.md

参考資料:
5. 📚 reference/FIREBASE_SETUP.md（必要時）

**Phase 2.5（チャット拡張）を実装する場合**:
必読ドキュメント:

✅ DESIGN_SYSTEM.md
✅ TYPE_REFERENCE.md
✅ MESSAGE_TEMPLATES.md
✅ phases/PHASE2-5_CHAT.md


---

## 📁 ドキュメント構造
docs/
├── README.md                    # 👈 今ここ
├── MASTER_PLAN.md              # プロジェクトロードマップ
├── DESIGN_SYSTEM.md            # UI/UXガイドライン
├── TYPE_REFERENCE.md           # 型定義リファレンス
├── DIRECTORY_STRUCTURE.md      # ディレクトリ構造
├── MESSAGE_TEMPLATES.md        # メッセージ候補システム
├── PROGRESS.md                 # 実装進捗トラッカー
├── DEVLOG.md                   # 開発ログ
│
├── phases/                     # フェーズ別実装仕様
│   ├── PHASE1_MVP.md          # Phase 1（完了）
│   ├── PHASE2-1_AUTH.md       # Phase 2.1: 認証システム
│   ├── PHASE2-2_MYPAGE.md     # Phase 2.2: マイページ
│   ├── PHASE2-3_PAYMENT.md    # Phase 2.3: 決済システム
│   ├── PHASE2-4_USAGE.md      # Phase 2.4: 使用量管理
│   ├── PHASE2-5_CHAT.md       # Phase 2.5: チャット拡張
│   └── PHASE2-6_SAFETY.md     # Phase 2.6: 安全性システム
│
├── reference/                  # リファレンス資料
│   ├── FIREBASE_SETUP.md      # Firebase設定手順
│   ├── DEPLOYMENT.md          # デプロイ手順
│   ├── SECURITY.md            # セキュリティガイドライン
│   └── TESTING.md             # テスト戦略
│
└── archive/                    # 旧バージョン（参照のみ）

---

## 📚 各ドキュメントの詳細

### 🌟 コアドキュメント

#### [MASTER_PLAN.md](./MASTER_PLAN.md)
**役割**: プロジェクト全体のロードマップと実装計画  
**含む内容**:
- Phase 1〜4+の詳細タイムライン
- 各フェーズの依存関係
- 技術スタック
- マイルストーン定義
- リスクと対策

**参照元**: 完全仕様書「段階的実装計画」

---

#### [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
**役割**: 全フェーズ共通のUI/UXガイドライン  
**含む内容**:
- まなびー先生のキャラクター設計
- カラーパレット
- タイポグラフィ
- コンポーネント規則（Button, Card, Input等）
- アニメーション規則
- レスポンシブブレークポイント

**参照元**: 完全仕様書「UI/UXデザインシステム」

**参照先**: すべてのフェーズドキュメント

---

#### [TYPE_REFERENCE.md](./TYPE_REFERENCE.md)
**役割**: プロジェクト全体の型定義の一元管理  
**含む内容**:
- User, Child, Message等の基本型
- データベース型
- API型定義
- フロントエンド型定義

**参照元**: 完全仕様書「データベース設計」

**参照先**: すべてのフェーズドキュメント

**更新ルール**: 新しい型を追加するときは必ずこのファイルに記載

---

#### [DIRECTORY_STRUCTURE.md](./DIRECTORY_STRUCTURE.md)
**役割**: プロジェクトのディレクトリ構造とファイル配置規則  
**含む内容**:
- Phase別のディレクトリ構成
- ファイル命名規則
- インポート順序
- コンポーネント配置ルール

**参照元**: 完全仕様書「ディレクトリ構造（MVP版）」

---

#### [MESSAGE_TEMPLATES.md](./MESSAGE_TEMPLATES.md)
**役割**: 教科・年齢別のメッセージ候補の一元管理  
**含む内容**:
- 静的テンプレート（7教科 × 3年齢 = 84個）
- 動的ルール定義
- 実装ガイド

**参照タイミング**: Phase 2.5（チャット拡張）実装時

---

#### [PROGRESS.md](./PROGRESS.md)
**役割**: 現在の実装状況を記録  
**更新頻度**: 毎日〜週次

**含む内容**:
- 現在のフェーズ
- 完了タスク
- 進行中タスク
- 現在のメトリクス

---

### 📁 phases/ - フェーズ別実装仕様

各フェーズの詳細な実装手順を記載。Claude CODEが直接読んで実装できる形式。

#### [PHASE2-1_AUTH.md](./phases/PHASE2-1_AUTH.md)
**内容**: 認証システムの完全な実装仕様
- Firebase Auth設定
- ログイン/サインアップ画面
- 状態管理
- 保護されたルート
- 完全なコード例

#### [PHASE2-5_CHAT.md](./phases/PHASE2-5_CHAT.md)
**内容**: チャット機能拡張の実装仕様
- メッセージ候補UI
- 動的ルールベース提案
- MESSAGE_TEMPLATES.md連携

---

### 📁 reference/ - リファレンス資料

必要に応じて参照する技術資料。

#### [FIREBASE_SETUP.md](./reference/FIREBASE_SETUP.md)
Firebase初期設定の手順書

#### [DEPLOYMENT.md](./reference/DEPLOYMENT.md)
デプロイ手順とCI/CD設定

#### [SECURITY.md](./reference/SECURITY.md)
セキュリティガイドライン

#### [TESTING.md](./reference/TESTING.md)
テスト戦略とテストコード例

---

## 🔗 ドキュメント間の参照関係
完全仕様書（ルート）
↓ 詳細化
MASTER_PLAN ←→ DESIGN_SYSTEM ←→ TYPE_REFERENCE
↓              ↓               ↓
└──────────────┴───────────────┘
↓
MESSAGE_TEMPLATES
↓
PHASE2-1_AUTH
↓
PHASE2-2_MYPAGE
↓
[...]

**参照ルール**:
- ✅ **下位→上位の参照**: OK（PHASEドキュメント → DESIGN_SYSTEM）
- ❌ **上位→下位の参照**: NG（DESIGN_SYSTEM → PHASE2-1）
- ✅ **同レベルの参照**: OK（PHASE2-1 → PHASE2-2の前提確認）

---

## 🎯 クイックスタート

### Phase 2.1（認証システム）を実装する
```bash
# 1. 必要なドキュメントを確認
cat docs/DESIGN_SYSTEM.md
cat docs/TYPE_REFERENCE.md
cat docs/DIRECTORY_STRUCTURE.md
cat docs/phases/PHASE2-1_AUTH.md

# 2. Claude CODEに引き渡す
# 上記4つのドキュメントをClaude CODEに読ませて実装開始
Phase 2.5（チャット拡張）を実装する
bash# 1. 必要なドキュメントを確認
cat docs/DESIGN_SYSTEM.md
cat docs/TYPE_REFERENCE.md
cat docs/MESSAGE_TEMPLATES.md
cat docs/phases/PHASE2-5_CHAT.md

# 2. Claude CODEに引き渡す

📝 ドキュメント管理のルール
更新時のルール

Single Source of Truth: 同じ情報は1箇所にのみ記載
参照を明示: 他のドキュメントから情報を引用する場合は、必ず参照元を記載
バージョン管理: 大きな変更の前は docs/archive/ にバックアップ
日付記載: 各ドキュメントの冒頭に「最終更新日」を記載

新しい型を追加する場合
typescript// ❌ 悪い例: フェーズドキュメントに直接記載
// phases/PHASE2-X.md
interface NewType {
  // ...
}

// ✅ 良い例: TYPE_REFERENCE.mdに記載
// TYPE_REFERENCE.md
interface NewType {
  // ...
}

// phases/PHASE2-X.md
// 型定義は TYPE_REFERENCE.md を参照

🔍 トラブルシューティング
ドキュメントが見つからない
bash# ドキュメント構造を確認
ls -R docs/

# 特定のキーワードで検索
grep -r "検索キーワード" docs/
参照先がわからない
各ドキュメントの冒頭に「前提ドキュメント」セクションがあります。

📞 サポート

開発者: AsamiWorks（浅見洋輔）
プロジェクト: i-manabee
ドキュメント管理: このREADME.mdを起点にナビゲート


次のアクション: MASTER_PLAN.md を読んで、プロジェクト全体のロードマップを理解しましょう！

---
