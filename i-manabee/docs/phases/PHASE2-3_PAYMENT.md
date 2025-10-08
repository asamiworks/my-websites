# 💳 Phase 2.3: 決済システム実装仕様

最終更新: 2025-10-07  
Version: 1.0.0  
実装期間: Week 4-5（2025-10-28 〜 2025-11-10）

---

## 📚 前提ドキュメント

**必読（Claude CODEはこれらを先に読むこと）**:
1. [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - UIコンポーネント
2. [TYPE_REFERENCE.md](../TYPE_REFERENCE.md) - Subscription, Invoice型
3. [DIRECTORY_STRUCTURE.md](../DIRECTORY_STRUCTURE.md) - ファイル配置
4. [PHASE2-2_MYPAGE.md](./PHASE2-2_MYPAGE.md) - マイページ（前提）

**参考資料**:
- [Stripe公式ドキュメント](https://stripe.com/docs)

---

## 🎯 このフェーズの目的

Stripeを使った決済システムを構築し、有料プランの提供を開始する。

### 達成目標
- [ ] Stripe Checkoutで決済ができる
- [ ] サブスクリプション管理ができる
- [ ] Customer Portalでプラン変更・キャンセルができる
- [ ] Webhook処理が動作する
- [ ] 請求履歴が見られる
- [ ] 初回登録7日以内の返金に対応

---

## ✅ 実装チェックリスト

### Week 4: Stripe基本統合（Day 22-28）

#### Day 22-23: Stripe設定
- [ ] Stripeアカウント作成（テストモード）
- [ ] Product/Price作成（4プラン）
- [ ] `lib/stripe/client.ts` 作成
- [ ] `lib/stripe/server.ts` 作成
- [ ] 環境変数設定

#### Day 24-25: 料金プランページ
- [ ] `app/pricing/page.tsx` 作成
- [ ] `components/payment/PlanCard.tsx` 作成
- [ ] `components/payment/PlanComparison.tsx` 作成
- [ ] プラン選択UI

#### Day 26-27: Checkout統合
- [ ] `app/api/payment/create-checkout/route.ts` 作成
- [ ] Stripe Checkout Session作成
- [ ] 成功・キャンセル時のリダイレクト
- [ ] Customer作成

#### Day 28: テスト・デバッグ
- [ ] テストカードで決済テスト
- [ ] エラーハンドリング確認

### Week 5: サブスクリプション管理（Day 29-35）

#### Day 29-30: Webhook処理
- [ ] `app/api/payment/webhook/route.ts` 作成
- [ ] `checkout.session.completed` イベント処理
- [ ] `customer.subscription.updated` イベント処理
- [ ] `customer.subscription.deleted` イベント処理
- [ ] `invoice.payment_succeeded` イベント処理
- [ ] `invoice.payment_failed` イベント処理

#### Day 31-32: Customer Portal
- [ ] `app/api/payment/portal/route.ts` 作成
- [ ] Customer Portal Session作成
- [ ] プラン変更・キャンセル対応

#### Day 33-34: 請求管理画面
- [ ] `app/(dashboard)/billing/page.tsx` 作成
- [ ] `components/payment/InvoiceList.tsx` 作成
- [ ] 現在のサブスクリプション表示
- [ ] 請求履歴表示
- [ ] 領収書ダウンロード

#### Day 35: 統合テスト
- [ ] 全決済フロー確認
- [ ] Webhook動作確認
- [ ] エラーケーステスト

---

## 🏗️ アーキテクチャ

### 決済フロー
ユーザーがプラン選択
↓
Checkout Session作成 (API)
↓
Stripe Checkout画面へリダイレクト
↓
決済情報入力・決済実行
↓
checkout.session.completed (Webhook)
↓
Firestoreにサブスクリプション保存
↓
成功ページへリダイレクト
↓
ダッシュボードでプラン反映

### Webhook処理フロー
Stripeからイベント送信
↓
署名検証
↓
イベントタイプ別処理
├─ checkout.session.completed
│   → サブスクリプション作成
│
├─ customer.subscription.updated
│   → プラン変更反映
│
├─ customer.subscription.deleted
│   → サブスクリプション削除
│
└─ invoice.payment_succeeded/failed
→ 請求記録作成

### ディレクトリ構成（新規作成分）
src/
├── app/
│   ├── pricing/
│   │   └── page.tsx                  ✨ 新規
│   │
│   ├── (dashboard)/
│   │   └── billing/
│   │       └── page.tsx              ✨ 新規
│   │
│   └── api/
│       └── payment/
│           ├── create-checkout/
│           │   └── route.ts          ✨ 新規
│           ├── portal/
│           │   └── route.ts          ✨ 新規
│           └── webhook/
│               └── route.ts          ✨ 新規
│
├── components/
│   └── payment/
│       ├── PlanCard.tsx              ✨ 新規
│       ├── PlanComparison.tsx        ✨ 新規
│       ├── PaymentForm.tsx           ✨ 新規
│       └── InvoiceList.tsx           ✨ 新規
│
├── lib/
│   └── stripe/
│       ├── client.ts                 ✨ 新規
│       ├── server.ts                 ✨ 新規
│       └── webhooks.ts               ✨ 新規
│
└── data/
└── plans.ts                      ✨ 新規

---

## 📱 画面仕様

### 1. 料金プランページ (`/pricing`)

#### UI要件
┌─────────────────────────────────────────────────────────┐
│  まなびーの料金プラン                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │無料      │ │キッズ    │ │フレンズ  │ │プレミアム││
│  │          │ │          │ │          │ │          ││
│  │  0円     │ │ 480円    │ │ 880円    │ │1,540円   ││
│  │  /月     │ │  /月     │ │  /月     │ │  /月     ││
│  │          │ │          │ │          │ │          ││
│  │5回/期    │ │無制限    │ │無制限    │ │無制限    ││
│  │1,000token│ │4,000token│ │8,000token│ │無制限    ││
│  │1人まで   │ │1人まで   │ │3人まで   │ │5人まで   ││
│  │          │ │          │ │          │ │          ││
│  │[無料開始]│ │[選択]    │ │[選択]    │ │[選択]    ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                         │
│  プラン比較表                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │機能          │無料│キッズ│フレンズ│プレミアム│   │
│  ├─────────────────────────────────────────────────┤   │
│  │メッセージ数  │ 5  │ ∞   │  ∞    │   ∞     │   │
│  │...                                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘

#### コード例

**`data/plans.ts`**
```typescript
import type { Plan } from '@/types';

export interface PlanDetails {
  id: Plan;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  features: string[];
  stripePriceId: string;  // Stripe Price ID
  popular?: boolean;
  maxChildren: number;
  messagesPerPeriod: number | 'unlimited';
  tokensPerPeriod: number | 'unlimited';
}

export const PLANS: Record<Plan, PlanDetails> = {
  free: {
    id: 'free',
    name: '無料プラン',
    price: 0,
    priceLabel: '0円 / 月',
    description: 'まずはお試しで使ってみたい方に',
    features: [
      '5回/期のメッセージ',
      '1,000トークン/期',
      '1人の子どもプロファイル',
      '基本的なAI機能',
      '安全性監視',
    ],
    stripePriceId: '', // 無料プランはStripe不要
    maxChildren: 1,
    messagesPerPeriod: 5,
    tokensPerPeriod: 1000,
  },
  
  kids: {
    id: 'kids',
    name: 'まなびーキッズ',
    price: 480,
    priceLabel: '480円 / 月',
    description: '小学3年生までのお子様向け',
    features: [
      '無制限メッセージ',
      '4,000トークン/期',
      '1人の子どもプロファイル',
      '教科別AI',
      '週次レポート（Phase 2.6）',
      '優先サポート',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_KIDS!,
    maxChildren: 1,
    messagesPerPeriod: 'unlimited',
    tokensPerPeriod: 4000,
  },
  
  friends: {
    id: 'friends',
    name: 'まなびーフレンズ',
    price: 880,
    priceLabel: '880円 / 月',
    description: 'ご家族で使いたい方に',
    popular: true,
    features: [
      '無制限メッセージ',
      '8,000トークン/期（家族共有）',
      '3人までの子どもプロファイル',
      '教科別AI',
      '週次レポート（Phase 2.6）',
      '優先サポート',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FRIENDS!,
    maxChildren: 3,
    messagesPerPeriod: 'unlimited',
    tokensPerPeriod: 8000,
  },
  
  premium: {
    id: 'premium',
    name: 'まなびープレミアム',
    price: 1540,
    priceLabel: '1,540円 / 月',
    description: '制限なく使いたい方に',
    features: [
      '無制限メッセージ',
      '無制限トークン',
      '5人までの子どもプロファイル',
      '最新の教科別AI',
      '詳細週次レポート（Phase 2.6）',
      '優先サポート',
      '新機能の先行アクセス',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM!,
    maxChildren: 5,
    messagesPerPeriod: 'unlimited',
    tokensPerPeriod: 'unlimited',
  },
};
app/pricing/page.tsx
tsximport { Metadata } from 'next';
import { PlanCard } from '@/components/payment/PlanCard';
import { PlanComparison } from '@/components/payment/PlanComparison';
import { PLANS } from '@/data/plans';

export const metadata: Metadata = {
  title: '料金プラン | i-manabee',
  description: 'まなびーの料金プランをご確認ください',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg-cream py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            まなびーの料金プラン
          </h1>
          <p className="text-xl text-gray-600">
            お子様の学びに合わせて、最適なプランをお選びください
          </p>
        </div>
        
        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Object.values(PLANS).map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
        
        {/* Comparison Table */}
        <PlanComparison />
        
        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            よくある質問
          </h2>
          
          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-medium text-gray-800 cursor-pointer">
                いつでもプラン変更・キャンセルできますか？
              </summary>
              <p className="mt-4 text-gray-600">
                はい、いつでも変更・キャンセルが可能です。プラン変更は即座に反映され、
                キャンセルは次回更新日まで継続してご利用いただけます。
              </p>
            </details>
            
            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-medium text-gray-800 cursor-pointer">
                返金はできますか？
              </summary>
              <p className="mt-4 text-gray-600">
                初回登録から7日以内であれば、全額返金いたします。
                それ以降は日割り計算での返金は行っておりません。
              </p>
            </details>
            
            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-medium text-gray-800 cursor-pointer">
                支払い方法は何がありますか？
              </summary>
              <p className="mt-4 text-gray-600">
                クレジットカード（Visa、Mastercard、American Express、JCB）に対応しています。
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
components/payment/PlanCard.tsx
tsx'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import type { PlanDetails } from '@/data/plans';

interface PlanCardProps {
  plan: PlanDetails;
}

export function PlanCard({ plan }: PlanCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const isCurrentPlan = user?.plan === plan.id;
  const isFree = plan.id === 'free';
  
  const handleSelect = async () => {
    if (!user) {
      router.push('/login?from=/pricing');
      return;
    }
    
    if (isFree || isCurrentPlan) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Checkout Session作成
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          plan: plan.id,
        }),
      });
      
      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div
      className={`
        relative bg-white rounded-lg shadow-lg overflow-hidden
        transition-transform hover:scale-105
        ${plan.popular ? 'ring-2 ring-honey-yellow' : ''}
      `}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-honey-yellow text-white px-4 py-1 text-sm font-bold">
          人気
        </div>
      )}
      
      <div className="p-6">
        {/* Plan Name */}
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {plan.name}
        </h3>
        
        {/* Price */}
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">
            {plan.price.toLocaleString()}円
          </span>
          <span className="text-gray-600"> / 月</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 mb-6">
          {plan.description}
        </p>
        
        {/* Features */}
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* Button */}
        <Button
          onClick={handleSelect}
          disabled={isLoading || isCurrentPlan}
          className="w-full"
          variant={plan.popular ? 'primary' : 'outline'}
        >
          {isCurrentPlan
            ? '現在のプラン'
            : isLoading
            ? '処理中...'
            : isFree
            ? '無料で始める'
            : 'このプランを選択'}
        </Button>
      </div>
    </div>
  );
}

2. 請求管理画面 (/billing)
UI要件
┌─────────────────────────────────────┐
│  請求情報                            │
├─────────────────────────────────────┤
│                                     │
│  現在のサブスクリプション            │
│  ┌─────────────────────────────┐   │
│  │ まなびーフレンズ             │   │
│  │ 880円 / 月                   │   │
│  │                              │   │
│  │ 次回更新日: 2025-11-07       │   │
│  │                              │   │
│  │ [プラン変更] [キャンセル]    │   │
│  └─────────────────────────────┘   │
│                                     │
│  請求履歴                            │
│  ┌─────────────────────────────┐   │
│  │ 2025-10-07  880円  [領収書]  │   │
│  │ 2025-09-07  880円  [領収書]  │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
コード例
app/(dashboard)/billing/page.tsx
tsx'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { InvoiceList } from '@/components/payment/InvoiceList';
import { PLANS } from '@/data/plans';
import type { Subscription } from '@/types';

export default function BillingPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // TODO: Firestoreからサブスクリプション情報を取得
    setLoading(false);
  }, [user]);
  
  const handleManage = async () => {
    try {
      // Customer Portal Session作成
      const response = await fetch('/api/payment/portal', {
        method: 'POST',
      });
      
      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to create portal session:', error);
      alert('エラーが発生しました');
    }
  };
  
  if (!user) return null;
  
  const currentPlan = PLANS[user.plan];
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        請求情報
      </h1>
      
      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          現在のプラン
        </h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {currentPlan.name}
            </p>
            <p className="text-gray-600 mb-2">
              {currentPlan.priceLabel}
            </p>
            
            {subscription && (
              <p className="text-sm text-gray-500">
                次回更新日: {new Date(subscription.currentPeriodEnd.seconds * 1000).toLocaleDateString('ja-JP')}
              </p>
            )}
          </div>
          
          {user.plan !== 'free' && (
            <Button onClick={handleManage}>
              プラン管理
            </Button>
          )}
        </div>
        
        {user.plan === 'free' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 有料プランにアップグレードして、もっとたくさん学習しませんか？
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => window.location.href = '/pricing'}
            >
              プランを見る
            </Button>
          </div>
        )}
      </div>
      
      {/* Invoice History */}
      {user.plan !== 'free' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            請求履歴
          </h2>
          <InvoiceList />
        </div>
      )}
    </div>
  );
}

🔧 Stripe統合
lib/stripe/server.ts
typescriptimport Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

/**
 * Checkout Session作成
 */
export async function createCheckoutSession(params: {
  customerId?: string;
  customerEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  return await stripe.checkout.sessions.create({
    customer: params.customerId,
    customer_email: params.customerId ? undefined : params.customerEmail,
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  });
}

/**
 * Customer Portal Session作成
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  return await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}

/**
 * Customer作成
 */
export async function createCustomer(params: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}) {
  return await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata,
  });
}

/**
 * Subscription取得
 */
export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Invoice一覧取得
 */
export async function getInvoices(customerId: string, limit: number = 10) {
  return await stripe.invoices.list({
    customer: customerId,
    limit,
  });
}

API Routes
app/api/payment/create-checkout/route.ts
typescriptimport { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/firebase/admin';
import { db } from '@/lib/firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { createCheckoutSession, createCustomer } from '@/lib/stripe/server';

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const user = await getAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { priceId, plan } = await request.json();
    
    // ユーザー情報取得
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Stripe Customer取得または作成
    let customerId = userData.payment?.stripeCustomerId;
    
    if (!customerId) {
      const customer = await createCustomer({
        email: user.email!,
        name: userData.displayName,
        metadata: {
          userId: user.uid,
        },
      });
      customerId = customer.id;
    }
    
    // Checkout Session作成
    const session = await createCheckoutSession({
      customerId,
      customerEmail: user.email!,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.uid,
        plan,
      },
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
app/api/payment/portal/route.ts
typescriptimport { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/firebase/admin';
import { db } from '@/lib/firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { createPortalSession } from '@/lib/stripe/server';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // ユーザー情報取得
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    
    const customerId = userData?.payment?.stripeCustomerId;
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }
    
    // Portal Session作成
    const session = await createPortalSession({
      customerId,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Portal session creation failed:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
app/api/payment/webhook/route.ts
typescriptimport { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { db } from '@/lib/firebase/admin';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    // 署名検証
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
  
  try {
    // イベントタイプ別処理
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;
  
  if (!userId || !plan) {
    throw new Error('Missing metadata');
  }
  
  // サブスクリプション情報を取得
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );
  
  // Firestoreに保存
  await db.collection('users').doc(userId).update({
    plan,
    'payment.stripeCustomerId': session.customer,
    'payment.subscriptionId': subscription.id,
    'payment.nextBillingDate': new Date(subscription.current_period_end * 1000),
  });
  
  // サブスクリプションドキュメント作成
  await db.collection('subscriptions').doc(subscription.id).set({
    userId,
    plan,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: session.customer,
    stripePriceId: subscription.items.data[0].price.id,
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // サブスクリプション情報を更新
  const subscriptionDoc = await db
    .collection('subscriptions')
    .doc(subscription.id)
    .get();
  
  if (!subscriptionDoc.exists) {
    return;
  }
  
  const data = subscriptionDoc.data();
  
  await db.collection('subscriptions').doc(subscription.id).update({
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: new Date(),
  });
  
  // ユーザー情報も更新
  await db.collection('users').doc(data.userId).update({
    'payment.nextBillingDate': new Date(subscription.current_period_end * 1000),
    'payment.cancelAtPeriodEnd': subscription.cancel_at_period_end,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // サブスクリプション削除時（キャンセル後の期限切れ）
  const subscriptionDoc = await db
    .collection('subscriptions')
    .doc(subscription.id)
    .get();
  
  if (!subscriptionDoc.exists) {
    return;
  }
  
  const data = subscriptionDoc.data();
  
  // プランを無料に戻す
  await db.collection('users').doc(data.userId).update({
    plan: 'free',
    'payment.subscriptionId': null,
  });
  
  await db.collection('subscriptions').doc(subscription.id).update({
    status: 'canceled',
    updatedAt: new Date(),
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // 請求成功時の処理
  console.log(`Invoice payment succeeded: ${invoice.id}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // 請求失敗時の処理（メール通知等）
  console.log(`Invoice payment failed: ${invoice.id}`);
}

🧪 テスト
Stripeテストカード
成功: 4242 4242 4242 4242
3Dセキュア必要: 4000 0025 0000 3155
拒否: 4000 0000 0000 0002
残高不足: 4000 0000 0000 9995

CVC: 任意の3桁
有効期限: 未来の日付
手動テストチェックリスト
Checkout

 プラン選択からCheckout画面へ遷移
 テストカードで決済成功
 成功後、/billing?success=true にリダイレクト
 Firestoreにサブスクリプション保存
 ユーザーのプランが更新される

Webhook

 checkout.session.completed イベント処理
 customer.subscription.updated イベント処理
 customer.subscription.deleted イベント処理

Customer Portal

 ポータル画面へ遷移
 プラン変更ができる
 キャンセルができる
 戻るボタンで/billingへ

請求管理

 現在のプラン表示
 次回更新日表示
 請求履歴表示


📝 Claude CODEへの指示
実装手順
Day 22-23: Stripe設定

Stripeアカウント作成
Product/Price作成
環境変数設定
lib/stripe/server.ts 実装

Day 24-25: 料金プランページ

data/plans.ts 作成
/pricing ページ作成
PlanCard コンポーネント

Day 26-27: Checkout統合

/api/payment/create-checkout 実装
決済フロー確認

Day 29-30: Webhook

/api/payment/webhook 実装
Webhook署名検証
イベント処理

Day 31-32: Customer Portal

/api/payment/portal 実装

Day 33-34: 請求管理

/billing ページ作成


🎯 完了基準

 決済が完了する
 Webhookが動作する
 プラン変更・キャンセルができる
 請求履歴が表示される
 すべてのテストが成功
 PROGRESS.md更新


最終更新: 2025-10-07
次のフェーズ: PHASE2-4_USAGE.md