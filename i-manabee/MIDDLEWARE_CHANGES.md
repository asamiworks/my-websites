# Middleware Changes - Firebase Admin SDK 移行

## 変更内容

### 問題
Next.js ミドルウェアはEdge Runtimeで動作するため、Firebase Admin SDKを使用できませんでした。これにより以下の問題が発生していました：

- Firebase Admin SDK の import エラー
- 詳細な認証チェックができない
- レート制限機能が動作しない

### 解決策

#### 1. ミドルウェアの役割を基本的なルート保護に限定

**変更前**: Firebase Admin SDKを使用した詳細な認証チェック
**変更後**: 基本的なトークンの存在チェックのみ

```typescript
// 変更前（Edge Runtimeで動作しない）
import { checkAPIRateLimit } from '@/lib/security/rateLimit';
const decodedToken = await adminAuth.verifyIdToken(idToken);

// 変更後（Edge Runtime対応）
const authToken = request.cookies.get('auth-token');
const sessionCookie = request.cookies.get('session');
if (!authToken && !sessionCookie) {
  // リダイレクト処理のみ
}
```

#### 2. API Routes での詳細認証チェック

**新しい認証ミドルウェア**: `src/lib/auth/middleware.ts`

```typescript
export async function verifyAuthToken(request: NextRequest): Promise<AuthResult>
export async function verifySession(request: NextRequest): Promise<AuthResult>
export async function verifyAdminAccess(request: NextRequest): Promise<AuthResult>
export async function authenticateWithRateLimit(request: NextRequest, limitType): Promise<AuthResult>
```

#### 3. 各API Routeでの認証チェック実装

**例: チャットAPI**
```typescript
// 変更前
const authHeader = request.headers.get('authorization');
const decodedToken = await adminAuth.verifyIdToken(idToken);

// 変更後
const authResult = await authenticateWithRateLimit(request, 'chat');
if (!authResult.success) {
  return createAuthErrorResponse(authResult);
}
```

## 実装されたAPI Routes

### 1. 認証API
- `POST /api/auth/verify` - トークン検証

### 2. 管理者API
- `GET /api/admin/users` - 管理者権限でユーザー一覧取得

### 3. プロファイルAPI
- `GET /api/profile` - ユーザープロファイル取得
- `PUT /api/profile` - プロファイル更新

### 4. 子どもAPI
- `POST /api/child/verify-pin` - PIN認証

### 5. ヘルスチェックAPI（レート制限対応）
- `GET /api/health` - システムヘルスチェック（レート制限付き）

## ミドルウェアの役割

### 実行される処理
1. ✅ セキュリティヘッダーの設定
2. ✅ 危険なパスへのアクセス拒否
3. ✅ ボット/クローラーの検出と制限
4. ✅ 管理者IP制限
5. ✅ 基本的な認証チェック（トークン存在確認のみ）
6. ✅ 年齢グループ別CSP適用
7. ✅ CORS設定
8. ✅ 基本的なアクセスログ

### 削除された処理
- ❌ Firebase Admin SDK を使用した詳細認証
- ❌ Edge Runtime非対応のレート制限
- ❌ 非同期ログ処理

## API Routes の役割

### 実行される処理
1. ✅ Firebase Admin SDK による詳細認証
2. ✅ レート制限チェック
3. ✅ 権限レベル確認（管理者、保護者、子ども）
4. ✅ セッション管理
5. ✅ 詳細なエラーハンドリング

## 利点

### 1. Edge Runtime 対応
- ミドルウェアが正常に動作
- Cold start の高速化

### 2. 責任の分離
- ミドルウェア：基本的なルート保護
- API Routes：詳細な認証・認可

### 3. 柔軟な認証方式
- IDトークン認証
- セッション認証
- PIN認証
- 管理者認証

### 4. 適切なレート制限
- API別の制限設定
- 認証状態に基づく制限

## 使用方法

### API Route での認証実装例

```typescript
import { authenticateWithRateLimit, createAuthErrorResponse } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  // レート制限付き認証
  const authResult = await authenticateWithRateLimit(request, 'chat');

  if (!authResult.success) {
    return createAuthErrorResponse(authResult);
  }

  const userId = authResult.user!.uid;
  // API処理を続行
}
```

### 管理者API での実装例

```typescript
import { verifyAdminAccess, createAuthErrorResponse } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  // 管理者権限チェック
  const authResult = await verifyAdminAccess(request);

  if (!authResult.success) {
    return createAuthErrorResponse(authResult);
  }

  // 管理者専用処理
}
```

## セキュリティ向上点

1. **適切な認証**: Firebase Admin SDKによる確実なトークン検証
2. **細かい権限制御**: API毎の認証レベル設定
3. **レート制限**: 適切な制限値とエラーレスポンス
4. **エラーハンドリング**: 統一されたエラーレスポンス形式
5. **ログ記録**: セキュリティイベントの詳細記録

この変更により、i-manabeeプラットフォームは Edge Runtime 対応しつつ、より堅牢な認証・認可システムを実現しています。