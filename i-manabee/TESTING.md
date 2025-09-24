# i-manabee テスト戦略とガイド

## 概要

i-manabee AI学習プラットフォームの品質保証のための包括的なテスト戦略とガイドラインを説明します。

## テスト戦略

### テストピラミッド
1. **Unit Tests (単体テスト)** - 70%
2. **Integration Tests (統合テスト)** - 20%
3. **E2E Tests (エンドツーエンドテスト)** - 10%

### テスト環境
- **開発環境**: ローカル開発での単体テスト
- **ステージング環境**: 統合テストとE2Eテスト
- **本番環境**: スモークテストとモニタリング

## 単体テスト (Unit Tests)

### 対象コンポーネント

#### 1. ユーティリティ関数
```bash
# NGワードフィルターのテスト
npm test -- --testPathPattern=ngWordFilter.test.ts

# トークン計算のテスト
npm test -- --testPathPattern=tokenCounter.test.ts

# 年齢判定のテスト
npm test -- --testPathPattern=ageValidation.test.ts
```

#### 2. Reactコンポーネント
```bash
# UIコンポーネントのテスト
npm test -- --testPathPattern=components/ui

# チャットコンポーネントのテスト
npm test -- --testPathPattern=components/chat

# 認証コンポーネントのテスト
npm test -- --testPathPattern=components/auth
```

#### 3. カスタムフック
```bash
# useAuthフックのテスト
npm test -- --testPathPattern=hooks/useAuth.test.ts

# useSessionフックのテスト
npm test -- --testPathPattern=hooks/useSession.test.ts
```

### テスト実行
```bash
# 全単体テストの実行
npm run test

# ウォッチモード（開発時）
npm run test:watch

# カバレッジレポート
npm run test:coverage
```

### カバレッジ目標
- **総合カバレッジ**: 80% 以上
- **関数カバレッジ**: 85% 以上
- **ブランチカバレッジ**: 75% 以上
- **ライン カバレッジ**: 80% 以上

## 統合テスト (Integration Tests)

### 対象システム

#### 1. API エンドポイント
```bash
# 認証API のテスト
npm test -- --testPathPattern=api/auth.integration.test.ts

# チャットAPI のテスト
npm test -- --testPathPattern=api/chat.integration.test.ts

# ヘルスチェックAPI のテスト
npm test -- --testPathPattern=api/health.integration.test.ts
```

#### 2. データベース統合
```bash
# Firestore 統合テスト
npm test -- --testPathPattern=database.integration.test.ts

# Firebase Auth 統合テスト
npm test -- --testPathPattern=auth.integration.test.ts
```

#### 3. 外部サービス統合
```bash
# OpenAI API 統合テスト
npm test -- --testPathPattern=openai.integration.test.ts

# メール送信統合テスト
npm test -- --testPathPattern=email.integration.test.ts
```

### テスト環境設定
```bash
# Firebase エミュレータの起動
firebase emulators:start

# テスト用データベースの初期化
npm run test:db:init

# 統合テストの実行
npm run test:integration
```

## E2Eテスト (End-to-End Tests)

### テストシナリオ

#### 1. ユーザー登録・認証フロー
- 保護者アカウント登録
- メール認証
- 子どもプロファイル作成
- PIN認証設定
- ログイン/ログアウト

#### 2. チャット機能フロー
- チャット開始
- メッセージ送信
- AI応答の確認
- NGワード検知
- チャット履歴保存

#### 3. 安全性機能フロー
- 不適切コンテンツの検知
- 緊急通知の発動
- 保護者への通知
- セッション管理

### E2Eテスト実行
```bash
# Playwright E2Eテスト
npx playwright test

# 特定のテストスイート
npx playwright test --grep "authentication"
npx playwright test --grep "chat"
npx playwright test --grep "safety"

# ヘッドレスモード
npx playwright test --headed

# デバッグモード
npx playwright test --debug
```

## パフォーマンステスト

### 1. ロードテスト
```bash
# K6 を使用したロードテスト
k6 run tests/load/api-load.js

# 同時接続数のテスト
k6 run --vus 100 --duration 60s tests/load/concurrent-users.js
```

### 2. Lighthouseテスト
```bash
# パフォーマンス監査
npm run lighthouse:audit

# モバイルパフォーマンス
lighthouse https://staging.i-manabee.com --preset=perf --view --chrome-flags="--headless"
```

### パフォーマンス目標
- **Lighthouse Performance**: 80点以上
- **First Contentful Paint**: 1.8秒以下
- **Largest Contentful Paint**: 2.5秒以下
- **First Input Delay**: 100ms以下
- **Cumulative Layout Shift**: 0.1以下

## セキュリティテスト

### 1. 脆弱性スキャン
```bash
# 依存関係の脆弱性チェック
npm audit

# セキュリティ問題の修正
npm audit fix

# 高度な脆弱性スキャン
npm install -g @snyk/cli
snyk test
```

### 2. ペネトレーションテスト
```bash
# OWASP ZAP を使用した自動スキャン
docker run -v $(pwd):/zap/wrk/:rw -t owasp/zap2docker-stable zap-full-scan.py -t https://staging.i-manabee.com
```

### セキュリティチェックリスト
- [ ] HTTPS強制
- [ ] セキュリティヘッダー適用
- [ ] CSP設定
- [ ] 認証・認可の確認
- [ ] 入力値検証
- [ ] SQLインジェクション対策
- [ ] XSS対策
- [ ] CSRF対策

## アクセシビリティテスト

### 1. 自動化テスト
```bash
# axe-core を使用したアクセシビリティテスト
npm test -- --testPathPattern=accessibility.test.ts

# Lighthouse アクセシビリティ監査
lighthouse https://staging.i-manabee.com --only-categories=accessibility
```

### 2. 手動テスト
- スクリーンリーダー対応
- キーボードナビゲーション
- 色のコントラスト
- フォーカス管理

### アクセシビリティ目標
- **WCAG 2.1 AA準拠**
- **Lighthouse Accessibility**: 90点以上
- **キーボード操作**: 100%対応

## テスト自動化

### GitHub Actions ワークフロー

```yaml
# .github/workflows/test.yml で自動実行
- 単体テスト: 全PR・全プッシュ
- 統合テスト: develop・mainブランチ
- E2Eテスト: ステージングデプロイ後
- パフォーマンステスト: 週次実行
- セキュリティテスト: 日次実行
```

### 継続的品質管理
- **コードカバレッジ**: Codecovで追跡
- **品質ゲート**: SonarQubeで管理
- **パフォーマンス**: Lighthouseで監視

## テストデータ管理

### 1. テストデータ準備
```bash
# テストデータベースの初期化
npm run test:db:seed

# モックデータの生成
npm run test:data:generate

# テスト用ファイルのアップロード
npm run test:files:upload
```

### 2. テスト環境クリーンアップ
```bash
# テスト後のデータ削除
npm run test:cleanup

# キャッシュのクリア
npm run test:cache:clear
```

## バグレポートとテスト結果

### 1. テスト結果の保存
```bash
# JUnit形式でのテスト結果出力
npm test -- --reporter=junit --outputFile=test-results.xml

# カバレッジレポートの生成
npm run test:coverage -- --reporter=lcov
```

### 2. CI/CDでのテスト結果処理
- テスト失敗時の自動通知
- カバレッジ低下の警告
- パフォーマンス回帰の検知

## テスト環境の要件

### 開発環境
- Node.js 18.x以上
- Firebase Emulator Suite
- Chrome/Chromium（E2Eテスト用）

### CI環境
- GitHub Actions Ubuntu runner
- Firebase エミュレータ
- Playwright browsers

### データベース
- Firestore エミュレータ（開発・テスト）
- 本番データベース（統合テストのみ）

## トラブルシューティング

### 1. テスト失敗の原因調査
```bash
# 詳細なテストログ
npm test -- --verbose

# 失敗したテストのみ再実行
npm test -- --onlyFailures

# テストタイムアウトの延長
npm test -- --testTimeout=10000
```

### 2. パフォーマンステストの問題
```bash
# メモリ使用量の監視
node --inspect-brk node_modules/.bin/jest

# CPU プロファイリング
node --prof node_modules/.bin/jest
```

### 3. E2Eテストの不安定性対策
```bash
# リトライ設定
npx playwright test --retries=3

# 待機時間の調整
npx playwright test --timeout=60000

# ヘッドフルモードでのデバッグ
npx playwright test --headed --slowMo=1000
```

## ベストプラクティス

### 1. テストの作成
- **AAA パターン** (Arrange, Act, Assert) の使用
- **単一責任の原則** に従った小さなテスト
- **可読性** の高いテスト名とコメント

### 2. テストデータ
- **独立性** を保ったテストデータ
- **再現可能** な環境の構築
- **セキュア** なテストデータの管理

### 3. CI/CDとの統合
- **高速** なフィードバックループ
- **自動化** された品質チェック
- **視覚的** なレポーティング

このテスト戦略により、i-manabeeプラットフォームの品質と安定性を確保します。