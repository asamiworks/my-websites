import type { Plan } from '@/types/user';

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
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_KIDS || 'price_test_kids',
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
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FRIENDS || 'price_test_friends',
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
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM || 'price_test_premium',
    maxChildren: 5,
    messagesPerPeriod: 'unlimited',
    tokensPerPeriod: 'unlimited',
  },
};

export const PLAN_FEATURES = [
  {
    feature: 'メッセージ数',
    free: '5回/期',
    kids: '無制限',
    friends: '無制限',
    premium: '無制限',
  },
  {
    feature: 'トークン数',
    free: '1,000/期',
    kids: '4,000/期',
    friends: '8,000/期',
    premium: '無制限',
  },
  {
    feature: 'プロファイル数',
    free: '1人',
    kids: '1人',
    friends: '3人',
    premium: '5人',
  },
  {
    feature: 'AI機能',
    free: '基本',
    kids: '教科別',
    friends: '教科別',
    premium: '最新版',
  },
  {
    feature: '週次レポート',
    free: '❌',
    kids: '✅',
    friends: '✅',
    premium: '詳細版',
  },
  {
    feature: 'サポート',
    free: '標準',
    kids: '優先',
    friends: '優先',
    premium: '優先',
  },
];