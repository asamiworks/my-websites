# 🔐 Phase 2.1: 認証システム実装仕様

最終更新: 2025-10-07  
Version: 1.0.0  
実装期間: Week 1-2（2025-10-07 〜 2025-10-20）

---

## 📚 前提ドキュメント

**必読（Claude CODEはこれらを先に読むこと）**:
1. [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - UIコンポーネント、カラー、レイアウト
2. [TYPE_REFERENCE.md](../TYPE_REFERENCE.md) - User, AuthState等の型定義
3. [DIRECTORY_STRUCTURE.md](../DIRECTORY_STRUCTURE.md) - ファイル配置ルール

**参考資料**:
- [reference/FIREBASE_SETUP.md](../reference/FIREBASE_SETUP.md) - Firebase設定手順

---

## 🎯 このフェーズの目的

Firebase Authenticationを使った認証システムを構築し、Phase 2全体の基盤を作る。

### 達成目標
- [ ] 保護者がメール/パスワードでログインできる
- [ ] 新規登録ができる
- [ ] ログイン状態が保持される
- [ ] 保護されたルートにアクセス制御がかかる
- [ ] 基本的なダッシュボードが表示される

---

## ✅ 実装チェックリスト

### Week 1: 基本認証（Day 1-7）

#### Day 1-2: Firebase Auth設定
- [ ] Firebase プロジェクト確認
- [ ] Authentication有効化（メール/パスワード）
- [ ] `lib/firebase/auth.ts` 作成
- [ ] 認証ヘルパー関数実装

#### Day 3-4: ログイン画面
- [ ] `app/(auth)/login/page.tsx` 作成
- [ ] `components/auth/LoginForm.tsx` 作成
- [ ] `components/auth/AuthLayout.tsx` 作成
- [ ] フォームバリデーション（Zod）
- [ ] エラーハンドリング

#### Day 5-6: サインアップ画面
- [ ] `app/(auth)/signup/page.tsx` 作成
- [ ] `components/auth/SignupForm.tsx` 作成
- [ ] パスワード確認フィールド
- [ ] 利用規約同意チェックボックス
- [ ] Firestore にユーザードキュメント作成

#### Day 7: パスワードリセット
- [ ] `app/(auth)/forgot-password/page.tsx` 作成
- [ ] パスワードリセットメール送信

### Week 2: 状態管理と保護（Day 8-14）

#### Day 8-9: 状態管理（Zustand）
- [ ] `stores/authStore.ts` 作成
- [ ] ログイン/ログアウトアクション
- [ ] セッション永続化
- [ ] `hooks/useAuth.ts` 作成

#### Day 10-11: 保護されたルート
- [ ] `middleware.ts` 作成
- [ ] 未ログイン時のリダイレクト
- [ ] ログイン後のリダイレクト

#### Day 12-13: ダッシュボード
- [ ] `app/(dashboard)/dashboard/page.tsx` 作成
- [ ] `components/dashboard/StatsCard.tsx` 作成
- [ ] ユーザー情報表示
- [ ] ログアウトボタン

#### Day 14: テスト・バグ修正
- [ ] 全フロー動作確認
- [ ] エラーケーステスト
- [ ] バグ修正

---

## 🏗️ アーキテクチャ

### 認証フロー
┌─────────────┐
│   未ログイン  │
└──────┬──────┘
│
├→ /login ────→ Firebase Auth ─→ ログイン成功
│                                      ↓
├→ /signup ───→ Firebase Auth ─→ 新規登録成功
│                  ↓                   ↓
│            Firestore          authStore更新
│          (users作成)                 ↓
│                              /dashboard へ
│
└→ 保護されたページ ─→ middleware ─→ /login へリダイレクト

### ディレクトリ構成（新規作成分）
src/
├── app/
│   ├── (auth)/                      # 認証グループ
│   │   ├── login/
│   │   │   └── page.tsx            ✨ 新規
│   │   ├── signup/
│   │   │   └── page.tsx            ✨ 新規
│   │   ├── forgot-password/
│   │   │   └── page.tsx            ✨ 新規
│   │   └── layout.tsx              ✨ 新規
│   │
│   ├── (dashboard)/                 # ダッシュボードグループ
│   │   ├── dashboard/
│   │   │   └── page.tsx            ✨ 新規
│   │   └── layout.tsx              ✨ 新規
│   │
│   └── api/
│       └── auth/
│           └── session/
│               └── route.ts        ✨ 新規（オプション）
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx           ✨ 新規
│   │   ├── SignupForm.tsx          ✨ 新規
│   │   ├── ForgotPasswordForm.tsx  ✨ 新規
│   │   └── AuthLayout.tsx          ✨ 新規
│   │
│   └── dashboard/
│       ├── StatsCard.tsx           ✨ 新規
│       └── UserInfo.tsx            ✨ 新規
│
├── lib/
│   └── firebase/
│       └── auth.ts                 ✨ 新規
│
├── stores/
│   └── authStore.ts                ✨ 新規
│
├── hooks/
│   └── useAuth.ts                  ✨ 新規
│
└── middleware.ts                   ✨ 新規

---

## 📱 画面仕様

### 1. ログイン画面 (`/login`)

#### UI要件
┌─────────────────────────────────────┐
│                                     │
│          🐝 まなびー                │
│                                     │
│    まなびーにログイン                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ メールアドレス                │   │
│  │ [example@email.com        ] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ パスワード                    │   │
│  │ [••••••••••••••••         ] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      ログイン               │   │
│  └─────────────────────────────┘   │
│                                     │
│  パスワードを忘れた方はこちら         │
│                                     │
│  アカウントをお持ちでない方           │
│  新規登録はこちら                    │
│                                     │
└─────────────────────────────────────┘

#### コンポーネント構造
```tsx
<AuthLayout>
  <LoginForm>
    <Input type="email" />
    <Input type="password" />
    <Button type="submit" />
    <Link href="/forgot-password" />
    <Link href="/signup" />
  </LoginForm>
</AuthLayout>
完全なコード例
app/(auth)/login/page.tsx
tsximport { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'ログイン | i-manabee',
  description: 'まなびーにログインして、AIと一緒に学習しましょう',
};

export default function LoginPage() {
  return <LoginForm />;
}
components/auth/LoginForm.tsx
tsx'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/hooks/useAuth';

// バリデーションスキーマ
const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await login(data.email, data.password);
      
      // ログイン成功後、ダッシュボードへ
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Firebaseエラーメッセージを日本語化
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout
      title="まなびーにログイン"
      subtitle="AIと一緒に楽しく学習しましょう"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}
        
        <div className="space-y-4">
          <Input
            {...register('email')}
            type="email"
            label="メールアドレス"
            placeholder="example@email.com"
            error={errors.email?.message}
            disabled={isLoading}
          />
          
          <Input
            {...register('password')}
            type="password"
            label="パスワード"
            placeholder="パスワードを入力"
            error={errors.password?.message}
            disabled={isLoading}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </Button>
        
        <div className="text-center space-y-2">
          <Link
            href="/forgot-password"
            className="text-sm text-honey-yellow hover:underline"
          >
            パスワードを忘れた方はこちら
          </Link>
          
          <p className="text-sm text-gray-600">
            アカウントをお持ちでない方は{' '}
            <Link
              href="/signup"
              className="text-honey-yellow hover:underline font-medium"
            >
              新規登録
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

// Firebaseエラーメッセージを日本語化
function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません';
    case 'auth/user-disabled':
      return 'このアカウントは無効化されています';
    case 'auth/user-not-found':
      return 'メールアドレスまたはパスワードが正しくありません';
    case 'auth/wrong-password':
      return 'メールアドレスまたはパスワードが正しくありません';
    case 'auth/too-many-requests':
      return 'ログイン試行回数が多すぎます。しばらく待ってから再度お試しください';
    default:
      return 'ログインに失敗しました。もう一度お試しください';
  }
}
components/auth/AuthLayout.tsx
tsxinterface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* まなびー先生アイコン */}
          <div className="text-center mb-6">
            <div className="inline-block text-6xl mb-4 manabee-icon">
              🐝
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          
          {children}
        </div>
        
        {/* フッター */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            <Link href="/terms" className="hover:underline">
              利用規約
            </Link>
            {' · '}
            <Link href="/privacy" className="hover:underline">
              プライバシーポリシー
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

2. サインアップ画面 (/signup)
UI要件
追加フィールド:

表示名（オプション）
パスワード確認
利用規約同意チェックボックス
プライバシーポリシー同意チェックボックス

完全なコード例
app/(auth)/signup/page.tsx
tsximport { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: '新規登録 | i-manabee',
  description: 'まなびーのアカウントを作成して、AIと一緒に学習を始めましょう',
};

export default function SignupPage() {
  return <SignupForm />;
}
components/auth/SignupForm.tsx
tsx'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/hooks/useAuth';

// バリデーションスキーマ
const signupSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, '大文字を1文字以上含めてください')
    .regex(/[a-z]/, '小文字を1文字以上含めてください')
    .regex(/[0-9]/, '数字を1文字以上含めてください'),
  passwordConfirm: z.string(),
  displayName: z.string().optional(),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: '利用規約に同意してください' }),
  }),
  agreeToPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'プライバシーポリシーに同意してください' }),
  }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'パスワードが一致しません',
  path: ['passwordConfirm'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  
  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await signup({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      });
      
      // 登録成功後、ダッシュボードへ
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout
      title="新規登録"
      subtitle="まなびーのアカウントを作成"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}
        
        <div className="space-y-4">
          <Input
            {...register('email')}
            type="email"
            label="メールアドレス"
            placeholder="example@email.com"
            error={errors.email?.message}
            disabled={isLoading}
          />
          
          <Input
            {...register('displayName')}
            type="text"
            label="表示名（任意）"
            placeholder="山田 太郎"
            error={errors.displayName?.message}
            disabled={isLoading}
          />
          
          <Input
            {...register('password')}
            type="password"
            label="パスワード"
            placeholder="8文字以上、大小英字・数字を含む"
            error={errors.password?.message}
            disabled={isLoading}
          />
          
          <Input
            {...register('passwordConfirm')}
            type="password"
            label="パスワード（確認）"
            placeholder="もう一度入力してください"
            error={errors.passwordConfirm?.message}
            disabled={isLoading}
          />
          
          <div className="space-y-2">
            <label className="flex items-start gap-2">
              <input
                {...register('agreeToTerms')}
                type="checkbox"
                className="mt-1"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">
                <Link href="/terms" target="_blank" className="text-honey-yellow hover:underline">
                  利用規約
                </Link>
                に同意します
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-sm text-error-red">{errors.agreeToTerms.message}</p>
            )}
            
            <label className="flex items-start gap-2">
              <input
                {...register('agreeToPrivacy')}
                type="checkbox"
                className="mt-1"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">
                <Link href="/privacy" target="_blank" className="text-honey-yellow hover:underline">
                  プライバシーポリシー
                </Link>
                に同意します
              </span>
            </label>
            {errors.agreeToPrivacy && (
              <p className="text-sm text-error-red">{errors.agreeToPrivacy.message}</p>
            )}
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '登録中...' : 'アカウントを作成'}
        </Button>
        
        <p className="text-center text-sm text-gray-600">
          すでにアカウントをお持ちの方は{' '}
          <Link
            href="/login"
            className="text-honey-yellow hover:underline font-medium"
          >
            ログイン
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています';
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません';
    case 'auth/operation-not-allowed':
      return 'この操作は許可されていません';
    case 'auth/weak-password':
      return 'パスワードが弱すぎます';
    default:
      return '登録に失敗しました。もう一度お試しください';
  }
}

3. ダッシュボード画面 (/dashboard)
UI要件
┌─────────────────────────────────────┐
│  Header                    [ログアウト]│
├─────────────────────────────────────┤
│                                     │
│  こんにちは、〇〇さん！              │
│                                     │
│  ┌─────────┐ ┌─────────┐          │
│  │使用状況  │ │プラン    │          │
│  │ 20/100  │ │無料      │          │
│  └─────────┘ └─────────┘          │
│                                     │
│  クイックアクション                  │
│  ┌─────────────────────────────┐   │
│  │ チャットを始める             │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 子どもプロファイル管理       │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
完全なコード例
app/(dashboard)/layout.tsx
tsx'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="manabee-icon text-6xl mb-4">🐝</div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  
  return (
    <div className="min-h-screen bg-bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-3xl">🐝</span>
              <span className="text-xl font-bold text-gray-800">
                i-manabee
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
app/(dashboard)/dashboard/page.tsx
tsx'use client';

import { useAuth } from '@/hooks/useAuth';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          こんにちは、{user.displayName || 'まなびーユーザー'}さん！
        </h1>
        <p className="text-gray-600">
          今日も楽しく学習しましょう 🐝
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard
          title="使用状況"
          value="0 / ∞"
          description="今期のトークン使用量"
          icon="📊"
        />
        <StatsCard
          title="現在のプラン"
          value={getPlanName(user.plan)}
          description="アップグレードで更に便利に"
          icon="⭐"
        />
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          クイックアクション
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/chat">
            <Button className="w-full h-20 text-lg">
              🗨️ チャットを始める
            </Button>
          </Link>
          <Link href="/children">
            <Button variant="outline" className="w-full h-20 text-lg">
              👨‍👩‍👧‍👦 子どもプロファイル管理
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function getPlanName(plan: string): string {
  switch (plan) {
    case 'free':
      return '無料プラン';
    case 'kids':
      return 'まなびーキッズ';
    case 'friends':
      return 'まなびーフレンズ';
    case 'premium':
      return 'まなびープレミアム';
    default:
      return '無料プラン';
  }
}
components/dashboard/StatsCard.tsx
tsxinterface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
}

export function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}

🔧 Firebase Auth設定
lib/firebase/config.ts (既存)
既に設定済みのため変更不要。
lib/firebase/auth.ts (新規作成)
typescriptimport {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { User } from '@/types';

/**
 * 新規ユーザー登録
 */
export async function registerUser(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  // Firebase Authにユーザー作成
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  
  const firebaseUser = userCredential.user;
  
  // 表示名を設定
  if (displayName) {
    await updateProfile(firebaseUser, { displayName });
  }
  
  // Firestoreにユーザードキュメント作成
  const user: Omit<User, 'id'> = {
    email: firebaseUser.email!,
    displayName: displayName,
    plan: 'free',
    createdAt: serverTimestamp() as any,
    lastLogin: serverTimestamp() as any,
    consents: {
      terms: {
        accepted: true,
        timestamp: serverTimestamp() as any,
        version: '1.0.0',
      },
      privacy: {
        accepted: true,
        timestamp: serverTimestamp() as any,
        version: '1.0.0',
      },
    },
    settings: {
      emailNotifications: true,
      weeklyReports: false,
      safetyAlerts: true,
    },
  };
  
  await setDoc(doc(db, 'users', firebaseUser.uid), user);
  
  return {
    id: firebaseUser.uid,
    ...user,
  } as User;
}

/**
 * ログイン
 */
export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  
  const firebaseUser = userCredential.user;
  
  // 最終ログイン時刻を更新
  await setDoc(
    doc(db, 'users', firebaseUser.uid),
    {
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );
  
  // Firestoreからユーザー情報を取得
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  
  if (!userDoc.exists()) {
    throw new Error('ユーザー情報が見つかりません');
  }
  
  return {
    id: firebaseUser.uid,
    ...userDoc.data(),
  } as User;
}

/**
 * ログアウト
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * パスワードリセットメール送信
 */
export async function sendResetEmail(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * 現在のユーザー情報を取得
 */
export async function getCurrentUser(
  firebaseUser: FirebaseUser
): Promise<User | null> {
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  
  if (!userDoc.exists()) {
    return null;
  }
  
  return {
    id: firebaseUser.uid,
    ...userDoc.data(),
  } as User;
}

🗄️ 状態管理（Zustand）
stores/authStore.ts
typescriptimport { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from '@/lib/firebase/auth';
import type { User } from '@/types';

interface SignupData {
  email: string;
  password: string;
  displayName?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  signup: (data: SignupData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,
      
      signup: async (data) => {
        try {
          set({ loading: true, error: null });
          const user = await registerUser(
            data.email,
            data.password,
            data.displayName
          );
          set({ user, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const user = await loginUser(email, password);
          set({ user, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      logout: async () => {
        try {
          await logoutUser();
          set({ user: null, loading: false, error: null });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },
      
      checkAuth: () => {
        set({ loading: true });
        
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const user = await getCurrentUser(firebaseUser);
              set({ user, loading: false });
            } catch (error) {
              console.error('Failed to get user data:', error);
              set({ user: null, loading: false });
            }
          } else {
            set({ user: null, loading: false });
          }
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
hooks/useAuth.ts
typescript'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const store = useAuthStore();
  
  useEffect(() => {
    store.checkAuth();
  }, []);
  
  return store;
}

🛡️ 保護されたルート（Middleware）
middleware.ts
typescriptimport { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 認証が必要なパス
  const protectedPaths = [
    '/dashboard',
    '/children',
    '/profile',
    '/usage',
    '/billing',
    '/settings',
  ];
  
  // 認証済みユーザーがアクセスすべきでないパス
  const authPaths = ['/login', '/signup'];
  
  // Zustandのストレージからユーザー情報を取得
  const authStorage = request.cookies.get('auth-storage')?.value;
  let isAuthenticated = false;
  
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      isAuthenticated = !!parsed.state?.user;
    } catch (error) {
      console.error('Failed to parse auth storage:', error);
    }
  }
  
  // 保護されたパスへの未認証アクセス
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // 認証済みユーザーの認証ページへのアクセス
  if (authPaths.some(path => pathname.startsWith(path))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/children/:path*',
    '/profile/:path*',
    '/usage/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
  ],
};

🧪 テスト
手動テストチェックリスト
ログイン機能

 正しいメールアドレスとパスワードでログインできる
 間違ったパスワードでログインできない
 存在しないメールアドレスでログインできない
 ログイン後、ダッシュボードにリダイレクトされる

サインアップ機能

 新規アカウントを作成できる
 既に使用中のメールアドレスで登録できない
 パスワードが弱いとエラーが表示される
 パスワード確認が一致しないとエラーが表示される
 利用規約に同意しないと登録できない
 登録後、Firestoreにユーザードキュメントが作成される

保護されたルート

 未ログインで /dashboard にアクセスすると /login にリダイレクトされる
 ログイン後、/login にアクセスすると /dashboard にリダイレクトされる
 ログアウト後、保護されたページにアクセスできない

ダッシュボード

 ユーザー情報が正しく表示される
 ログアウトボタンが機能する
 ログアウト後、/login にリダイレクトされる


📝 Claude CODEへの指示
実装手順
ステップ1: Firebase Auth設定（Day 1-2）

Firebase Consoleで Authentication を有効化（メール/パスワード）
lib/firebase/auth.ts を作成
認証ヘルパー関数を実装
テスト: Firebase Admin SDKで動作確認

ステップ2: ログイン画面（Day 3-4）

app/(auth)/layout.tsx を作成
components/auth/AuthLayout.tsx を作成
app/(auth)/login/page.tsx を作成
components/auth/LoginForm.tsx を作成
テスト: ログインフローを手動確認

ステップ3: サインアップ画面（Day 5-6）

app/(auth)/signup/page.tsx を作成
components/auth/SignupForm.tsx を作成
Firestoreへのユーザードキュメント作成を実装
テスト: 新規登録〜ダッシュボード表示まで確認

ステップ4: 状態管理（Day 8-9）

stores/authStore.ts を作成
hooks/useAuth.ts を作成
各コンポーネントで useAuth フックを使用
テスト: リロード後もログイン状態が保持されるか確認

ステップ5: Middleware（Day 10-11）

middleware.ts を作成
保護されたルートの設定
テスト: 未ログイン時のリダイレクト確認

ステップ6: ダッシュボード（Day 12-13）

app/(dashboard)/layout.tsx を作成
app/(dashboard)/dashboard/page.tsx を作成
components/dashboard/StatsCard.tsx を作成
テスト: ダッシュボードの表示確認

ステップ7: 最終確認（Day 14）

全フローのテスト
エラーハンドリングの確認
バグ修正
PROGRESS.md更新

注意事項

型定義: TYPE_REFERENCE.mdの型を必ず使用
UIスタイル: DESIGN_SYSTEM.mdのスタイルに従う
ファイル配置: DIRECTORY_STRUCTURE.mdの規則に従う
エラーハンドリング: すべてのFirebaseエラーを日本語化
セキュリティ: パスワードは必ずバリデーション


🎯 完了基準
以下がすべて達成されたら Phase 2.1 完了：

 ログイン/サインアップが動作する
 ログイン状態が保持される
 保護されたルートが機能する
 ダッシュボードが表示される
 すべての手動テストが成功する
 PROGRESS.md が更新されている


最終更新: 2025-10-07
次のフェーズ: PHASE2-2_MYPAGE.md