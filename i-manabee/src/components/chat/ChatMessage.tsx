import React from 'react';
import { Button } from '@/components/ui';
import type { ChatMessage as ChatMessageType } from '@/lib/ai/openai';

interface ChatMessageProps {
  message: ChatMessageType;
  ageGroup: 'junior' | 'middle' | 'senior';
  isLast?: boolean;
  onRetry?: () => void;
  onCopy?: () => void;
  showMetadata?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  ageGroup,
  isLast = false,
  onRetry,
  onCopy,
  showMetadata = false
}) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const formatTime = (timestamp?: Date) => {
    if (!timestamp) return '';
    return new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  const getAgeGroupTheme = () => {
    switch (ageGroup) {
      case 'junior':
        return {
          userBg: 'bg-kids-blue',
          userText: 'text-white',
          assistantBg: 'bg-honey-yellow bg-opacity-10',
          assistantBorder: 'border-honey-yellow',
          assistantText: 'text-text-main'
        };
      case 'middle':
        return {
          userBg: 'bg-friends-purple',
          userText: 'text-white',
          assistantBg: 'bg-friends-purple bg-opacity-10',
          assistantBorder: 'border-friends-purple',
          assistantText: 'text-text-main'
        };
      case 'senior':
        return {
          userBg: 'bg-premium-gold',
          userText: 'text-white',
          assistantBg: 'bg-premium-gold bg-opacity-10',
          assistantBorder: 'border-premium-gold',
          assistantText: 'text-text-main'
        };
    }
  };

  const theme = getAgeGroupTheme();

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[70%] lg:max-w-[60%]">
          <div className={`
            rounded-2xl rounded-br-md px-4 py-3
            ${theme.userBg} ${theme.userText}
            shadow-sm
          `}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <div className="flex justify-end items-center mt-1 text-xs text-text-sub">
            {message.timestamp && (
              <span>{formatTime(message.timestamp)}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isAssistant) {
    return (
      <div className="flex justify-start mb-4">
        <div className="flex items-start space-x-3 max-w-[85%] lg:max-w-[75%]">
          {/* まなびー先生のアバター */}
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-full
            bg-gradient-to-br from-honey-yellow to-warning-yellow
            flex items-center justify-center text-white text-lg
            shadow-sm
          `}>
            🐝
          </div>

          <div className="flex-1">
            <div className={`
              rounded-2xl rounded-tl-md px-4 py-3 border-2
              ${theme.assistantBg} ${theme.assistantBorder} ${theme.assistantText}
              shadow-sm
            `}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {/* メタデータとアクション */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2 text-xs text-text-sub">
                {message.timestamp && (
                  <span>{formatTime(message.timestamp)}</span>
                )}
                {showMetadata && message.metadata && (
                  <>
                    {message.metadata.tokens && (
                      <span>• {message.metadata.tokens} tokens</span>
                    )}
                    {message.metadata.model && (
                      <span>• {message.metadata.model}</span>
                    )}
                    {message.metadata.safetyScore && (
                      <span className={`
                        px-1 py-0.5 rounded text-xs
                        ${message.metadata.safetyScore >= 8
                          ? 'bg-green-100 text-green-700'
                          : message.metadata.safetyScore >= 6
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }
                      `}>
                        安全度: {message.metadata.safetyScore}/10
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center space-x-1">
                {onCopy && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCopy}
                    className="text-text-sub hover:text-text-main p-1 h-auto"
                    title="コピー"
                  >
                    📋
                  </Button>
                )}
                {onRetry && isLast && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRetry}
                    className="text-text-sub hover:text-text-main p-1 h-auto"
                    title="再生成"
                  >
                    🔄
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ChatMessage;