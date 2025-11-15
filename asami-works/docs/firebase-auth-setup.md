# Firebase Authentication 設定手順

## 1. Firebase Console での設定

### A. プロジェクトにアクセス
https://console.firebase.google.com/project/asamiworks-679b3

### B. Authentication の有効化

1. **左サイドバー** → **Authentication** をクリック
2. **Get started** をクリック（初回のみ）
3. **Sign-in method** タブに移動

#### Google認証を有効化
1. **Google** の行をクリック
2. **有効にする** をON
3. **プロジェクトのサポートメール** を選択（例: info@asami-works.com）
4. **保存** をクリック

#### メール/パスワード認証を有効化
1. **メール / パスワード** の行をクリック
2. **有効にする** をON（1つ目のトグルのみ）
3. **保存** をクリック

### C. 承認済みドメインの追加

1. **Authentication** → **Settings** タブ
2. **Authorized domains** セクションまでスクロール
3. 以下のドメインが追加されているか確認（なければ追加）:
   - `localhost`
   - `asami-works.com`
   - `asamiworks-679b3.web.app`
   - `asamiworks-679b3.firebaseapp.com`

## 2. Firebase SDK 設定値の取得

1. **プロジェクトの設定**（歯車アイコン⚙️）をクリック
2. **全般** タブを選択
3. 下部の **マイアプリ** セクションまでスクロール
4. Webアプリ（</> アイコン）を選択
5. **Firebase SDK snippet** → **構成** を選択
6. 以下の値をコピー:

```javascript
{

}
```

## 3. 環境変数の設定

`.env.local` ファイルを更新:

```bash
# Firebase Configuration (Client)

```

## 4. Firestore Security Rules のデプロイ

既に`firestore.rules`ファイルは作成済みです。デプロイします:

```bash
firebase deploy --only firestore:rules
```

## 5. 開発サーバーの再起動

環境変数を変更したので、開発サーバーを再起動:

```bash
# 現在のサーバーを停止（Ctrl+C）
npm run dev
```

## 6. 動作確認

### テスト1: Googleログイン
1. http://localhost:3002 にアクセス
2. チャットウィジェットを開く
3. 「会員としてログイン」を選択
4. 「ログイン」タブで「Googleでログイン」をクリック
5. Googleアカウントを選択してログイン
6. ログイン成功後、チャット履歴が表示されることを確認

### テスト2: メール/パスワード新規登録
1. チャットウィジェットを開く
2. 「会員としてログイン」を選択
3. 「新規登録」タブに切り替え
4. 以下を入力:
   - お名前: テストユーザー
   - メールアドレス: test@example.com
   - 電話番号: 090-1234-5678
   - パスワード: test1234
   - パスワード（確認）: test1234
5. 「アカウント作成」をクリック
6. 成功メッセージが表示され、メール認証の案内が表示されることを確認

### テスト3: メール/パスワードログイン
1. 上記で作成したアカウントでログイン
2. ログイン成功後、チャット履歴が表示されることを確認

### テスト4: チャット履歴の保存
1. ログイン状態でチャットを開始
2. いくつかメッセージを送信
3. チャットを閉じて再度開く
4. 履歴ボタンから過去のチャットが確認できることを確認

### テスト5: 問い合わせフォームからのメール送信
1. ログイン状態でチャットを進める
2. 個人情報フォームに入力して送信
3. メールが届くことを確認（自動返信 + 管理者通知）

## 7. トラブルシューティング

### エラー: "Firebase: Error (auth/configuration-not-found)"
- Firebase Console で Authentication が有効になっているか確認
- 環境変数が正しく設定されているか確認
- 開発サーバーを再起動

### エラー: "Firebase: Error (auth/unauthorized-domain)"
- Firebase Console の Authorized domains に localhost が追加されているか確認

### エラー: "Firebase: Error (auth/popup-blocked)"
- ブラウザのポップアップブロックを無効化

### Googleログインで "This app is blocked"
- Firebase Console の OAuth consent screen で以下を確認:
  - App name が設定されている
  - Support email が設定されている
  - Authorized domains に asami-works.com が追加されている

## 8. 本番環境へのデプロイ

### A. 環境変数の設定（Vercel/Firebase Hostingなど）

本番環境にも同じ環境変数を設定:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza....
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=asamiworks-679b3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=asamiworks-679b3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=asamiworks-679b3.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### B. Authorized domains に本番ドメインを追加

Firebase Console → Authentication → Settings → Authorized domains:
- `asami-works.com`
- `www.asami-works.com`

### C. Firebase Functions のデプロイ

```bash
cd /home/asamiworks/my-websites/asami-works
firebase deploy --only functions
```

## セキュリティ推奨事項

1. **パスワードポリシー**:
   - 最低8文字（現在の設定）
   - より厳しくする場合は AuthContext.tsx の signUpWithEmail を修正

2. **メール認証の強制**:
   - 現在は任意
   - 強制する場合は AuthContext で emailVerified をチェック

3. **レート制限**:
   - Firebase のデフォルトで保護済み
   - 追加の保護が必要な場合は Firebase App Check を検討

4. **管理者権限**:
   - Firestore Rules で info@asami-works.com を管理者として設定済み
   - 追加の管理者を設定する場合は firestore.rules を更新

## 参考リンク

- Firebase Authentication 公式ドキュメント: https://firebase.google.com/docs/auth
- Next.js with Firebase: https://firebase.google.com/docs/auth/web/start
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
