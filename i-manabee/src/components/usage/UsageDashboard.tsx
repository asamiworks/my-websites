'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { UsageWidget } from './UsageWidget';
import type { Usage, UsageStats } from '@/types/usage';

interface UsageDashboardProps {
  childId?: string;
}

export function UsageDashboard({ childId }: UsageDashboardProps) {
  const { user } = useAuthStore();
  const [usageHistory, setUsageHistory] = useState<Usage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    if (!user) return;

    const fetchUsageHistory = async () => {
      try {
        setLoading(true);

        // 期間の設定
        const endDate = new Date();
        const startDate = new Date();
        if (selectedPeriod === 'week') {
          startDate.setDate(endDate.getDate() - 7);
        } else {
          startDate.setDate(endDate.getDate() - 30);
        }

        const response = await fetch(
          `/api/usage/history?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}${childId ? `&childId=${childId}` : ''}`,
          {
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsageHistory(data);
        }
      } catch (error) {
        console.error('使用履歴取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageHistory();
  }, [user, selectedPeriod, childId]);

  const calculateTotals = () => {
    return usageHistory.reduce(
      (totals, usage) => ({
        messages: totals.messages + usage.dailyTotal.totalMessages,
        tokens: totals.tokens + usage.dailyTotal.totalTokens,
        cost: totals.cost + usage.dailyTotal.apiCost,
      }),
      { messages: 0, tokens: 0, cost: 0 }
    );
  };

  const getSubjectBreakdown = () => {
    const breakdown = usageHistory.reduce((acc, usage) => {
      Object.entries(usage.dailyTotal.subjectBreakdown).forEach(([subject, count]) => {
        acc[subject] = (acc[subject] || 0) + count;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(breakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // トップ5
  };

  const totals = calculateTotals();
  const subjectBreakdown = getSubjectBreakdown();

  const subjectLabels: Record<string, string> = {
    math: '算数・数学',
    japanese: '国語',
    english: '英語',
    science: '理科',
    social: '社会',
    programming: 'プログラミング',
    counseling: '相談・悩み',
    general: 'その他',
  };

  return (
    <div className="space-y-6">
      {/* 現在の使用状況 */}
      <UsageWidget showDetails={true} />

      {/* 期間選択 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">使用履歴</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedPeriod === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              過去7日間
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedPeriod === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              過去30日間
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* 統計サマリー */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {totals.messages}
                </div>
                <div className="text-sm text-blue-700">合計メッセージ数</div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {totals.tokens.toLocaleString()}
                </div>
                <div className="text-sm text-green-700">合計トークン数</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  ¥{totals.cost.toFixed(2)}
                </div>
                <div className="text-sm text-purple-700">合計コスト</div>
              </div>
            </div>

            {/* 教科別内訳 */}
            {subjectBreakdown.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">
                  よく学習している教科
                </h3>
                <div className="space-y-2">
                  {subjectBreakdown.map(([subject, count]) => {
                    const percentage = Math.round((count / totals.messages) * 100);
                    return (
                      <div key={subject} className="flex items-center">
                        <div className="w-20 text-sm text-gray-600 flex-shrink-0">
                          {subjectLabels[subject] || subject}
                        </div>
                        <div className="flex-1 mx-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 text-sm text-gray-600 text-right">
                          {count}件 ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 日別履歴 */}
            {usageHistory.length > 0 ? (
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-3">日別使用状況</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {usageHistory.map((usage) => (
                    <div
                      key={usage.date}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(usage.date).toLocaleDateString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                            weekday: 'short',
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          朝: {usage.periods.morning.messages}件 /
                          夜: {usage.periods.evening.messages}件
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {usage.dailyTotal.totalMessages}件
                        </div>
                        <div className="text-sm text-gray-600">
                          {usage.dailyTotal.totalTokens.toLocaleString()}トークン
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-600">
                  {selectedPeriod === 'week' ? '過去7日間' : '過去30日間'}の使用履歴がありません
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}