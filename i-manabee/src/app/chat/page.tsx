'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, Alert } from '@/components/ui';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { MessageSuggestions } from '@/components/chat/MessageSuggestions';
import { UsageIndicator } from '@/components/chat/UsageIndicator';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';
import { useChat } from '@/hooks/useChat';

export default function ChatPage() {
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [showUsage, setShowUsage] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const auth = useAuth();
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const childId = searchParams.get('child');
  const chat = useChat(childId || undefined);

  // TODO: 実際のデータを取得
  const mockChildren = [
    {
      id: '1',
      name: 'たろう',
      ageGroup: 'junior' as const,
      birthMonth: '2015-04',
      grade: '小3',
      interests: ['算数・数学', '理科', '動物']
    },
    {
      id: '2',
      name: 'はなこ',
      ageGroup: 'middle' as const,
      birthMonth: '2012-08',
      grade: '中1',
      interests: ['英語', '音楽', '歴史']
    }
  ];

  useEffect(() => {
    // 認証チェック
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/login');
      return;
    }

    // 子どもIDがない場合は選択画面へ
    if (!childId) {
      router.push('/child-login');
      return;
    }

    // 子どもセッションチェック
    if (!session.isChildSession || session.currentSession?.childId !== childId) {
      router.push(`/child-login?child=${childId}`);
      return;
    }

    // 選択された子どもの情報を取得
    const child = mockChildren.find(c => c.id === childId);
    if (child) {
      setSelectedChild(child);
      generateInitialSuggestions(child);
    }
  }, [auth.isLoading, auth.isAuthenticated, childId, session.isChildSession, router]);

  // メッセージが更新されたら下部にスクロール
  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateInitialSuggestions = (child: any) => {
    const ageSuggestions = {
      junior: [
        '今日は何を勉強しようかな？',
        'おもしろい実験を教えて！',
        'クイズを出して！',
        '動物について教えて'
      ],
      middle: [
        '数学の面白い問題はある？',
        '歴史の豆知識を教えて',
        '英語の勉強方法は？',
        '理科の実験について知りたい'
      ],
      senior: [
        '大学受験の勉強法を教えて',
        '将来の進路について相談したい',
        '最新の科学技術について',
        '論理的思考力を鍛える方法は？'
      ]
    };

    setSuggestions(ageSuggestions[child.ageGroup] || []);
  };

  const handleSendMessage = async (content: string) => {
    await chat.sendMessage(content);
    // 新しい提案を生成（実際にはAIレスポンスから取得）
    // setSuggestions(newSuggestions);
  };

  const handleEndSession = async () => {
    await session.endChildSession();
    router.push('/dashboard');
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      // コピー成功の通知（実装可能）
    });
  };

  const getSessionTimeString = () => {
    if (!session.sessionTimeRemaining) return '';

    const minutes = Math.floor(session.sessionTimeRemaining / (1000 * 60));
    const seconds = Math.floor((session.sessionTimeRemaining % (1000 * 60)) / 1000);

    if (selectedChild?.ageGroup === 'junior') {
      if (minutes < 10) {
        return `あと ${minutes}ふん ${seconds}びょう`;
      }
      return `あと ${minutes}ふん`;
    }

    return `残り ${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bee-flying">🐝</div>
          <p className="text-text-sub">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">🐝</div>
          <h1 className="text-xl font-bold text-text-main mb-2">
            子どもプロファイルが見つかりません
          </h1>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            ダッシュボードに戻る
          </Button>
        </Card>
      </div>
    );
  }

  const ageGroup = selectedChild.ageGroup;
  const isJunior = ageGroup === 'junior';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header className={`
        bg-white border-b-2 shadow-sm sticky top-0 z-10
        ${ageGroup === 'junior' ? 'border-kids-blue' :
          ageGroup === 'middle' ? 'border-friends-purple' :
          'border-premium-gold'
        }
      `}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 左側：子ども情報 */}
            <div className="flex items-center space-x-3">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                ${ageGroup === 'junior' ? 'bg-kids-blue' :
                  ageGroup === 'middle' ? 'bg-friends-purple' :
                  'bg-premium-gold'
                }
              `}>
                {selectedChild.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-bold text-text-main">
                  {isJunior ? `${selectedChild.name}さんとまなびー先生` : `${selectedChild.name}さんのチャット`}
                </h1>
                <p className="text-sm text-text-sub">
                  {selectedChild.grade} • {isJunior ? 'がくしゅうちゅう' : '学習中'}
                </p>
              </div>
            </div>

            {/* 右側：コントロール */}
            <div className="flex items-center space-x-2">
              {/* セッション時間 */}
              {session.sessionTimeRemaining && (
                <div className="text-sm text-text-sub">
                  {getSessionTimeString()}
                </div>
              )}

              {/* 使用状況トグル */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUsage(!showUsage)}
                className="text-text-sub hover:text-text-main"
              >
                📊
              </Button>

              {/* メニューボタン */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="text-text-sub hover:text-text-main">
                  ⚙️
                </Button>
                {/* メニューは実装可能 */}
              </div>

              {/* 終了ボタン */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleEndSession}
                className="text-text-sub hover:text-text-main"
              >
                {isJunior ? 'おわる' : '終了'}
              </Button>
            </div>
          </div>

          {/* 使用状況インジケーター */}
          {showUsage && chat.usageStats && (
            <div className="mt-3">
              <UsageIndicator
                stats={chat.usageStats}
                plan={auth.userData?.plan || 'free'}
                ageGroup={ageGroup}
                compact
              />
            </div>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 flex max-w-4xl mx-auto w-full">
        {/* チャットエリア */}
        <div className="flex-1 flex flex-col">
          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {/* 制限警告 */}
            {chat.limitWarning && (
              <Alert variant="warning" className="mb-4">
                {chat.limitWarning}
              </Alert>
            )}

            {/* エラー表示 */}
            {chat.error && (
              <Alert variant="error" className="mb-4" dismissible onDismiss={() => {}}>
                {chat.error}
              </Alert>
            )}

            {/* 初回メッセージ */}
            {chat.messages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🐝</div>
                <h2 className="text-xl font-bold text-text-main mb-2">
                  {isJunior
                    ? `こんにちは、${selectedChild.name}さん！`
                    : `こんにちは、${selectedChild.name}さん！`
                  }
                </h2>
                <p className="text-text-sub mb-6">
                  {isJunior
                    ? 'まなびー先生と一緒に楽しくお勉強しましょう！なんでも聞いてね🐝'
                    : 'まなびー先生がお手伝いします。何でも質問してください！'
                  }
                </p>

                {/* 興味分野の表示 */}
                <div className="max-w-md mx-auto">
                  <p className="text-sm text-text-sub mb-3">
                    {isJunior ? 'すきなもの:' : '興味分野:'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {selectedChild.interests.map((interest: string) => (
                      <span
                        key={interest}
                        className={`
                          px-3 py-1 rounded-full text-sm
                          ${ageGroup === 'junior' ? 'bg-kids-blue bg-opacity-20 text-kids-blue' :
                            ageGroup === 'middle' ? 'bg-friends-purple bg-opacity-20 text-friends-purple' :
                            'bg-premium-gold bg-opacity-20 text-premium-gold'
                          }
                        `}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* チャットメッセージ */}
            {chat.messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                ageGroup={ageGroup}
                isLast={index === chat.messages.length - 1}
                onRetry={index === chat.messages.length - 1 ? chat.regenerateLastResponse : undefined}
                onCopy={() => handleCopyMessage(message.content)}
                showMetadata={!isJunior}
              />
            ))}

            {/* 読み込み中インジケーター */}
            {chat.isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-honey-yellow to-warning-yellow flex items-center justify-center text-white">
                    🐝
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 border-2 border-honey-yellow shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-honey-yellow rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-honey-yellow rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-honey-yellow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* メッセージ候補 */}
          <MessageSuggestions
            subject="general" // TODO: 実際の教科を設定
            ageGroup={ageGroup}
            conversationHistory={chat.messages}
            onSelect={handleSendMessage}
          />

          {/* 入力エリア */}
          <div className="border-t bg-white px-4 py-4">
            <ChatInput
              onSend={handleSendMessage}
              disabled={!chat.canSendMessage}
              isLoading={chat.isLoading}
              ageGroup={ageGroup}
              maxLength={auth.userData?.plan ? 1500 : 500}
              suggestions={[]} // 新しいMessageSuggestionsを使うので空にする
            />
          </div>
        </div>

        {/* サイドバー（デスクトップのみ） */}
        <div className="hidden lg:block w-80 bg-white border-l">
          <div className="p-4 space-y-4">
            {/* 使用状況 */}
            {chat.usageStats && (
              <UsageIndicator
                stats={chat.usageStats}
                plan={auth.userData?.plan || 'free'}
                ageGroup={ageGroup}
                showUpgrade={!isJunior}
                onUpgrade={() => router.push('/dashboard/subscription')}
              />
            )}

            {/* クイックアクション */}
            <Card className="p-4">
              <h3 className="font-semibold text-text-main mb-3">
                {isJunior ? 'べんりなボタン' : 'クイックアクション'}
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={chat.clearChat}
                  className="text-left justify-start"
                >
                  🗑️ {isJunior ? 'おはなしをきれいにする' : 'チャットをクリア'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => router.push('/dashboard/profile')}
                  className="text-left justify-start"
                >
                  👤 {isJunior ? 'プロフィール' : 'プロファイル設定'}
                </Button>
              </div>
            </Card>

            {/* ヘルプ */}
            <Card className="p-4">
              <h3 className="font-semibold text-text-main mb-3">
                {isJunior ? 'ヘルプ' : 'ヘルプ'}
              </h3>
              <div className="text-sm text-text-sub space-y-2">
                <p>
                  {isJunior
                    ? '• なんでもきいてみよう！'
                    : '• どんな質問でもお気軽に'
                  }
                </p>
                <p>
                  {isJunior
                    ? '• まちがいをおそれないで'
                    : '• 間違いを恐れずに学習しよう'
                  }
                </p>
                <p>
                  {isJunior
                    ? '• こまったらおうちのひとに'
                    : '• 困った時は保護者に相談'
                  }
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}