'use client';

import { useState } from 'react';
import { ConversationCard } from './ConversationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, Calendar, Clock } from 'lucide-react';
import type { Conversation } from '@/types';

interface ConversationListProps {
  conversations: Conversation[];
  isLoading?: boolean;
  emptyMessage?: string;
  onSelectConversation?: (conversation: Conversation) => void;
  showSearchBox?: boolean;
  maxHeight?: string;
}

export function ConversationList({
  conversations,
  isLoading = false,
  emptyMessage = '会話履歴がありません',
  onSelectConversation,
  showSearchBox = false,
  maxHeight = 'max-h-96'
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'messages' | 'title'>('recent');

  // 検索フィルター
  const filteredConversations = conversations.filter(conv =>
    !searchQuery ||
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ソート
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return (b.lastMessageAt?.seconds || 0) - (a.lastMessageAt?.seconds || 0);
      case 'messages':
        return b.messageCount - a.messageCount;
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      default:
        return 0;
    }
  });

  // グループ化（日付別）
  const groupedConversations = sortedConversations.reduce((groups, conv) => {
    const date = conv.lastMessageAt?.toDate?.() || new Date(conv.lastMessageAt?.seconds * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    let groupKey: string;
    if (date.toDateString() === today.toDateString()) {
      groupKey = '今日';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = '昨日';
    } else if (date > weekAgo) {
      groupKey = '今週';
    } else {
      groupKey = date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-24 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 検索ボックス */}
      {showSearchBox && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="会話を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
            >
              <Clock className="h-4 w-4 mr-1" />
              最新順
            </Button>
            <Button
              variant={sortBy === 'messages' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('messages')}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              メッセージ数
            </Button>
          </div>
        </div>
      )}

      {/* 会話リスト */}
      {sortedConversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">{emptyMessage}</p>
          <p className="text-gray-400 text-sm">
            子どもとの学習を開始すると、ここに会話履歴が表示されます
          </p>
        </div>
      ) : (
        <div className={`space-y-6 overflow-y-auto ${maxHeight}`}>
          {Object.entries(groupedConversations).map(([dateGroup, convs]) => (
            <div key={dateGroup}>
              <div className="flex items-center mb-3">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {dateGroup}
                </h3>
                <div className="flex-1 border-t border-gray-200 ml-3"></div>
                <span className="text-xs text-gray-400 ml-3">
                  {convs.length}件
                </span>
              </div>

              <div className="space-y-3">
                {convs.map((conversation) => (
                  <ConversationCard
                    key={conversation.id}
                    conversation={conversation}
                    onClick={onSelectConversation ? () => onSelectConversation(conversation) : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* フッター統計 */}
      {sortedConversations.length > 0 && (
        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              総会話数: {conversations.length}件
            </span>
            <span>
              総メッセージ数: {conversations.reduce((sum, conv) => sum + conv.messageCount, 0)}件
            </span>
          </div>
        </div>
      )}
    </div>
  );
}