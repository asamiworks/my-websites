// メッセージ入力コンポーネント（ブラウザ対応版）
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui';
import { Send, Loader2 } from 'lucide-react';
// TODO: Create clientTokenEstimator or remove these features
// import {
//   validateMessageLengthClient,
//   getMessageLengthVisualization,
//   estimateTokensFromText
// } from '@/lib/ai/clientTokenEstimator';
import type { UsageStats } from '@/lib/ai/tokenCounter';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  plan: string;
  ageGroup: 'junior' | 'middle' | 'senior';
  usageStats?: UsageStats | null;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  isLoading,
  disabled = false,
  placeholder,
  maxLength = 1000,
  plan,
  ageGroup,
  usageStats,
  className = ''
}) => {
  const [message, setMessage] = useState('');
  const [showLengthIndicator, setShowLengthIndicator] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isJunior = ageGroup === 'junior';

  // テキストエリアの高さを自動調整
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  // メッセージ長チェック
  // Simplified validation for now
  const lengthValidation = { isValid: message.length <= maxLength, maxLength };
  const lengthVisualization = {
    remainingChars: maxLength - message.length,
    isOverLimit: message.length > maxLength
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading || disabled || !lengthValidation.isValid) {
      return;
    }

    onSend(message.trim());
    setMessage('');
    setShowLengthIndicator(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // 長さインジケータの表示制御
    setShowLengthIndicator(value.length > 50);
  };

  const getPlaceholderText = () => {
    if (placeholder) return placeholder;

    return isJunior
      ? 'なにかしつもんしてみてね！'
      : 'メッセージを入力してください...';
  };

  const getProgressColor = () => {
    switch (lengthVisualization.color) {
      case 'red': return 'bg-error-red';
      case 'yellow': return 'bg-warning-yellow';
      default: return 'bg-honey-yellow';
    }
  };

  const canSend = message.trim().length > 0 &&
                  !isLoading &&
                  !disabled &&
                  lengthValidation.isValid;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* 長さインジケータ */}
      {showLengthIndicator && (
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-text-sub">
              {isJunior
                ? `もじかず: ${lengthValidation.charactersUsed}`
                : `文字数: ${lengthValidation.charactersUsed} / 推定トークン: ${lengthValidation.estimatedTokens}`
              }
            </span>
            {lengthVisualization.message && (
              <span className={`font-medium ${
                lengthVisualization.color === 'red' ? 'text-error-red' :
                lengthVisualization.color === 'yellow' ? 'text-warning-yellow' :
                'text-honey-yellow'
              }`}>
                {lengthVisualization.message}
              </span>
            )}
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(lengthVisualization.percentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* メッセージ入力エリア */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholderText()}
              disabled={disabled || isLoading}
              className={`w-full px-3 py-2 border border-gray-200 rounded-lg resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-honey-yellow focus:border-transparent ${
                disabled || isLoading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              } ${
                lengthValidation.warning ? 'border-warning-yellow' : ''
              } ${
                !lengthValidation.isValid ? 'border-error-red' : ''
              }`}
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />

            {/* 文字数カウンター（小さく表示） */}
            {message.length > 0 && (
              <div className="absolute bottom-1 right-1 text-xs text-text-sub bg-white/80 px-1 rounded">
                {message.length}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!canSend}
            variant={canSend ? 'primary' : 'outline'}
            size="sm"
            className={`shrink-0 h-11 px-4 ${
              isJunior
                ? 'bg-kids-blue hover:bg-kids-blue/90'
                : 'bg-honey-yellow hover:bg-honey-yellow/90'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* エラーメッセージ */}
        {lengthValidation.warning && (
          <div className="mt-2 text-sm text-warning-yellow">
            {lengthValidation.warning}
          </div>
        )}

        {/* ヒントメッセージ */}
        {!lengthValidation.warning && message.length === 0 && (
          <div className="mt-2 text-xs text-text-sub">
            {isJunior
              ? '💡 わからないことがあったら、きがるにきいてね！'
              : '💡 Enterで送信、Shift+Enterで改行できます'
            }
          </div>
        )}

        {/* 使用量警告 */}
        {usageStats && (
          <UsageWarning stats={usageStats} plan={plan} ageGroup={ageGroup} />
        )}
      </form>
    </div>
  );
};

// 使用量警告コンポーネント
interface UsageWarningProps {
  stats: UsageStats;
  plan: string;
  ageGroup: 'junior' | 'middle' | 'senior';
}

const UsageWarning: React.FC<UsageWarningProps> = ({ stats, plan, ageGroup }) => {
  const isJunior = ageGroup === 'junior';

  // プラン別制限（簡易版）
  const limits = {
    free: { daily: 20, monthly: 200 },
    kids: { daily: 50, monthly: 1000 },
    friends: { daily: 100, monthly: 2000 },
    premium: { daily: 500, monthly: 10000 }
  };

  const limit = limits[plan as keyof typeof limits] || limits.free;
  const dailyUsagePercent = (stats.todayMessages / limit.daily) * 100;

  if (dailyUsagePercent < 80) return null;

  return (
    <div className="mt-2 p-2 bg-honey-yellow/10 rounded text-xs">
      <div className="flex items-center space-x-1">
        <span>⚠️</span>
        <span className="text-text-main">
          {isJunior
            ? `きょうはもうすぐおしまいだよ (${stats.todayMessages}/${limit.daily})`
            : `今日の利用上限に近づいています (${stats.todayMessages}/${limit.daily})`
          }
        </span>
      </div>
    </div>
  );
};

export default MessageInput;