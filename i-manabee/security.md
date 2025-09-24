# i-manabee セキュリティ設定ガイド

## 概要

本番環境でのセキュリティ設定について説明します。子ども向けAI学習プラットフォームとして、特に厳格なセキュリティ対策が必要です。

## 1. Firebase セキュリティルール

### Firestore セキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ユーザードキュメント - 本人のみアクセス可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // 管理者は全ユーザーデータを読み取り可能（監査用）
      allow read: if request.auth != null &&
                  request.auth.token.role == 'admin';
    }

    // 子どもプロファイル - 保護者のみアクセス可能
    match /child_profiles/{childId} {
      allow read, write: if request.auth != null &&
                         request.auth.uid == resource.data.parentId;

      // 管理者は読み取り専用
      allow read: if request.auth != null &&
                  request.auth.token.role == 'admin';
    }

    // チャットメッセージ - 保護者のみアクセス可能
    match /chat_messages/{messageId} {
      allow read, write: if request.auth != null &&
                         request.auth.uid == resource.data.userId;

      // 新規作成時の検証
      allow create: if request.auth != null &&
                    request.auth.uid == request.resource.data.userId &&
                    isValidMessage(request.resource.data);
    }

    // 子どもセッション - 保護者のみアクセス可能
    match /child_sessions/{sessionId} {
      allow read, write: if request.auth != null &&
                         request.auth.uid == resource.data.userId;

      // セッション開始時の検証
      allow create: if request.auth != null &&
                    request.auth.uid == request.resource.data.userId &&
                    isValidSession(request.resource.data);
    }

    // 使用状況 - 本人のみアクセス可能
    match /usage_daily/{usageId} {
      allow read, write: if request.auth != null &&
                         request.auth.uid == resource.data.userId;
    }

    match /usage_monthly/{usageId} {
      allow read, write: if request.auth != null &&
                         request.auth.uid == resource.data.userId;
    }

    // 緊急アラート - 保護者と管理者のみアクセス可能
    match /emergency_alerts/{alertId} {
      allow read, write: if request.auth != null &&
                         (request.auth.uid == resource.data.parentId ||
                          request.auth.token.role == 'admin');
    }

    // セキュリティログ - 管理者のみアクセス可能
    match /security_logs/{logId} {
      allow read: if request.auth != null &&
                  request.auth.token.role == 'admin';
      allow create: if request.auth != null; // システムからの作成は許可
    }

    // COPPA関連ログ - 管理者のみアクセス可能
    match /coppa_logs/{logId} {
      allow read: if request.auth != null &&
                  request.auth.token.role == 'admin';
      allow create: if request.auth != null;
    }

    // エラーレポート - 管理者のみアクセス可能
    match /error_reports/{errorId} {
      allow read: if request.auth != null &&
                  request.auth.token.role == 'admin';
      allow create: if request.auth != null;
    }

    // 管理者アラート - 管理者のみアクセス可能
    match /admin_alerts/{alertId} {
      allow read, write: if request.auth != null &&
                         request.auth.token.role == 'admin';
    }

    // 他のすべてのドキュメントへのアクセスを拒否
    match /{document=**} {
      allow read, write: if false;
    }

    // ヘルパー関数
    function isValidMessage(data) {
      return data.keys().hasAll(['userId', 'childId', 'sessionId', 'role', 'content', 'timestamp']) &&
             data.role in ['user', 'assistant'] &&
             data.content is string &&
             data.content.size() <= 5000; // 最大5000文字
    }

    function isValidSession(data) {
      return data.keys().hasAll(['userId', 'childId', 'startedAt', 'expiresAt']) &&
             data.expiresAt.toMillis() > request.time.toMillis() &&
             data.expiresAt.toMillis() < (request.time.toMillis() + 14400000); // 最大4時間
    }
  }
}
```

### Firebase Storage セキュリティルール

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // ユーザーファイル - 本人のみアクセス可能
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null &&
                         request.auth.uid == userId;
    }

    // 子ども関連ファイル - 保護者のみアクセス可能
    match /children/{childId}/{allPaths=**} {
      allow read, write: if request.auth != null &&
                         isChildParent(childId);
    }

    // ファイルサイズとタイプの制限
    match /{allPaths=**} {
      allow write: if request.resource.size < 5 * 1024 * 1024 && // 5MB制限
                   request.resource.contentType.matches('image/.*'); // 画像のみ
    }

    // 他のすべてのファイルへのアクセスを拒否
    match /{allPaths=**} {
      allow read, write: if false;
    }

    function isChildParent(childId) {
      // 実装: 子どもプロファイルから保護者IDを確認
      return true; // 簡略化
    }
  }
}
```

## 2. Next.js セキュリティ設定

### next.config.js セキュリティ設定

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.openai.com https://*.firebaseapp.com https://*.googleapis.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          }
        ]
      }
    ];
  },

  // 外部画像の許可リスト
  images: {
    domains: ['firebasestorage.googleapis.com'],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // リダイレクトの制限
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?!i-manabee\\.com).*'
          }
        ],
        destination: 'https://i-manabee.com/:path*',
        permanent: true
      }
    ];
  },

  // セキュアなCookieの強制
  experimental: {
    serverActions: true
  },

  // 本番環境での最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

module.exports = nextConfig;
```

## 3. 環境変数セキュリティ

### 本番環境用 .env.production

```bash
# Firebase Production Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=i-manabee.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=i-manabee-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=i-manabee-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=production_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=production_app_id

# Firebase Admin SDK (Server-side only)
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nPRODUCTION_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@i-manabee-prod.iam.gserviceaccount.com
FIREBASE_ADMIN_PROJECT_ID=i-manabee-prod

# OpenAI API (Production Key with rate limits)
OPENAI_API_KEY=sk-production_key_with_strict_limits

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://i-manabee.com
NODE_ENV=production

# Security
JWT_SECRET=super_secure_production_jwt_secret_32_chars
ENCRYPTION_KEY=secure_32_character_encryption_key

# Rate Limiting
REDIS_URL=redis://production-redis:6379
REDIS_PASSWORD=secure_redis_password

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEW_RELIC_LICENSE_KEY=your_new_relic_license_key

# Email Service (Production)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=production_sendgrid_api_key

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_PRODUCTION_ID

# Security Headers
CSP_REPORT_URI=https://i-manabee.report-uri.com/r/d/csp/enforce
HPKP_REPORT_URI=https://i-manabee.report-uri.com/r/d/hpkp/enforce

# Development Settings (Disabled in production)
NEXT_PUBLIC_ENABLE_FIREBASE_EMULATOR=false
```

## 4. データ保護設定

### COPPA準拠設定

```javascript
// COPPA準拠のデータ処理設定
export const COPPA_SETTINGS = {
  // 13歳未満の子どもに対する制限
  underThirteenRestrictions: {
    // データ最小化
    dataMinimization: true,

    // 保護者の同意が必要な情報
    parentalConsentRequired: [
      'personal_information',
      'location_data',
      'biometric_data',
      'behavioral_data'
    ],

    // 自動削除設定
    dataRetention: {
      chatMessages: 90, // 90日
      userSessions: 30, // 30日
      errorLogs: 30,   // 30日
      securityLogs: 180 // 180日（法的要件）
    },

    // アクセス制限
    accessRestrictions: {
      allowDataExport: false,
      allowDataSharing: false,
      requireParentVerification: true
    }
  },

  // データ処理の透明性
  dataProcessingTransparency: {
    logAllOperations: true,
    auditTrail: true,
    parentNotification: true
  }
};
```

## 5. API セキュリティ

### レート制限設定

```javascript
// production用レート制限設定
export const PRODUCTION_RATE_LIMITS = {
  // 認証API
  auth: {
    windowMs: 15 * 60 * 1000, // 15分
    maxRequests: 5,            // 最大5回の試行
    blockDuration: 60 * 60 * 1000, // 1時間ブロック
  },

  // チャットAPI
  chat: {
    windowMs: 60 * 1000,       // 1分
    maxRequests: 20,           // 最大20メッセージ/分
    burstLimit: 5,             // バースト制限5メッセージ/10秒
  },

  // 一般API
  general: {
    windowMs: 60 * 1000,       // 1分
    maxRequests: 100,          // 最大100リクエスト/分
  },

  // 管理者API
  admin: {
    windowMs: 60 * 1000,       // 1分
    maxRequests: 500,          // 最大500リクエスト/分
    ipWhitelist: [             // IP許可リスト
      '10.0.0.0/8',
      '172.16.0.0/12',
      '192.168.0.0/16'
    ]
  }
};
```

## 6. データベース暗号化

### 機密データの暗号化

```javascript
import crypto from 'crypto';

export class DataEncryption {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;

  // 機密データの暗号化
  static encrypt(text: string, key: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const keyBuffer = crypto.scryptSync(key, 'salt', this.KEY_LENGTH);
    const cipher = crypto.createCipher(this.ALGORITHM, keyBuffer, { iv });

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
  }

  // 機密データの復号化
  static decrypt(encryptedData: string, key: string): string {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const keyBuffer = crypto.scryptSync(key, 'salt', this.KEY_LENGTH);
    const decipher = crypto.createDecipher(this.ALGORITHM, keyBuffer, { iv });
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
```

## 7. セキュリティ監視

### ログ設定

```javascript
// セキュリティイベントのログ設定
export const SECURITY_LOGGING = {
  // ログレベル
  levels: {
    security: 0,    // セキュリティ関連の最重要ログ
    error: 1,       // エラーログ
    warn: 2,        // 警告ログ
    info: 3,        // 情報ログ
    debug: 4        // デバッグログ（本番では無効）
  },

  // ログ出力先
  transports: [
    {
      type: 'firebase',
      level: 'security',
      collection: 'security_logs'
    },
    {
      type: 'external',
      level: 'error',
      endpoint: 'https://logging-service.com/api/logs'
    }
  ],

  // 監視対象イベント
  monitoredEvents: [
    'authentication_failure',
    'authorization_failure',
    'rate_limit_exceeded',
    'suspicious_activity',
    'data_access_violation',
    'emergency_alert_triggered',
    'coppa_violation'
  ]
};
```

## 8. インシデント対応

### 緊急時対応手順

```markdown
# セキュリティインシデント対応手順

## レベル1: 軽微な問題
- レート制限違反
- バリデーションエラー
- 軽微な認証失敗

**対応:**
1. 自動的にログ記録
2. 必要に応じてIPブロック
3. 日次レポートで確認

## レベル2: 中程度の問題
- 繰り返しの認証失敗
- 異常な使用パターン
- APIエラーの急増

**対応:**
1. アラート送信
2. 該当ユーザーの一時制限
3. 管理者による確認
4. 必要に応じて追加対策

## レベル3: 重大な問題
- セキュリティ違反の検出
- 大量のデータアクセス
- システムへの攻撃

**対応:**
1. 即座に管理者に通知
2. 該当機能の一時停止
3. インシデント調査開始
4. 影響範囲の特定
5. 顧客への通知準備

## レベル4: 緊急事態
- データ漏洩
- システム侵害
- 子どもの安全に関わる問題

**対応:**
1. 緊急チーム招集
2. システム停止の検討
3. 法執行機関への通報
4. 保護者への緊急通知
5. 報告書作成
```

これらの設定により、i-manabeeは子ども向けサービスとして適切なセキュリティレベルを維持できます。