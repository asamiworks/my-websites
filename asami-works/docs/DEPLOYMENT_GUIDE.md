# 請求書管理システム デプロイメントガイド

## 概要

このガイドは、AsamiWorks請求書管理システムを本番環境にデプロイするための手順を説明します。

## 前提条件

- Node.js 18以上
- npm または yarn
- Firebaseプロジェクト
- Google Cloud Platform アカウント
- Google Drive API アクセス

## 1. Firebase プロジェクトの設定

### 1.1 プロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `asamiworks-invoice-system`）
4. Google Analytics を設定（オプション）

### 1.2 認証の設定

1. Firebase Console で「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブで必要な認証方法を有効化：
   - Email/Password
   - Google（推奨）

### 1.3 Firestore の設定

1. Firebase Console で「Firestore Database」を選択
2. 「データベースの作成」をクリック
3. セキュリティルールを「本番モード」で開始
4. ロケーションを選択（asia-northeast1 推奨）

### 1.4 セキュリティルールの設定

Firestore のセキュリティルールを以下に更新：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 管理者のみアクセス可能
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.admin == true;
    }

    function isAdminByEmail() {
      return request.auth != null &&
             request.auth.token.email in [
               'admin@asami-works.com',
               'info@asami-works.com'
             ];
    }

    function isAuthorized() {
      return isAdmin() || isAdminByEmail();
    }

    match /{document=**} {
      allow read, write: if isAuthorized();
    }
  }
}
```

## 2. Google Cloud Platform の設定

### 2.1 サービスアカウントの作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 適切なプロジェクトを選択
3. 「IAM と管理」→「サービス アカウント」を選択
4. 「サービス アカウントを作成」をクリック
5. 必要な情報を入力：
   - 名前: `invoice-system-service`
   - 説明: `Invoice System Service Account`

### 2.2 権限の設定

作成したサービスアカウントに以下の権限を付与：
- Firebase Admin SDK Administrator Service Agent
- Cloud Datastore User

### 2.3 キーの生成

1. 作成したサービスアカウントをクリック
2. 「キー」タブを選択
3. 「キーを追加」→「新しいキーを作成」
4. JSON形式を選択してダウンロード

## 3. Google Drive API の設定

### 3.1 APIの有効化

1. Google Cloud Console で「APIとサービス」→「ライブラリ」を選択
2. 「Google Drive API」を検索
3. 「有効にする」をクリック

### 3.2 フォルダの準備

1. Google Drive で請求書保存用のフォルダを作成
2. フォルダを右クリック→「共有」
3. サービスアカウントのメールアドレスを追加
4. 権限を「編集者」に設定
5. フォルダIDをメモ（URLの最後の部分）

## 4. 環境変数の設定

### 4.1 本番環境用の環境変数

`.env.production` ファイルを作成：

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-production-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# Google Drive Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=your-root-folder-id

# Security
NEXTAUTH_SECRET=your-secure-random-string
NEXTAUTH_URL=https://your-domain.com

# Optional: Email notifications
GMAIL_USER=your-notification-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### 4.2 環境変数の検証

デプロイ前に環境変数をテスト：

```bash
# 環境変数チェックスクリプト
npm run check-env
```

## 5. アプリケーションのビルド

### 5.1 依存関係のインストール

```bash
npm install --production
```

### 5.2 ビルドの実行

```bash
npm run build
```

### 5.3 ビルドの検証

```bash
npm run start
```

## 6. Firebase Functions のデプロイ

### 6.1 Firebase CLI のインストール

```bash
npm install -g firebase-tools
```

### 6.2 Firebase にログイン

```bash
firebase login
```

### 6.3 プロジェクトの初期化

```bash
firebase init
```

選択項目：
- Functions: Configure and deploy Cloud Functions
- Hosting: Configure and deploy Firebase Hosting sites
- Firestore: Deploy rules and create indexes for Firestore

### 6.4 Functions の設定

`functions/package.json` の確認：

```json
{
  "name": "functions",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^11.0.0",
    "firebase-functions": "^4.0.0"
  }
}
```

### 6.5 環境変数の設定

```bash
# Firebase Functions の環境変数設定
firebase functions:config:set \
  firebase.project_id="your-project-id" \
  firebase.private_key="your-private-key" \
  firebase.client_email="your-service-account-email"

firebase functions:config:set \
  google.service_account_email="your-service-account-email" \
  google.private_key="your-private-key" \
  google.drive_folder_id="your-folder-id"
```

### 6.6 Functions のデプロイ

```bash
cd functions
npm run deploy
```

## 7. Hosting のデプロイ

### 7.1 Next.js のスタティックエクスポート

`next.config.js` を設定：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
```

### 7.2 ビルドとエクスポート

```bash
npm run build
```

### 7.3 Firebase Hosting の設定

`firebase.json` を設定：

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/clients/**",
        "function": "clientApi"
      },
      {
        "source": "/api/invoices/**",
        "function": "invoiceApi"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 7.4 Hosting のデプロイ

```bash
firebase deploy --only hosting
```

## 8. ドメインの設定

### 8.1 カスタムドメインの追加

1. Firebase Console で「Hosting」を選択
2. 「カスタム ドメインを追加」をクリック
3. ドメイン名を入力（例: `invoice.asami-works.com`）
4. DNS設定の指示に従う

### 8.2 SSL証明書の設定

Firebase Hosting は自動的にSSL証明書を提供します。

## 9. モニタリングとログ

### 9.1 Firebase Performance Monitoring

```javascript
// main app file
import { getPerformance } from 'firebase/performance';

const perf = getPerformance(app);
```

### 9.2 Error Reporting

```javascript
// error boundary での使用
import { getFunctions, httpsCallable } from 'firebase/functions';

const reportError = httpsCallable(functions, 'reportError');
```

### 9.3 ログの確認方法

```bash
# Functions のログ
firebase functions:log

# 特定の関数のログ
firebase functions:log --only invoiceApi
```

## 10. バックアップとリストア

### 10.1 Firestore のバックアップ

```bash
# 自動バックアップの設定
gcloud firestore databases create --type=firestore-native --location=your-location
gcloud alpha firestore backups schedules create \
  --database=your-database \
  --retention=14d \
  --recurrence=daily
```

### 10.2 手動バックアップ

```bash
# データのエクスポート
gcloud firestore export gs://your-backup-bucket
```

## 11. セキュリティ設定

### 11.1 Firebase Security Rules のテスト

```bash
firebase emulators:start --only firestore
npm run test:security-rules
```

### 11.2 API レート制限

Functions での制限：

```javascript
// functions/src/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: 'Too many requests from this IP'
});
```

## 12. デプロイ後の確認

### 12.1 機能テスト

1. 認証機能の確認
2. クライアント管理機能の確認
3. 請求書生成機能の確認
4. PDF生成とGoogle Drive保存の確認

### 12.2 パフォーマンステスト

```bash
# Lighthouse での測定
npm install -g lighthouse
lighthouse https://your-domain.com --output html --output-path ./lighthouse-report.html
```

### 12.3 ヘルスチェック

```bash
# API エンドポイントの確認
curl -f https://your-domain.com/api/health || exit 1
```

## 13. 運用・保守

### 13.1 定期的なタスク

- **日次**: ログの確認とエラー監視
- **週次**: パフォーマンス指標の確認
- **月次**: セキュリティアップデートの適用

### 13.2 アップデート手順

```bash
# 1. バックアップの作成
npm run backup

# 2. ステージング環境でのテスト
npm run test:staging

# 3. 本番環境へのデプロイ
npm run deploy:production

# 4. デプロイ後の確認
npm run health-check
```

### 13.3 ロールバック手順

```bash
# 前のバージョンへのロールバック
firebase hosting:channel:deploy --expires 1h rollback
firebase functions:delete newFunction
firebase deploy --only functions
```

## トラブルシューティング

### よくある問題

1. **Functions のタイムアウト**
   - 解決: Function の timeout 設定を増加
   ```javascript
   exports.generateInvoices = functions
     .runWith({ timeoutSeconds: 540, memory: '2GB' })
     .https.onRequest(app);
   ```

2. **PDF生成の失敗**
   - 解決: フォントファイルの配置確認
   - メモリ不足の場合は Functions のメモリを増加

3. **Google Drive API の制限**
   - 解決: リトライ機能と exponential backoff の実装

4. **Firestore の読み込み制限**
   - 解決: インデックスの最適化と Query の分割

## サポート

デプロイに関する問題が発生した場合：

1. Firebase Console でログを確認
2. Cloud Console でエラーログを確認
3. 開発チームへ連絡

---

© 2024 AsamiWorks LLC. All Rights Reserved.