'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/useChildren';
import { getConversationWithMessages, addMessage } from '@/lib/chat/history';
import { MessageSuggestions } from '@/components/chat/MessageSuggestions';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { MessageInput } from '@/components/chat/MessageInput';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Alert, AlertDescription } from '@/components/ui';
import { ArrowLeft, Clock, MessageSquare, User, BookOpen, RefreshCw } from 'lucide-react';
import type { Conversation, Message, AgeGroup } from '@/types';

export default function ConversationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { children } = useChildren();

  const conversationId = params.conversationId as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 会話データを読み込み
  useEffect(() => {
    async function loadConversation() {
      if (!user || !conversationId) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await getConversationWithMessages(conversationId);

        if (!result) {
          setError('会話が見つかりませんでした');
          return;
        }

        // ユーザーの会話かチェック
        if (result.conversation.userId !== user.uid) {
          setError('この会話にアクセスする権限がありません');
          return;
        }

        setConversation(result.conversation);
        setMessages(result.messages);
      } catch (err) {
        console.error('Failed to load conversation:', err);
        setError('会話の読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    }

    loadConversation();
  }, [user, conversationId]);

  // メッセージが更新されたら下部にスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 子どもの情報を取得
  const child = conversation ? children.find(c => c.id === conversation.childId) : null;

  // 教科アイコン
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
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // メッセージ送信
  const handleSendMessage = async (content: string) => {
    if (!conversation || !user || !child) return;

    try {
      setIsSending(true);

      // ユーザーメッセージを追加
      const userMessage: Omit<Message, 'id' | 'timestamp'> = {
        conversationId: conversation.id,
        userId: user.uid,
        childId: conversation.childId,
        role: 'user',
        content,
      };

      await addMessage({
        conversationId: conversation.id,
        message: userMessage,
      });

      // ローカル状態を更新
      const tempUserMessage: Message = {
        ...userMessage,
        id: `temp-${Date.now()}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, tempUserMessage]);

      // TODO: AIレスポンスを生成
      // ここで実際のAI APIを呼び出す
      // 現在はダミーレスポンス
      const aiMessage: Omit<Message, 'id' | 'timestamp'> = {
        conversationId: conversation.id,
        userId: user.uid,
        childId: conversation.childId,
        role: 'assistant',
        content: `「${content}」について説明しますね。これは学習に役立つ重要なトピックです。詳しく聞きたいことがあれば、いつでも質問してください！`,
      };

      // AI応答を保存
      await addMessage({
        conversationId: conversation.id,
        message: aiMessage,
      });

      // ローカル状態を更新
      const tempAiMessage: Message = {
        ...aiMessage,
        id: `temp-ai-${Date.now()}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, tempAiMessage]);

      // 会話情報を更新
      setConversation(prev => prev ? {
        ...prev,
        messageCount: prev.messageCount + 2,
        lastMessageAt: new Date(),
      } : null);

    } catch (err) {
      console.error('Failed to send message:', err);
      setError('メッセージの送信に失敗しました');
    } finally {
      setIsSending(false);
    }
  };

  // メッセージ候補選択
  const handleSuggestionSelect = (text: string) => {
    handleSendMessage(text);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">ログインしてください</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">会話を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">😕</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              会話を開けませんでした
            </h1>
            <p className="text-gray-600 mb-6">
              {error || '会話が見つかりませんでした'}
            </p>
            <Button onClick={() => router.push('/history')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              履歴に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ageGroup = (child?.ageGroup || 'middle') as AgeGroup;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 左側：戻るボタンと会話情報 */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/history')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                履歴に戻る
              </Button>

              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {subjectIcons[conversation.subject] || '💬'}
                </span>
                <div>
                  <h1 className="font-bold text-gray-900">
                    {conversation.title || `${conversation.childName}との${conversation.subject}`}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {conversation.childName}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {conversation.subject}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {conversation.messageCount}件
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：日時情報 */}
            <div className="text-right text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                最終更新: {formatDate(conversation.lastMessageAt)}
              </div>
              <div>
                作成日: {formatDate(conversation.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 flex max-w-4xl mx-auto w-full">
        <div className="flex-1 flex flex-col">
          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {/* 会話情報カード */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      この会話について
                    </h3>
                    <p className="text-sm text-gray-600">
                      {child?.name}さんと{conversation.subject}について学習した記録です
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {messages.length}
                    </div>
                    <div className="text-xs text-gray-500">メッセージ</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* エラー表示 */}
            {error && (
              <Alert className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* チャットメッセージ */}
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  ageGroup={ageGroup}
                  isLast={index === messages.length - 1}
                  showMetadata={true}
                />
              ))}
            </div>

            {/* 送信中インジケーター */}
            {isSending && (
              <div className="flex justify-start my-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    🐝
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 border border-gray-200 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* メッセージ候補 */}
          {child && (
            <MessageSuggestions
              subject={conversation.subject}
              ageGroup={ageGroup}
              conversationHistory={messages}
              onSelect={handleSuggestionSelect}
            />
          )}

          {/* 入力エリア */}
          <div className="border-t bg-white px-4 py-4">
            <MessageInput
              onSend={handleSendMessage}
              disabled={isSending}
              placeholder="メッセージを入力..."
              maxLength={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}