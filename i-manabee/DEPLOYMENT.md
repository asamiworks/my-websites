# i-manabee デプロイメントガイド

## 概要

このドキュメントでは、i-manabee AI学習プラットフォームのデプロイメント手順と設定について説明します。

## 環境構成

### ステージング環境
- **Firebase Project**: `i-manabee-staging`
- **URL**: `https://staging.i-manabee.com`
- **用途**: 開発・テスト環境

### 本番環境
- **Firebase Project**: `i-manabee`
- **URL**: `https://i-manabee.com`
- **用途**: 本番運用環境

## 事前準備

### 1. Firebase プロジェクトの作成

```bash
# Firebase CLI のインストール
npm install -g firebase-tools

# Firebase ログイン
firebase login

# プロジェクトの初期化
firebase init
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の変数を設定：

```env
# Firebase設定
NEXT_PUBLIC_FIREBASE_PROJECT_ID=i-manabee
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=i-manabee.firebaseapp.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key

# Firebase Admin SDK
FIREBASE_PROJECT_ID=i-manabee
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@i-manabee.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# その他の設定
NODE_ENV=production
SESSION_SECRET=your_session_secret
```

### 3. GitHub Secrets の設定

GitHub リポジトリの Settings > Secrets で以下を設定：

```
FIREBASE_TOKEN=your_firebase_ci_token
FIREBASE_PROJECT_ID=i-manabee
FIREBASE_AUTH_DOMAIN=i-manabee.firebaseapp.com
FIREBASE_API_KEY=your_firebase_api_key
OPENAI_API_KEY=your_openai_api_key
SLACK_WEBHOOK_URL=your_slack_webhook_url
ADMIN_EMAIL=admin@i-manabee.com
CODECOV_TOKEN=your_codecov_token
```

## デプロイメント手順

### 1. 手動デプロイ

#### ステージング環境

```bash
# 依存関係のインストール
npm ci

# TypeScript チェック
npm run typecheck

# テスト実行
npm run test

# ビルド
npm run build

# ステージングにデプロイ
npm run deploy:staging
```

#### 本番環境

```bash
# 本番ビルド
NODE_ENV=production npm run build

# 本番デプロイ
npm run deploy:prod
```

### 2. 自動デプロイ（CI/CD）

#### ステージング環境（develop ブランチ）
- `develop` ブランチにプッシュすると自動的にステージング環境にデプロイ
- Lighthouseパフォーマンス監査が実行される

#### 本番環境（main ブランチ）
- `main` ブランチにプッシュすると自動的に本番環境にデプロイ
- より厳格なテストとセキュリティチェックが実行される

## ビルドプロセス

### 1. 静的最適化
- Next.js の静的エクスポート機能を使用
- Firebase Hosting 向けに最適化された静的ファイルを生成

### 2. セキュリティ設定
- セキュリティヘッダーの自動付与
- CSP（Content Security Policy）の適用
- HTTPS 強制リダイレクト

### 3. パフォーマンス最適化
- コード分割による読み込み速度向上
- 画像最適化
- キャッシュ戦略の実装

## 監視とログ

### 1. ヘルスチェック
- `/api/health` エンドポイントでシステム状態を確認
- データベース、認証、外部API の接続状態を監視

### 2. パフォーマンス監視
- Firebase Performance Monitoring
- Core Web Vitals の測定
- カスタムメトリクスの収集

### 3. エラー監視
- グローバルエラーハンドリング
- エラー分類と自動通知
- ユーザーフレンドリーなエラー表示

### 4. セキュリティ監視
- 不正アクセスの検出
- レート制限の監視
- NGワード検知ログ

## トラブルシューティング

### 1. デプロイ失敗時の対処

```bash
# ビルドログの確認
npm run build 2>&1 | tee build.log

# Firebase デバッグモード
firebase deploy --debug

# ロールバック
firebase hosting:rollback
```

### 2. パフォーマンス問題

```bash
# バンドル解析
ANALYZE=true npm run build

# Lighthouse 監査
npm install -g lighthouse
lighthouse https://i-manabee.com --output json --output-path ./lighthouse-report.json
```

### 3. セキュリティ問題

```bash
# 依存関係の脆弱性チェック
npm audit

# セキュリティヘッダーの確認
curl -I https://i-manabee.com
```

## 本番環境の設定確認

### 1. Firebase Console での確認項目
- [ ] Firestore セキュリティルールの適用
- [ ] Storage セキュリティルールの適用
- [ ] Authentication 設定の確認
- [ ] Performance Monitoring の有効化
- [ ] Analytics の設定

### 2. セキュリティ設定の確認
- [ ] CSP ヘッダーの適用
- [ ] HTTPS 強制の確認
- [ ] セキュリティヘッダーの確認
- [ ] レート制限の動作確認

### 3. パフォーマンステスト
- [ ] Lighthouse スコア（Performance: 80+）
- [ ] Core Web Vitals の確認
- [ ] モバイル対応の確認
- [ ] アクセシビリティスコア（90+）

## バックアップとリカバリ

### 1. データベースバックアップ
```bash
# Firestore エクスポート
gcloud firestore export gs://i-manabee-backup/$(date +%Y%m%d)
```

### 2. 設定ファイルのバックアップ
- Firebase プロジェクト設定
- 環境変数の設定
- DNS 設定

### 3. リカバリ手順
1. バックアップからデータ復旧
2. 設定ファイルの復元
3. デプロイの再実行
4. 動作確認

## メンテナンス

### 1. 定期的な更新
- 依存関係の更新（月次）
- セキュリティパッチの適用（随時）
- パフォーマンス改善（随時）

### 2. 監視項目
- システム稼働率（99.9% 以上を目標）
- 応答速度（2秒以内を目標）
- エラー率（1% 以下を目標）

### 3. スケーリング
- Firebase の使用量監視
- コスト最適化
- キャッシュ戦略の見直し

## 緊急時対応

### 1. 障害対応手順
1. 障害の検知と分類
2. 影響範囲の特定
3. 一時的な回避策の実施
4. 根本原因の調査
5. 恒久対策の実施

### 2. 連絡体制
- 開発チーム: 技術的対応
- 運営チーム: ユーザー対応
- 管理者: 意思決定

### 3. 通信手段
- Slack: リアルタイム連絡
- メール: 正式な報告
- 電話: 緊急時の連絡

このガイドに従って、安全で安定したデプロイメントを実現してください。