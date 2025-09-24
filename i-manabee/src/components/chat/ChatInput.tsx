import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
  ageGroup: 'junior' | 'middle' | 'senior';
  suggestions?: string[];
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  isLoading = false,
  placeholder,
  maxLength = 1000,
  ageGroup,
  suggestions = []
}) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getPlaceholder = () => {
    if (placeholder) return placeholder;

    switch (ageGroup) {
      case 'junior':
        return 'まなびー先生になんでもきいてみよう！';
      case 'middle':
        return 'まなびー先生に質問してみよう！';
      case 'senior':
        return 'まなびー先生に質問や相談をしてみましょう';
      default:
        return '質問を入力してください...';
    }
  };

  const getAgeGroupTheme = () => {
    switch (ageGroup) {
      case 'junior':
        return {
          border: 'border-kids-blue',
          focus: 'focus:border-kids-blue focus:ring-kids-blue',
          button: 'bg-gradient-to-r from-kids-blue to-blue-500'
        };
      case 'middle':
        return {
          border: 'border-friends-purple',
          focus: 'focus:border-friends-purple focus:ring-friends-purple',
          button: 'bg-gradient-to-r from-friends-purple to-purple-500'
        };
      case 'senior':
        return {
          border: 'border-premium-gold',
          focus: 'focus:border-premium-gold focus:ring-premium-gold',
          button: 'bg-gradient-to-r from-premium-gold to-yellow-500'
        };
    }
  };

  const theme = getAgeGroupTheme();

  // テキストエリアの高さ自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isLoading) {
      onSend(message.trim());
      setMessage('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enterで改行
        return;
      }
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const remainingChars = maxLength - message.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="relative">
      {/* 提案ボタンと表示 */}
      {suggestions.length > 0 && (
        <div className="mb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleSuggestions}
            className="text-text-sub hover:text-text-main"
          >
            💡 {showSuggestions ? '提案を隠す' : '質問の提案を見る'}
          </Button>

          {showSuggestions && (
            <div className="mt-2 space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`
                    block w-full text-left p-3 rounded-lg border-2 transition-all
                    hover:${theme.border} hover:bg-opacity-5
                    ${theme.border.replace('border-', 'hover:bg-')}
                    border-gray-200 text-sm text-text-main
                  `}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* メインの入力フォーム */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative border-2 rounded-2xl transition-all
          ${theme.border} ${theme.focus}
          ${isOverLimit ? 'border-error-red focus:border-error-red focus:ring-error-red' : ''}
          ${disabled ? 'opacity-50' : ''}
        `}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            placeholder={getPlaceholder()}
            className="
              w-full px-4 py-3 pr-16 resize-none rounded-2xl
              focus:outline-none focus:ring-2 focus:ring-opacity-20
              border-none bg-transparent
              text-text-main placeholder-text-sub
              min-h-[50px] max-h-[200px]
            "
            style={{ height: 'auto' }}
            maxLength={maxLength + 50} // 少し余裕を持たせて文字数チェックは別で行う
          />

          {/* 送信ボタン */}
          <div className="absolute bottom-2 right-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!message.trim() || disabled || isLoading || isOverLimit}
              loading={isLoading}
              className={`
                rounded-xl w-10 h-10 p-0 flex items-center justify-center
                ${theme.button}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-lg">
                  {ageGroup === 'junior' ? '🚀' : '➤'}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* 文字数カウンター */}
        <div className="flex justify-between items-center mt-2 text-xs">
          <div className="text-text-sub">
            {ageGroup === 'junior' ? (
              <span>Shift+Enterでかいぎょうできるよ</span>
            ) : (
              <span>Shift+Enterで改行</span>
            )}
          </div>
          <div className={`
            ${isOverLimit
              ? 'text-error-red font-semibold'
              : remainingChars < 50
                ? 'text-warning-yellow'
                : 'text-text-sub'
            }
          `}>
            {remainingChars < 0
              ? `${Math.abs(remainingChars)}文字超過`
              : `あと${remainingChars}文字`
            }
          </div>
        </div>

        {/* エラー表示 */}
        {isOverLimit && (
          <div className="mt-2 text-sm text-error-red">
            {ageGroup === 'junior'
              ? 'メッセージがちょっとながすぎるよ。もうすこしみじかくしてね！'
              : `メッセージが長すぎます。${maxLength}文字以内で入力してください。`
            }
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;