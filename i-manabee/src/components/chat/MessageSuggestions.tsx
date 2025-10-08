'use client';

import { useEffect, useState } from 'react';
import { SuggestionEngine } from '@/lib/suggestions/suggestionEngine';
import type { AgeGroup, Message, MessageSuggestion } from '@/types';

interface MessageSuggestionsProps {
  subject: string;
  ageGroup: AgeGroup;
  conversationHistory: Message[];
  onSelect: (text: string) => void;
}

export function MessageSuggestions({
  subject,
  ageGroup,
  conversationHistory,
  onSelect
}: MessageSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<MessageSuggestion[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const engine = new SuggestionEngine();
    const results = engine.getSuggestions(
      subject,
      ageGroup,
      conversationHistory
    );
    setSuggestions(results);
  }, [subject, ageGroup, conversationHistory]);

  if (!isVisible || suggestions.length === 0) return null;

  const handleSelect = (text: string) => {
    onSelect(text);
    setIsVisible(false);
    // 2秒後に再表示
    setTimeout(() => setIsVisible(true), 2000);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          💡 {conversationHistory.length > 0
            ? '次はこんなことを聞いてみよう！'
            : 'こんなことが聞けるよ！'}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion.text)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg border transition-all
                hover:scale-105 active:scale-95
                ${suggestion.source === 'rule-based'
                  ? 'bg-yellow-50 border-yellow-300 text-gray-800 font-medium'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              <span className="text-sm whitespace-nowrap">
                {suggestion.text}
              </span>
              {suggestion.source === 'rule-based' && (
                <span className="ml-2 text-xs">✨</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}