# 📁 i-manabee ディレクトリ構造

最終更新: 2025-10-07  
Version: 2.0.0

---

## 📚 前提ドキュメント

このドキュメントは以下を詳細化したものです：
- [完全仕様書](../i-manabee完全仕様書.md) - 「ディレクトリ構造（MVP版）」セクション

**参照先**: すべてのフェーズドキュメント

---

## 🎯 設計方針

### 原則
1. **機能ベースの分割**: 教科、認証、決済など機能ごとにディレクトリを分ける
2. **共通コンポーネントの再利用**: ui/ フォルダで共通UIを管理
3. **型定義の一元管理**: types/index.ts で全型をエクスポート
4. **Next.js App Routerの活用**: ファイルベースルーティング

---

## 📂 Phase 2完成時の全体構造
i-manabee/
├── 📄 README.md
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 next.config.js
├── 📄 tailwind.config.ts
├── 📄 .env.local
├── 📄 .gitignore
├── 📄 i-manabee完全仕様書.md
├── 📄 エンタープライズ版仕様書.md
│
├── 📁 docs/                          # ドキュメント
│   ├── README.md
│   ├── MASTER_PLAN.md
│   ├── DESIGN_SYSTEM.md
│   ├── TYPE_REFERENCE.md
│   ├── DIRECTORY_STRUCTURE.md
│   ├── MESSAGE_TEMPLATES.md
│   ├── PROGRESS.md
│   ├── DEVLOG.md
│   ├── phases/
│   │   ├── PHASE1_MVP.md
│   │   ├── PHASE2-1_AUTH.md
│   │   ├── PHASE2-2_MYPAGE.md
│   │   ├── PHASE2-3_PAYMENT.md
│   │   ├── PHASE2-4_USAGE.md
│   │   ├── PHASE2-5_CHAT.md
│   │   └── PHASE2-6_SAFETY.md
│   └── reference/
│       ├── FIREBASE_SETUP.md
│       ├── DEPLOYMENT.md
│       ├── SECURITY.md
│       └── TESTING.md
│
├── 📁 src/
│   ├── 📁 app/                       # Next.js App Router
│   │   ├── 📁 (auth)/               # 認証グループ（Phase 2.1）
│   │   │   ├── 📁 login/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 signup/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── 📁 (dashboard)/          # ダッシュボードグループ（Phase 2.2）
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 profile/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 children/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── 📁 usage/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 billing/          # Phase 2.3
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── 📁 (legal)/              # 法的ページ
│   │   │   ├── 📁 terms/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 privacy/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 sct/              # 特定商取引法
│   │   │   │   └── page.tsx
│   │   │   └── 📁 coppa/
│   │   │       └── page.tsx
│   │   │
│   │   ├── 📁 chat/                 # チャット（Phase 1完了）
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 pricing/              # 料金プラン（Phase 2.3）
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 api/                  # API Routes
│   │   │   ├── 📁 auth/            # 認証API（Phase 2.1）
│   │   │   │   ├── 📁 login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── 📁 signup/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── 📁 logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── 📁 session/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── 📁 children/        # 子どもプロファイルAPI（Phase 2.2）
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── 📁 verify-pin/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── 📁 chat/            # チャットAPI（Phase 1完了）
│   │   │   │   ├── route.ts
│   │   │   │   └── 📁 suggestions/ # Phase 2.5
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── 📁 safety/          # 安全性API（Phase 1完了）
│   │   │   │   ├── route.ts
│   │   │   │   └── 📁 logs/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── 📁 usage/           # 使用量API（Phase 2.4）
│   │   │   │   ├── route.ts
│   │   │   │   └── 📁 history/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── 📁 payment/         # 決済API（Phase 2.3）
│   │   │   │   ├── 📁 create-checkout/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── 📁 webhook/
│   │   │   │   │   └── route.ts
│   │   │   │   └── 📁 portal/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   └── 📁 test/            # テスト用API
│   │   │       ├── 📁 firebase/
│   │   │       │   └── route.ts
│   │   │       └── 📁 ai/
│   │   │           └── route.ts
│   │   │
│   │   ├── page.tsx                # ホーム（教科選択）
│   │   ├── layout.tsx              # ルートレイアウト
│   │   ├── globals.css
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── 📁 components/               # UIコンポーネント
│   │   ├── 📁 ui/                  # 共通UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── Badge.tsx
│   │   │
│   │   ├── 📁 auth/                # 認証関連（Phase 2.1）
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── AuthLayout.tsx
│   │   │
│   │   ├── 📁 chat/                # チャット関連（Phase 1完了）
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── InputArea.tsx
│   │   │   ├── VoiceInput.tsx
│   │   │   └── MessageSuggestions.tsx  # Phase 2.5
│   │   │
│   │   ├── 📁 profile/             # プロファイル関連（Phase 2.2）
│   │   │   ├── ChildCard.tsx
│   │   │   ├── ChildList.tsx
│   │   │   ├── ChildForm.tsx
│   │   │   ├── AvatarSelector.tsx
│   │   │   └── PinDialog.tsx
│   │   │
│   │   ├── 📁 dashboard/           # ダッシュボード（Phase 2.2）
│   │   │   ├── StatsCard.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   ├── UsageChart.tsx      # Phase 2.4
│   │   │   └── QuickActions.tsx
│   │   │
│   │   ├── 📁 payment/             # 決済関連（Phase 2.3）
│   │   │   ├── PlanCard.tsx
│   │   │   ├── PlanComparison.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── InvoiceList.tsx
│   │   │
│   │   ├── 📁 safety/              # 安全性関連（Phase 2.6）
│   │   │   ├── EmergencyDialog.tsx
│   │   │   ├── SafetyAlert.tsx
│   │   │   └── HelplineInfo.tsx
│   │   │
│   │   └── 📁 layout/              # レイアウトコンポーネント
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Sidebar.tsx
│   │       └── Navigation.tsx
│   │
│   ├── 📁 lib/                     # ユーティリティ・ライブラリ
│   │   ├── 📁 firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   └── admin.ts
│   │   │
│   │   ├── 📁 ai/                  # AI関連
│   │   │   ├── openai.ts
│   │   │   ├── gemini.ts
│   │   │   ├── claude.ts
│   │   │   ├── prompts.ts
│   │   │   └── token-counter.ts
│   │   │
│   │   ├── 📁 stripe/              # Stripe関連（Phase 2.3）
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── webhooks.ts
│   │   │
│   │   ├── 📁 safety/              # 安全性
│   │   │   ├── keywords.ts
│   │   │   ├── detector.ts
│   │   │   └── notifier.ts
│   │   │
│   │   ├── 📁 suggestions/         # メッセージ候補（Phase 2.5）
│   │   │   ├── suggestionEngine.ts
│   │   │   ├── rules.ts
│   │   │   └── analyzer.ts
│   │   │
│   │   ├── 📁 usage/               # 使用量管理（Phase 2.4）
│   │   │   ├── tokenCounter.ts
│   │   │   ├── limiter.ts
│   │   │   └── tracker.ts
│   │   │
│   │   └── 📁 utils/               # 汎用ユーティリティ
│   │       ├── constants.ts
│   │       ├── validators.ts
│   │       ├── formatters.ts
│   │       ├── helpers.ts
│   │       └── cn.ts               # classname utility
│   │
│   ├── 📁 hooks/                   # カスタムフック
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── useProfile.ts
│   │   ├── useChildren.ts
│   │   ├── useTokenUsage.ts
│   │   ├── useSafety.ts
│   │   ├── useSubscription.ts      # Phase 2.3
│   │   └── useSuggestions.ts       # Phase 2.5
│   │
│   ├── 📁 stores/                  # 状態管理（Zustand）
│   │   ├── authStore.ts
│   │   ├── chatStore.ts
│   │   ├── profileStore.ts
│   │   ├── usageStore.ts           # Phase 2.4
│   │   └── index.ts
│   │
│   ├── 📁 types/                   # 型定義
│   │   ├── index.ts                # メインエクスポート
│   │   ├── user.ts
│   │   ├── child.ts
│   │   ├── chat.ts
│   │   ├── usage.ts
│   │   ├── payment.ts              # Phase 2.3
│   │   ├── suggestion.ts           # Phase 2.5
│   │   ├── safety.ts
│   │   ├── api.ts
│   │   ├── state.ts
│   │   ├── forms.ts
│   │   └── constants.ts
│   │
│   ├── 📁 data/                    # 静的データ
│   │   ├── message-templates.ts    # Phase 2.5
│   │   ├── suggestion-rules.ts     # Phase 2.5
│   │   ├── safety-keywords.ts
│   │   └── plans.ts                # Phase 2.3
│   │
│   ├── 📁 styles/                  # スタイル
│   │   ├── globals.css
│   │   └── themes/
│   │       ├── junior.css
│   │       ├── middle.css
│   │       └── senior.css
│   │
│   └── 📁 middleware.ts            # Next.js Middleware（Phase 2.1）
│
├── 📁 public/                      # 静的ファイル
│   ├── favicon.ico
│   ├── logo.svg
│   ├── manabee.svg
│   ├── maintenance.html
│   ├── 📁 images/
│   │   ├── logo.svg
│   │   ├── manabee.svg
│   │   └── 📁 avatars/
│   │       ├── bear.svg
│   │       ├── rabbit.svg
│   │       ├── cat.svg
│   │       ├── dog.svg
│   │       ├── panda.svg
│   │       ├── lion.svg
│   │       ├── penguin.svg
│   │       └── fox.svg
│   └── 📁 sounds/
│       └── notification.mp3
│
├── 📁 scripts/                     # 運用スクリプト
│   ├── backup.ts
│   ├── restore.ts
│   ├── reset-tokens.ts
│   ├── check-limits.ts
│   └── test-safety.ts
│
└── 📁 tests/                       # テスト
├── 📁 unit/
│   ├── safety.test.ts
│   ├── token-counter.test.ts
│   └── suggestion-engine.test.ts
├── 📁 integration/
│   └── chat-flow.test.ts
└── 📁 e2e/
└── user-journey.test.ts

---

## 📋 ファイル命名規則

### コンポーネント
✅ Good: LoginForm.tsx, MessageBubble.tsx, ChildCard.tsx
❌ Bad:  loginForm.tsx, message-bubble.tsx, child_card.tsx
- **PascalCase**を使用
- ファイル名 = コンポーネント名

### ユーティリティ・関数
✅ Good: formatDate.ts, validateEmail.ts, cn.ts
❌ Bad:  FormatDate.ts, validate-email.ts, CN.ts
- **camelCase**を使用

### 定数ファイル
✅ Good: constants.ts, API_ROUTES.ts
❌ Bad:  CONSTANTS.ts, api-routes.ts
- 定数のみのファイルは **UPPER_SNAKE_CASE** も可

### API Routes
✅ Good: route.ts (Next.js App Router規約)
❌ Bad:  api.ts, handler.ts
- 必ず **route.ts** を使用

---

## 📦 インポート順序
```typescript
// 1. React / Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. 外部ライブラリ
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';

// 3. @/components
import { Button } from '@/components/ui/Button';
import { LoginForm } from '@/components/auth/LoginForm';

// 4. @/lib
import { auth } from '@/lib/firebase/config';
import { validateEmail } from '@/lib/utils/validators';

// 5. @/types
import type { User, LoginFormData } from '@/types';

// 6. 相対パス
import { helper } from './helper';
import styles from './styles.module.css';

🎯 Path Alias設定
tsconfig.json
json{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/data/*": ["./src/data/*"]
    }
  }
}
使用例
typescript// ❌ Bad: 相対パスが深い
import { Button } from '../../../components/ui/Button';

// ✅ Good: Path Aliasを使用
import { Button } from '@/components/ui/Button';

🗂️ コンポーネント配置ルール
1. 共通UIコンポーネント → components/ui/
tsx// components/ui/Button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}
使用例: すべてのページで再利用可能な汎用コンポーネント

2. 機能別コンポーネント → components/{feature}/
tsx// components/auth/LoginForm.tsx
export function LoginForm() {
  // ログイン専用のフォーム
}
使用例: 認証、チャット、プロファイルなど機能に特化したコンポーネント

3. ページ専用コンポーネント → そのページディレクトリ内
app/
├── dashboard/
│   ├── page.tsx
│   └── _components/        # ← アンダースコアで非公開
│       └── StatsCard.tsx
使用例: 特定のページでのみ使用し、再利用しないコンポーネント

📁 API Routes構造
RESTful設計
api/
├── auth/
│   ├── login/route.ts          # POST /api/auth/login
│   ├── signup/route.ts         # POST /api/auth/signup
│   └── logout/route.ts         # POST /api/auth/logout
│
├── children/
│   ├── route.ts                # GET /api/children (一覧)
│   │                           # POST /api/children (作成)
│   └── [id]/
│       └── route.ts            # GET /api/children/:id (取得)
│                               # PUT /api/children/:id (更新)
│                               # DELETE /api/children/:id (削除)
│
└── chat/
    ├── route.ts                # POST /api/chat (メッセージ送信)
    └── suggestions/
        └── route.ts            # GET /api/chat/suggestions (提案取得)
HTTPメソッドの使い分け
typescript// app/api/children/route.ts

// 一覧取得
export async function GET(request: Request) {
  // ...
}

// 新規作成
export async function POST(request: Request) {
  // ...
}

// app/api/children/[id]/route.ts

// 個別取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // ...
}

// 更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // ...
}

// 削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // ...
}

🎨 スタイル配置ルール
1. グローバルスタイル → app/globals.css
css/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --honey-yellow: #FFB300;
  /* ... */
}

2. コンポーネントスタイル → Tailwind CSS
tsx// ✅ Good: Tailwind Classを使用
<button className="bg-honey-yellow hover:bg-honey-yellow-dark px-6 py-3 rounded-lg">
  送信
</button>

// ❌ Bad: CSS Modulesは原則使用しない（特別な理由がない限り）

3. 年齢別テーマ → styles/themes/
css/* styles/themes/junior.css */
.junior {
  --base-font-size: 18px;
  --line-height: 1.75;
}
tsx// 使用例
<div className={ageGroup === 'junior' ? 'junior' : ''}>
  {/* ... */}
</div>

🔧 環境変数の管理
.env.local
bash# AI API Keys
GEMINI_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-api03-...

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=i-manabee-eba5c
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin (Server-side only)
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY=...

# Stripe (Phase 2.3)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development
使用方法
typescript// クライアント側（NEXT_PUBLIC_ プレフィックス必須）
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// サーバー側（API Routes, Server Components）
const secretKey = process.env.STRIPE_SECRET_KEY;

📊 データファイルの配置
静的データ → src/data/
typescript// src/data/message-templates.ts
export const MESSAGE_TEMPLATES = {
  math: {
    junior: ["🔢 たしざんのやりかたをおしえて！", ...],
    // ...
  },
  // ...
};

// src/data/plans.ts
export const PLANS = {
  free: {
    name: '無料プラン',
    price: 0,
    // ...
  },
  // ...
};

🧪 テストファイルの配置
ファイル名規則
component.tsx      → component.test.tsx
helper.ts          → helper.test.ts
suggestionEngine.ts → suggestionEngine.test.ts
配置場所
tests/
├── unit/                    # 単体テスト
│   ├── safety.test.ts
│   └── token-counter.test.ts
│
├── integration/             # 統合テスト
│   └── chat-flow.test.ts
│
└── e2e/                     # E2Eテスト
    └── user-journey.test.ts

🔄 フェーズ別の追加ファイル
Phase 2.1（認証）で追加
app/(auth)/                  # 認証ページグループ
components/auth/             # 認証コンポーネント
lib/firebase/auth.ts         # 認証ロジック
stores/authStore.ts          # 認証状態管理
middleware.ts                # 保護されたルート
Phase 2.2（マイページ）で追加
app/(dashboard)/             # ダッシュボードグループ
components/profile/          # プロファイルコンポーネント
components/dashboard/        # ダッシュボードコンポーネント
stores/profileStore.ts       # プロファイル状態管理
Phase 2.3（決済）で追加
app/pricing/                 # 料金プランページ
app/(dashboard)/billing/     # 請求情報ページ
components/payment/          # 決済コンポーネント
lib/stripe/                  # Stripe連携
Phase 2.5（チャット拡張）で追加
components/chat/MessageSuggestions.tsx
lib/suggestions/             # 提案エンジン
data/message-templates.ts    # メッセージテンプレート
data/suggestion-rules.ts     # 動的ルール

🎯 コード例
典型的なコンポーネント構造
tsx// src/components/auth/LoginForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import type { LoginFormData } from '@/types';
import { loginSchema } from '@/lib/utils/validators';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      setError('ログインに失敗しました');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      
      <Input
        {...register('email')}
        type="email"
        label="メールアドレス"
        error={errors.email?.message}
      />
      
      <Input
        {...register('password')}
        type="password"
        label="パスワード"
        error={errors.password?.message}
      />
      
      <Button type="submit" className="w-full">
        ログイン
      </Button>
    </form>
  );
}

典型的なAPI Route構造
typescript// src/app/api/children/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/firebase/admin';
import { db } from '@/lib/firebase/firestore';
import type { Child } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const user = await getAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // データ取得
    const children = await db
      .collection('children')
      .where('parentId', '==', user.uid)
      .get();
    
    const data: Child[] = children.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Child));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // バリデーション
    // ...
    
    // データ作成
    const docRef = await db.collection('children').add({
      ...body,
      parentId: user.uid,
      createdAt: new Date()
    });
    
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating child:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

📞 次のステップ

MESSAGE_TEMPLATES.md でメッセージ候補の詳細を確認
phases/PHASE2-1_AUTH.md で実装開始


最終更新: 2025-10-07
管理者: AsamiWorks

---