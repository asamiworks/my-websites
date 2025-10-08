📋 プロジェクト概要（段階的追記用）
markdown# i-manabee - 子どもの学びを支える対話型学習プラットフォーム

## 🎯 プロジェクトフェーズ

### ✅ Phase 1: MVP版（現在）
- **インフラ**: Firebase (Hosting, Firestore, Functions)
- **フロント**: Next.js 14 (App Router)
- **認証**: Firebase Auth
- **決済**: Stripe
- **対象**: 個人ユーザー（100-1,000人規模）

### 🔄 Phase 2: 拡張版（売上達成後 3-6ヶ月）
<!-- TODO: 月間売上50万円達成後に以下を追記
- **インフラ**: Firebase + Cloud Run
- **バックエンド**: NestJS導入
- **データベース**: PostgreSQL追加
- **キャッシュ**: Redis導入
- **対象**: 1,000-10,000人規模
-->

### 🚀 Phase 3: Scale版（6-12ヶ月）
<!-- TODO: 月間売上200万円達成後に以下を追記
- **インフラ**: Kubernetes (GKE)移行開始
- **マイクロサービス**: 段階的分離開始
- **API Gateway**: 実装
- **監視**: Datadog導入
- **対象**: 10,000-50,000人規模
-->

### 🏢 Phase 4: Enterprise版（12ヶ月〜）
<!-- TODO: 月間売上500万円達成後に以下を追記
- **アーキテクチャ**: 完全マイクロサービス化
- **グローバル**: マルチリージョン展開
- **B2B**: API商品化
- **ML**: カスタムモデル実装
- **対象**: 50,000人以上
-->

## 🏗️ アーキテクチャ進化

### 現在のアーキテクチャ（MVP）
[Next.js App] → [Firebase] → [Firestore]
↓
[Stripe]

<!-- Phase 2で追記
### 拡張版アーキテクチャ
[Next.js App] → [API Layer] → [Firebase/PostgreSQL]
↓              ↓
[Cloud Run]     [Redis Cache]
↓
[Stripe]
-->

<!-- Phase 3で追記
### スケール版アーキテクチャ
[Next.js App] → [API Gateway] → [Microservices]
↓               ↓
[Load Balancer]   [Message Queue]
↓               ↓
[Kubernetes]     [BigQuery]
-->

## 📁 ディレクトリ構造の進化

### MVP版（現在）
i-manabee/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # UIコンポーネント
│   ├── lib/          # ユーティリティ
│   └── styles/       # スタイル
├── public/
└── package.json

<!-- Phase 2で追記
### 拡張版構造
i-manabee/
├── apps/
│   └── web/          # 既存のNext.jsアプリ
├── packages/
│   ├── ui/           # 共通UIコンポーネント
│   └── utils/        # 共通ユーティリティ
└── services/
└── api/          # NestJS API
-->

## 🔄 移行チェックリスト

### MVP → 拡張版
- [ ] 月間売上50万円達成
- [ ] ユーザー数1,000人突破
- [ ] パフォーマンスボトルネック顕在化
<!-- 達成時に以下を有効化
- [ ] モノレポ化（Turborepo導入）
- [ ] API層分離
- [ ] PostgreSQL導入
- [ ] Redis実装
- [ ] CI/CD強化
-->

### 拡張版 → Scale版
<!-- TODO: 条件達成時に追記
- [ ] 月間売上200万円達成
- [ ] ユーザー数10,000人突破
- [ ] B2B需要確認
-->

## 📊 メトリクス管理

### 現在追跡中
- ユーザー数: XXX人
- MAU: XXX人
- 売上: XXX円/月
- チャーン率: XX%

<!-- Phase 2で追記
### 技術メトリクス
- API応答時間: XXXms
- エラー率: XX%
- 可用性: XX.X%
-->

## 🚦 移行トリガー

| フェーズ | 売上 | ユーザー数 | 技術的トリガー |
|---------|------|------------|----------------|
| MVP→拡張 | 50万円/月 | 1,000人 | Firebaseの制限に近づく |
| 拡張→Scale | 200万円/月 | 10,000人 | モノリスの限界 |
| Scale→Enterprise | 500万円/月 | 50,000人 | B2B需要 |

## 📝 技術的負債管理

### MVP版で許容する負債
- モノリシック構造
- 手動デプロイ
- 基本的なエラーハンドリング
- シンプルなキャッシュ戦略

<!-- 各フェーズで解消する負債を追記 -->

## 🔗 リポジトリ構成

### 現在
- `i-manabee` - メインリポジトリ

<!-- Phase 2以降で追記
### 将来
- `i-manabee` - モノレポ（すべて統合）
- `i-manabee-infra` - インフラ設定
- `i-manabee-ml` - 機械学習モデル
-->

---
*最終更新: 2024年XX月XX日*
*次回レビュー: 売上50万円達成時*