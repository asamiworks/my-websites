'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import {
  MessageSquare,
  Clock,
  User,
  ChevronRight,
  Trash2,
  MoreVertical,
  Calendar,
  BookOpen
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { deleteConversation } from '@/lib/chat/history';
import type { Conversation } from '@/types';

interface ConversationCardProps {
  conversation: Conversation;
  onClick?: () => void;
  showActions?: boolean;
  onDelete?: (conversationId: string) => void;
}

export function ConversationCard({
  conversation,
  onClick,
  showActions = true,
  onDelete
}: ConversationCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // 教科アイコンマッピング
  const subjectIcons: Record<string, string> = {
    '算数・数学': '🔢',
    '国語': '📚',
    '英語': '🌍',
    '理科': '🔬',
    '社会': '🌏',
    'プログラミング': '💻',
    '悩み相談': '💝',
    '一般': '💬'
  };

  // 日時フォーマット
  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp?.seconds * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      const diffMinutes = diffMs / (1000 * 60);
      return `${Math.floor(diffMinutes)}分前`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}時間前`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // 会話削除
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('この会話を削除しますか？この操作は取り消せません。')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteConversation(conversation.id);
      onDelete?.(conversation.id);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      alert('会話の削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  // 会話を開く
  const handleOpenConversation = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/chat/${conversation.id}`);
    }
  };

  // タイトル表示
  const displayTitle = conversation.title || `${conversation.childName}との${conversation.subject}`;

  return (
    <Card className={`
      hover:shadow-md transition-all duration-200 cursor-pointer
      ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
    `}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          {/* メイン情報 */}
          <div className="flex-1 min-w-0" onClick={handleOpenConversation}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{subjectIcons[conversation.subject] || '💬'}</span>
              <Badge variant="secondary" className="text-xs">
                {conversation.subject}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-3 w-3 mr-1" />
                {conversation.childName}
              </div>
            </div>

            <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">
              {displayTitle}
            </h3>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {conversation.messageCount}件
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(conversation.lastMessageAt)}
              </div>

              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(conversation.createdAt)}
              </div>
            </div>
          </div>

          {/* アクション */}
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenConversation}
              className="hidden sm:flex"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              開く
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>

            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleOpenConversation}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    会話を開く
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* プログレスバー（メッセージ数の視覚化） */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>メッセージ数</span>
            <span>{conversation.messageCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (conversation.messageCount / 50) * 100)}%`
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}