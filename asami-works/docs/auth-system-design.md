# 認証システム設計書

## 1. システム概要

AsamiWorks チャットウィジェットに会員機能を追加し、以下を実現する：
- ログインユーザーはチャット履歴を180日間保存・継続可能
- 非会員も問い合わせ可能（従来通り）
- 問い合わせ後にアカウント作成を促進
- 将来的にStripe決済連携を見据えた設計

---

## 2. ユーザーフロー設計

### 2.1 初回訪問時のフロー

```
チャット開く
  ↓
会員ステータス確認（ローカルストレージまたはセッション）
  ├─ ログイン済み → チャット履歴画面へ
  └─ 未ログイン → 会員/非会員選択画面
                   ├─ 会員です → ログイン画面
                   │            ├─ Googleでログイン
                   │            └─ メールアドレス/パスワード
                   │            ↓
                   │         ログイン成功
                   │            ↓
                   │         チャット履歴画面
                   │         （過去のチャット一覧表示）
                   │            ├─ 新しいチャット開始
                   │            └─ 過去のチャット選択 → 続きから会話
                   │
                   └─ 会員ではない → 通常チャット開始
                                     ↓
                                  （従来通りの会話フロー）
                                     ↓
                                  個人情報入力・送信
                                     ↓
                                  問い合わせ完了
                                     ↓
                                  アカウント作成のご案内
                                     ├─ アカウント作成する
                                     │  → パスワード入力画面
                                     │  → メール認証送信
                                     │  → 認証完了
                                     │  → アカウント作成完了
                                     │  → チャット履歴保存
                                     │
                                     └─ 今はしない → 終了
```

### 2.2 ログインフロー詳細

#### 2.2.1 Googleログイン
```
「Googleでログイン」ボタンクリック
  ↓
Google OAuth ポップアップ
  ↓
Google認証完了
  ↓
Firebase Authenticationに登録
  ↓
Firestoreにユーザー情報作成（初回のみ）
  {
    uid: Google UID,
    email: Googleメール,
    name: Google表示名,
    phone: null,  // 後で入力可能
    authProvider: 'google',
    createdAt: timestamp
  }
  ↓
チャット履歴画面へ
```

#### 2.2.2 メール/パスワードログイン
```
メールアドレス・パスワード入力
  ↓
Firebase Authentication検証
  ↓
ログイン成功
  ↓
チャット履歴画面へ
```

### 2.3 非会員からのアカウント作成フロー

```
問い合わせ完了
  ↓
「チャット履歴を保存するにはアカウント作成をお勧めします」表示
  ↓
「アカウント作成」ボタンクリック
  ↓
パスワード入力画面
  入力済みデータ表示:
  - お名前: 〇〇（編集不可）
  - メールアドレス: 〇〇（編集不可）
  - 電話番号: 〇〇（編集可）
  - パスワード: [新規入力]
  - パスワード確認: [新規入力]
  ↓
「アカウント作成」ボタンクリック
  ↓
Firebase Authentication作成
  ↓
メール認証送信
  ↓
「メールアドレスに認証メールを送信しました」画面
  ↓
【ユーザーがメール確認】
  ↓
認証リンククリック
  ↓
メールアドレス認証完了
  ↓
Firestoreにユーザー情報作成
  {
    uid: Firebase UID,
    email: 問い合わせメール,
    name: 問い合わせ名前,
    phone: 問い合わせ電話,
    authProvider: 'email',
    createdAt: timestamp,
    emailVerified: true
  }
  ↓
現在のチャット履歴をFirestoreに保存
  ↓
「アカウント作成完了」画面
```

---

## 3. データベース設計（Firestore）

### 3.1 コレクション構造

```
firestore
├─ users/{uid}
│   ├─ uid: string
│   ├─ email: string
│   ├─ name: string
│   ├─ phone: string | null
│   ├─ authProvider: 'google' | 'email'
│   ├─ emailVerified: boolean
│   ├─ createdAt: timestamp
│   └─ stripeCustomerId: string | null  // 将来の決済用
│
├─ chats/{chatId}
│   ├─ chatId: string (自動生成)
│   ├─ userId: string (users.uid への参照)
│   ├─ title: string (会話の最初のメッセージから生成)
│   ├─ messages: array<Message>
│   │   ├─ role: 'user' | 'assistant'
│   │   ├─ content: string
│   │   └─ timestamp: timestamp
│   ├─ createdAt: timestamp
│   ├─ updatedAt: timestamp
│   └─ expiresAt: timestamp  // createdAt + 180日
│
└─ inquiries/{inquiryId}
    ├─ inquiryId: string (自動生成)
    ├─ userId: string | null  // ログインユーザーの場合のみ
    ├─ name: string
    ├─ email: string
    ├─ phone: string
    ├─ businessInfo: object
    │   ├─ industry: string
    │   ├─ goal: string
    │   └─ currentStatus: object
    ├─ chatSnapshot: array<Message>  // 問い合わせ時のチャット内容
    ├─ status: 'pending' | 'contacted' | 'closed'
    ├─ createdAt: timestamp
    └─ notes: string | null  // 担当者メモ
```

### 3.2 セキュリティルール（Firestore Rules）

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ユーザー情報：本人のみ読み書き可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // チャット：本人のみ読み書き可能
    match /chats/{chatId} {
      allow read, write: if request.auth != null
        && resource.data.userId == request.auth.uid;

      // 新規作成時
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }

    // 問い合わせ：本人または管理者のみ閲覧可能
    match /inquiries/{inquiryId} {
      // 作成：誰でも可能（非会員対応）
      allow create: if true;

      // 読み取り：本人または認証済みユーザー（将来の管理画面用）
      allow read: if request.auth != null
        && (resource.data.userId == request.auth.uid
            || request.auth.token.admin == true);

      // 更新：管理者のみ（ステータス変更用）
      allow update: if request.auth != null
        && request.auth.token.admin == true;
    }
  }
}
```

---

## 4. コンポーネント設計

### 4.1 新規コンポーネント

```
src/components/
├─ auth/
│   ├─ AuthModal.tsx           # 認証モーダル（ログイン/サインアップ切替）
│   ├─ LoginForm.tsx            # ログインフォーム
│   ├─ SignupForm.tsx           # サインアップフォーム
│   ├─ GoogleAuthButton.tsx     # Googleログインボタン
│   └─ EmailVerification.tsx    # メール認証待機画面
│
├─ chat/
│   ├─ ChatHistory.tsx          # チャット履歴一覧
│   ├─ ChatListItem.tsx         # チャット履歴アイテム
│   └─ NewChatButton.tsx        # 新規チャット作成ボタン
│
└─ ChatWidget.tsx (既存を拡張)
    ├─ MembershipSelection.tsx  # 会員/非会員選択画面
    └─ AccountCreationPrompt.tsx # アカウント作成促進画面
```

### 4.2 コンポーネント間の状態管理

#### Context API を使用
```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// src/contexts/ChatContext.tsx
interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  createNewChat: () => Promise<string>;
  loadChat: (chatId: string) => Promise<void>;
  saveMessage: (message: Message) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}
```

---

## 5. 認証フロー実装詳細

### 5.1 Google OAuth 設定手順

1. Firebase Console でGoogle認証を有効化
2. OAuth同意画面の設定
3. 承認済みドメインの追加
   - localhost (開発用)
   - asami-works.com (本番用)
   - asamiworks-679b3.web.app (Firebase Hosting)

### 5.2 メール認証の実装

```typescript
// Firebase Authentication設定
const actionCodeSettings = {
  url: 'https://asami-works.com/verify-email?mode=verifyEmail',
  handleCodeInApp: true,
};

// メール認証送信
await sendEmailVerification(user, actionCodeSettings);
```

### 5.3 パスワードポリシー

- 最小文字数: 8文字
- 必須要素:
  - 英字（大文字・小文字）
  - 数字
  - 特殊文字（推奨、必須ではない）

---

## 6. チャット履歴の保存・復元

### 6.1 チャット保存タイミング

1. **ログインユーザー**:
   - メッセージ送信ごとにFirestoreに保存
   - リアルタイムで同期

2. **非会員からアカウント作成**:
   - アカウント作成完了時に現在のチャットを一括保存
   - ローカルストレージからFirestoreへ移行

### 6.2 チャット復元

```typescript
// チャット一覧取得
const chatsQuery = query(
  collection(db, 'chats'),
  where('userId', '==', user.uid),
  orderBy('updatedAt', 'desc'),
  limit(20)
);

// 特定チャットの復元
const chatDoc = await getDoc(doc(db, 'chats', chatId));
const messages = chatDoc.data().messages;
```

### 6.3 180日自動削除

Firestoreには自動TTL機能がないため、以下のいずれかで実装：

#### オプション1: Cloud Scheduler + Cloud Functions
```typescript
// 毎日実行される削除関数
export const deleteExpiredChats = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const expiredChats = await db.collection('chats')
      .where('expiresAt', '<', now)
      .get();

    const batch = db.batch();
    expiredChats.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  });
```

#### オプション2: クライアント側での削除
- チャット取得時にexpiresAtをチェック
- 期限切れのチャットは表示せず、バックグラウンドで削除

---

## 7. Google認証ユーザーと問い合わせの紐付け

### 7.1 紐付けロジック

Google認証でログイン後、過去の問い合わせを紐付ける：

```typescript
// ログイン成功時
async function linkInquiriesToUser(user: User) {
  // メールアドレスが一致する問い合わせを検索
  const inquiriesQuery = query(
    collection(db, 'inquiries'),
    where('email', '==', user.email),
    where('userId', '==', null)  // まだ紐付いていない
  );

  const inquiries = await getDocs(inquiriesQuery);

  // バッチ更新
  const batch = writeBatch(db);
  inquiries.docs.forEach(doc => {
    batch.update(doc.ref, { userId: user.uid });
  });
  await batch.commit();
}
```

### 7.2 問い合わせ作成時の処理

```typescript
// 問い合わせ送信時
async function createInquiry(data: InquiryData, user?: User) {
  const inquiryData = {
    ...data,
    userId: user?.uid || null,  // ログイン済みなら紐付け
    createdAt: serverTimestamp(),
    status: 'pending'
  };

  await addDoc(collection(db, 'inquiries'), inquiryData);
}
```

---

## 8. セキュリティ要件

### 8.1 認証セキュリティ

1. **メール認証必須**
   - メール/パスワード登録時は必ずメール認証
   - 認証完了まで一部機能制限（オプション）

2. **パスワードリセット**
   - Firebase Authentication標準機能を使用
   - リセットメール送信機能を提供

3. **セッション管理**
   - Firebase Authenticationの自動セッション管理
   - リフレッシュトークンによる自動更新

### 8.2 データ保護

1. **個人情報の暗号化**
   - Firestore保存時は自動暗号化（Googleインフラ）
   - 通信はHTTPS必須

2. **アクセス制御**
   - Firestore Rulesで厳格な制御
   - 本人以外はアクセス不可

3. **監査ログ**
   - 重要操作（アカウント作成、削除等）はログ記録
   - Cloud Logging で追跡可能

---

## 9. 実装フェーズ

### Phase 1: 基盤構築（1-2日）
- [x] Firebase Authentication設定確認
- [ ] 認証Context作成
- [ ] Firestoreセキュリティルール作成
- [ ] 基本的なデータベーススキーマ作成

### Phase 2: 認証UI（2-3日）
- [ ] AuthModal コンポーネント作成
- [ ] LoginForm 実装
- [ ] SignupForm 実装
- [ ] GoogleAuthButton 実装
- [ ] メール認証フロー実装

### Phase 3: 会員/非会員選択（1日）
- [ ] MembershipSelection コンポーネント
- [ ] ChatWidget に統合
- [ ] 初回表示ロジック

### Phase 4: チャット履歴機能（2-3日）
- [ ] ChatHistory コンポーネント
- [ ] チャット保存機能
- [ ] チャット復元機能
- [ ] 新規チャット作成

### Phase 5: アカウント作成促進（1-2日）
- [ ] AccountCreationPrompt コンポーネント
- [ ] 問い合わせデータ引き継ぎ
- [ ] チャット履歴の移行

### Phase 6: Google紐付け＆最適化（1-2日）
- [ ] 問い合わせ紐付けロジック
- [ ] 180日自動削除機能
- [ ] パフォーマンス最適化

### Phase 7: テスト＆デバッグ（2-3日）
- [ ] 単体テスト
- [ ] 統合テスト
- [ ] セキュリティテスト
- [ ] UXテスト

**合計見積もり: 10-16日**

---

## 10. 技術スタック

### フロントエンド
- Next.js 15.5.2
- React 19
- TypeScript
- Firebase SDK (firebase@12.4.0)
- Context API（状態管理）

### バックエンド
- Firebase Authentication
- Cloud Firestore
- Cloud Functions（自動削除用）
- Cloud Scheduler（定期実行用）

### 開発ツール
- Firebase Emulator Suite（ローカル開発）
- Firebase Console（管理画面）

---

## 11. 将来の拡張性

### Stripe決済連携
```typescript
// usersコレクションにstripeCustomerIdを保存済み
interface User {
  ...
  stripeCustomerId: string | null;
  subscription: {
    plan: 'free' | 'basic' | 'premium';
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: timestamp;
  } | null;
}
```

### 管理者ダッシュボード
- 問い合わせ一覧・管理
- ユーザー管理
- チャット履歴閲覧（サポート用）
- 分析ダッシュボード

---

## 12. リスク管理

### 想定されるリスク

1. **メール認証の未完了**
   - リスク: ユーザーがメール認証を完了しない
   - 対策: リマインダーメール、再送機能

2. **Google OAuth の設定ミス**
   - リスク: 本番環境でGoogle認証が動作しない
   - 対策: 事前に本番ドメインで検証

3. **チャット履歴の増大**
   - リスク: Firestoreのコストが増加
   - 対策: 180日自動削除、メッセージ数制限

4. **セキュリティ脆弱性**
   - リスク: データ漏洩、不正アクセス
   - 対策: セキュリティルールの厳格化、定期監査

---

## 次のステップ

この設計書をベースに、Phase 1から順次実装を進めます。
各フェーズ完了後にレビューを行い、必要に応じて設計を調整します。
