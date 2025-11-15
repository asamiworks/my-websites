# Stripe決済システム セットアップガイド

## 概要

このプロジェクトには、Stripe決済を使用した請求書管理システムが実装されています。
クライアントは請求書を閲覧し、クレジットカードで支払うことができます。
管理者はクライアント管理と請求書の作成・管理が可能です。

## システム構成

### Firestore コレクション

1. **clients** - クライアント情報
   - clientName: string (クライアント名)
   - email: string (メールアドレス)
   - phone: string (電話番号)
   - address: string (住所)
   - userId: string (Firebase Auth UID)
   - isActive: boolean (有効/無効)
   - createdAt: Timestamp
   - updatedAt: Timestamp

2. **invoices** - 請求書情報
   - clientId: string (クライアントID参照)
   - clientName: string (クライアント名)
   - invoiceNumber: string (請求書番号)
   - items: InvoiceItem[] (明細)
   - subtotal: number (小計)
   - taxRate: number (税率)
   - taxAmount: number (税額)
   - totalAmount: number (合計金額)
   - issueDate: Timestamp (発行日)
   - dueDate: Timestamp (支払期限)
   - status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
   - notes: string (備考)
   - stripePaymentIntentId: string (Stripe Payment Intent ID)
   - stripeCheckoutSessionId: string (Stripe Checkout Session ID)
   - paidAt: Timestamp (支払日)
   - paymentMethod: 'card' | 'bank_transfer' | 'other'
   - createdAt: Timestamp
   - updatedAt: Timestamp

### ページ構成

#### クライアント側
- `/mypage/invoices` - 請求書一覧
- `/mypage/invoices/[id]` - 請求書詳細・支払い
- `/mypage/invoices/[id]/success` - 支払い完了

#### 管理者側
- `/admin/clients` - クライアント管理
- `/admin/invoices` - 請求書管理
- `/admin/invoices/[id]` - 請求書詳細

## 環境変数の設定

### 1. Stripeアカウントの作成

1. [Stripe](https://stripe.com/jp)でアカウントを作成
2. ダッシュボードから「開発者」→「APIキー」を開く
3. 公開可能キーとシークレットキーをコピー

### 2. Next.js環境変数 (.env.local)

プロジェクトルートに `.env.local` ファイルを作成:

```bash
# Stripe公開可能キー (クライアント側で使用)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Firebase Functions URL
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-your-project-id.cloudfunctions.net
```

### 3. Firebase Functions環境変数

Firebase CLIを使用して環境変数を設定:

```bash
# Stripeシークレットキー
firebase functions:config:set stripe.secret_key="sk_test_xxxxxxxxxxxxx"

# Stripe Webhookシークレット (後で設定)
firebase functions:config:set stripe.webhook_secret="whsec_xxxxxxxxxxxxx"
```

設定を確認:
```bash
firebase functions:config:get
```

### 4. Stripe Webhook設定

1. Stripeダッシュボードで「開発者」→「Webhook」を開く
2. 「エンドポイントを追加」をクリック
3. エンドポイントURL: `https://us-central1-your-project-id.cloudfunctions.net/stripeWebhook`
4. 以下のイベントを選択:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. 作成後、「署名シークレット」をコピー
6. Firebase Functionsの環境変数に設定:
   ```bash
   firebase functions:config:set stripe.webhook_secret="whsec_xxxxxxxxxxxxx"
   ```

## デプロイ手順

### 1. ビルドの確認

```bash
npm run build
```

エラーがないことを確認してください。

### 2. Firebase Functionsのデプロイ

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

デプロイされる関数:
- `createCheckoutSession` - Stripe Checkout Session作成
- `stripeWebhook` - Stripe Webhookハンドラー

### 3. Next.jsアプリのデプロイ

Firebaseホスティングを使用する場合:

```bash
npm run build
firebase deploy --only hosting
```

### 4. Firestore Indexesのデプロイ

```bash
firebase deploy --only firestore:indexes
```

## テスト手順

### 1. テストクライアントの作成

1. `/admin/clients` にアクセス
2. 「新規クライアント」をクリック
3. テストクライアント情報を入力
4. Firebase Authenticationでクライアント用ユーザーを作成
5. Firestoreの `clients` コレクションで `userId` を紐付け

### 2. テスト請求書の作成

1. `/admin/invoices` にアクセス
2. 「新規請求書」をクリック
3. クライアントを選択
4. 明細を追加
5. 「作成」をクリック
6. ステータスを「送付済み」に変更

### 3. 支払いテスト

1. クライアントアカウントでログイン
2. `/mypage/invoices` で請求書を確認
3. 請求書詳細ページで「クレジットカードで支払う」をクリック
4. Stripeテストカード番号を使用:
   - カード番号: `4242 4242 4242 4242`
   - 有効期限: 将来の任意の日付
   - CVC: 任意の3桁
   - 郵便番号: 任意

5. 支払い完了後、請求書ステータスが「支払い済み」に変更されることを確認

## トラブルシューティング

### Stripe Checkout Sessionが作成できない

- Firebase Functionsの環境変数が正しく設定されているか確認
- CORS設定が正しいか確認 (`functions/src/api/stripe-api.ts`)
- Firebase Functionsのログを確認: `firebase functions:log`

### Webhookが動作しない

- WebhookエンドポイントURLが正しいか確認
- Webhook署名シークレットが正しく設定されているか確認
- Stripeダッシュボードで「Webhook」→「イベント」でエラーを確認

### 支払い後にステータスが更新されない

- Webhookが正しく動作しているか確認
- Firebase Functionsのログを確認
- invoiceIdがWebhook metadataに正しく含まれているか確認

## セキュリティ考慮事項

1. **環境変数の保護**
   - `.env.local` をgitignoreに追加
   - シークレットキーをコードにハードコーディングしない

2. **Firebase Security Rules**
   - Firestore Rulesで適切なアクセス制御を実装
   - クライアントは自分の請求書のみ閲覧可能
   - 管理者のみが請求書作成・編集可能

3. **Stripe Webhook検証**
   - Webhook署名を必ず検証 (実装済み)
   - 不正なリクエストを拒否

## 本番環境への移行

1. Stripeのテストモードから本番モードに切り替え
2. 本番用のAPIキーを取得
3. 環境変数を本番用に更新
4. Webhookエンドポイントを本番URL用に再作成
5. 十分なテストを実施してからリリース

## サポート

問題が発生した場合:
1. Firebase Functionsのログを確認
2. Stripeダッシュボードでイベントログを確認
3. ブラウザの開発者ツールでネットワークエラーを確認
