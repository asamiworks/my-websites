'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { InvoiceList } from '@/components/payment/InvoiceList';
import { PLANS } from '@/data/plans';
import type { Subscription } from '@/types/subscription';

export default function BillingPage() {
  const { user } = useAuthStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Firestoreからサブスクリプション情報を取得
    // 現在はモックデータで代用
    setTimeout(() => {
      if (user && user.plan !== 'free') {
        setSubscription({
          id: 'mock-subscription-id',
          userId: user.uid,
          plan: user.plan,
          status: 'active',
          currentPeriodStart: {
            seconds: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60,
            nanoseconds: 0,
          },
          currentPeriodEnd: {
            seconds: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
            nanoseconds: 0,
          },
          cancelAtPeriodEnd: false,
          stripeSubscriptionId: 'sub_mock123',
          stripeCustomerId: 'cus_mock123',
          stripePriceId: 'price_mock123',
          createdAt: {
            seconds: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60,
            nanoseconds: 0,
          },
          updatedAt: {
            seconds: Math.floor(Date.now() / 1000),
            nanoseconds: 0,
          },
        });
      }
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleManage = async () => {
    try {
      // Customer Portal Session作成
      const response = await fetch('/api/payment/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">請求情報</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">請求情報</h1>

      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">現在のプラン</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {currentPlan.name}
            </p>
            <p className="text-gray-600 mb-2">{currentPlan.priceLabel}</p>

            {subscription && (
              <p className="text-sm text-gray-500">
                次回更新日:{' '}
                {new Date(
                  typeof subscription.currentPeriodEnd === 'object'
                    ? subscription.currentPeriodEnd.seconds * 1000
                    : subscription.currentPeriodEnd
                ).toLocaleDateString('ja-JP')}
              </p>
            )}
          </div>

          {user.plan !== 'free' && (
            <Button onClick={handleManage}>プラン管理</Button>
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
              onClick={() => (window.location.href = '/pricing')}
            >
              プランを見る
            </Button>
          </div>
        )}
      </div>

      {/* Invoice History */}
      {user.plan !== 'free' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">請求履歴</h2>
          <InvoiceList />
        </div>
      )}
    </div>
  );
}