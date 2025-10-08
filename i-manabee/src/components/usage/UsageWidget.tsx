'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { UsageStats } from '@/types/usage';

interface UsageWidgetProps {
  compact?: boolean;
  showDetails?: boolean;
}

export function UsageWidget({ compact = false, showDetails = true }: UsageWidgetProps) {
  const { user } = useAuthStore();
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchUsage = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/usage/stats', {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('使用状況の取得に失敗しました');
        }

        const data = await response.json();
        setUsage(data);
      } catch (err: any) {
        console.error('使用状況取得エラー:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();

    // 5分ごとに更新
    const interval = setInterval(fetchUsage, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border ${compact ? 'p-3' : 'p-4'}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !usage) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border ${compact ? 'p-3' : 'p-4'}`}>
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-sm">{error || 'データを読み込めませんでした'}</p>
        </div>
      </div>
    );
  }

  const getUsagePercentage = (used: number, limit: number | 'unlimited'): number => {
    if (limit === 'unlimited') return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  const getTimeUntilReset = (resetTime: Date): string => {
    const now = new Date();
    const reset = new Date(resetTime);
    const diff = reset.getTime() - now.getTime();

    if (diff < 0) return 'リセット済み';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}時間${minutes > 0 ? minutes + '分' : ''}後`;
    } else if (minutes > 0) {
      return `${minutes}分後`;
    } else {
      return '1分未満';
    }
  };

  const messagePercentage = getUsagePercentage(
    usage.currentPeriod.messages,
    usage.remaining.messages === 'unlimited' ? 'unlimited' : usage.currentPeriod.messages + (usage.remaining.messages as number)
  );

  const tokenPercentage = getUsagePercentage(
    usage.currentPeriod.tokens,
    usage.remaining.tokens === 'unlimited' ? 'unlimited' : usage.currentPeriod.tokens + (usage.remaining.tokens as number)
  );

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">使用状況</h3>
          <span className="text-xs text-gray-500">
            {getTimeUntilReset(usage.resetTime)}でリセット
          </span>
        </div>

        <div className="space-y-2">
          {/* メッセージ数 */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>メッセージ</span>
              <span>
                {usage.currentPeriod.messages} / {usage.remaining.messages === 'unlimited' ? '∞' :
                  (usage.currentPeriod.messages + (usage.remaining.messages as number))}
              </span>
            </div>
            {usage.remaining.messages !== 'unlimited' && (
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    messagePercentage >= 90 ? 'bg-red-500' :
                    messagePercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${messagePercentage}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* トークン数 */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>トークン</span>
              <span>
                {usage.currentPeriod.tokens.toLocaleString()} / {usage.remaining.tokens === 'unlimited' ? '∞' :
                  (usage.currentPeriod.tokens + (usage.remaining.tokens as number)).toLocaleString()}
              </span>
            </div>
            {usage.remaining.tokens !== 'unlimited' && (
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    tokenPercentage >= 90 ? 'bg-red-500' :
                    tokenPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${tokenPercentage}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">現在の使用状況</h2>
        <span className="text-sm text-gray-500">
          {getTimeUntilReset(usage.resetTime)}でリセット
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* メッセージ数 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">メッセージ数</h3>
            <span className="text-lg font-bold text-gray-900">
              {usage.currentPeriod.messages}
            </span>
          </div>

          {usage.remaining.messages !== 'unlimited' ? (
            <>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    messagePercentage >= 90 ? 'bg-red-500' :
                    messagePercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${messagePercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>{messagePercentage}% 使用済み</span>
                <span>残り {usage.remaining.messages} 件</span>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-2xl text-green-500 mb-1">∞</div>
              <span className="text-sm text-gray-600">無制限</span>
            </div>
          )}
        </div>

        {/* トークン数 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">トークン数</h3>
            <span className="text-lg font-bold text-gray-900">
              {usage.currentPeriod.tokens.toLocaleString()}
            </span>
          </div>

          {usage.remaining.tokens !== 'unlimited' ? (
            <>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    tokenPercentage >= 90 ? 'bg-red-500' :
                    tokenPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${tokenPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>{tokenPercentage}% 使用済み</span>
                <span>残り {(usage.remaining.tokens as number).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-2xl text-green-500 mb-1">∞</div>
              <span className="text-sm text-gray-600">無制限</span>
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">今日の合計</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {usage.dailyTotal.totalMessages}
              </div>
              <div className="text-xs text-gray-600">メッセージ</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-green-600">
                {usage.dailyTotal.totalTokens.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">トークン</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-purple-600">
                ¥{usage.dailyTotal.apiCost.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">コスト</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Object.values(usage.dailyTotal.subjectBreakdown).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-xs text-gray-600">教科数</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}