'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import type { PlanDetails } from '@/data/plans';

interface PlanCardProps {
  plan: PlanDetails;
}

export function PlanCard({ plan }: PlanCardProps) {
  const router = useRouter();
  const { user } = useAuthStore();
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

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

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
        ${plan.popular ? 'ring-2 ring-yellow-400' : ''}
      `}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-white px-4 py-1 text-sm font-bold">
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
          className={`w-full ${
            plan.popular
              ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-800'
              : ''
          }`}
          variant={plan.popular ? 'default' : 'outline'}
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