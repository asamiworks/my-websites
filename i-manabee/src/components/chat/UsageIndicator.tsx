import React from 'react';
import { Button, Card } from '@/components/ui';
import type { UsageStats } from '@/lib/ai/tokenCounter';
import { formatUsageStats, PLAN_LIMITS } from '@/lib/ai/tokenCounter';

interface UsageIndicatorProps {
  stats: UsageStats | null;
  plan: string;
  ageGroup: 'junior' | 'middle' | 'senior';
  compact?: boolean;
  showUpgrade?: boolean;
  onUpgrade?: () => void;
}

export const UsageIndicator: React.FC<UsageIndicatorProps> = ({
  stats,
  plan,
  ageGroup,
  compact = false,
  showUpgrade = false,
  onUpgrade
}) => {
  if (!stats) {
    return null;
  }

  const formatted = formatUsageStats(stats, plan);
  const limits = PLAN_LIMITS[plan];
  const isJunior = ageGroup === 'junior';

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-error-red';
    if (percentage >= 75) return 'bg-warning-yellow';
    return 'bg-honey-yellow';
  };

  const getPlanColor = () => {
    switch (plan) {
      case 'kids': return 'text-kids-blue border-kids-blue';
      case 'friends': return 'text-friends-purple border-friends-purple';
      case 'premium': return 'text-premium-gold border-premium-gold';
      default: return 'text-free-gray border-free-gray';
    }
  };

  const getPlanName = () => {
    switch (plan) {
      case 'kids': return 'まなびーキッズ';
      case 'friends': return 'まなびーフレンズ';
      case 'premium': return 'まなびープレミアム';
      default: return 'フリープラン';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-4 text-sm">
        {/* 今日のメッセージ数 */}
        <div className="flex items-center space-x-2">
          <span className="text-text-sub">
            {isJunior ? 'きょうのしつもん:' : '今日:'}
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getProgressColor(formatted.messagesProgress.percentage)}`}
                style={{ width: `${Math.min(formatted.messagesProgress.percentage, 100)}%` }}
              />
            </div>
            <span className="text-xs text-text-sub">
              {formatted.messagesProgress.used}/{formatted.messagesProgress.total}
            </span>
          </div>
        </div>

        {/* 月間トークン */}
        <div className="flex items-center space-x-2">
          <span className="text-text-sub">
            {isJunior ? 'こんげつ:' : '月間:'}
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getProgressColor(formatted.monthlyProgress.percentage)}`}
                style={{ width: `${Math.min(formatted.monthlyProgress.percentage, 100)}%` }}
              />
            </div>
            <span className="text-xs text-text-sub">
              {Math.round(formatted.monthlyProgress.percentage)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-main flex items-center">
          <span className="mr-2">📊</span>
          {isJunior ? 'つかったりょう' : '利用状況'}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${getPlanColor()}`}>
          {getPlanName()}
        </span>
      </div>

      <div className="space-y-4">
        {/* 今日のメッセージ数 */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-sub">
              {isJunior ? 'きょうのしつもん' : '今日のメッセージ'}
            </span>
            <span className="text-text-main font-medium">
              {formatted.messagesProgress.used} / {formatted.messagesProgress.total}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor(formatted.messagesProgress.percentage)}`}
              style={{ width: `${Math.min(formatted.messagesProgress.percentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-text-sub mt-1">
            {formatted.messagesProgress.percentage}% 使用済み
          </div>
        </div>

        {/* 今日のトークン */}
        {!isJunior && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-sub">今日のトークン</span>
              <span className="text-text-main font-medium">
                {formatted.dailyProgress.used.toLocaleString()} / {formatted.dailyProgress.total.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getProgressColor(formatted.dailyProgress.percentage)}`}
                style={{ width: `${Math.min(formatted.dailyProgress.percentage, 100)}%` }}
              />
            </div>
            <div className="text-xs text-text-sub mt-1">
              {formatted.dailyProgress.percentage}% 使用済み
            </div>
          </div>
        )}

        {/* 月間の使用状況 */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-sub">
              {isJunior ? 'こんげつのつかいかた' : '月間使用量'}
            </span>
            <span className="text-text-main font-medium">
              {formatted.monthlyProgress.percentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor(formatted.monthlyProgress.percentage)}`}
              style={{ width: `${Math.min(formatted.monthlyProgress.percentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-text-sub mt-1">
            {isJunior
              ? `${Math.round(formatted.monthlyProgress.used / 1000)}K / ${Math.round(formatted.monthlyProgress.total / 1000)}K`
              : `${formatted.monthlyProgress.used.toLocaleString()} / ${formatted.monthlyProgress.total.toLocaleString()} トークン`
            }
          </div>
        </div>

        {/* コスト情報（親向け）*/}
        {!isJunior && plan !== 'free' && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between text-xs">
              <span className="text-text-sub">今日のコスト:</span>
              <span className="text-text-main">{formatted.costFormatted.today}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-text-sub">月間コスト:</span>
              <span className="text-text-main">{formatted.costFormatted.monthly}</span>
            </div>
          </div>
        )}

        {/* アップグレード推奨 */}
        {showUpgrade && onUpgrade && formatted.monthlyProgress.percentage >= 75 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-text-sub mb-2">
                {isJunior
                  ? 'たくさんおべんきょうしているね！'
                  : '利用量が上限に近づいています'
                }
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onUpgrade}
                className="text-honey-yellow border-honey-yellow hover:bg-honey-yellow hover:text-white"
              >
                {isJunior ? 'おうちのひとにきいてみる' : 'プランをアップグレード'}
              </Button>
            </div>
          </div>
        )}

        {/* リセット時刻の表示 */}
        <div className="pt-2 text-xs text-text-sub text-center">
          {isJunior
            ? 'あした 0じ にリセットされるよ'
            : '制限は毎日 0:00 にリセットされます'
          }
        </div>
      </div>
    </Card>
  );
};

export default UsageIndicator;