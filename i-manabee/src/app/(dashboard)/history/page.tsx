'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/useChildren';
import { getConversations } from '@/lib/chat/history';
import { ConversationList } from '@/components/chat/ConversationList';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Search, Filter, Clock, MessageSquare } from 'lucide-react';
import type { Conversation } from '@/types';

export default function HistoryPage() {
  const { user } = useAuth();
  const { children } = useChildren();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChild, setSelectedChild] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // 会話履歴を取得
  useEffect(() => {
    async function loadConversations() {
      if (!user) return;

      try {
        setIsLoading(true);
        const allConversations = await getConversations(user.uid);
        setConversations(allConversations);
        setFilteredConversations(allConversations);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadConversations();
  }, [user]);

  // フィルタリング処理
  useEffect(() => {
    let filtered = conversations;

    // 子どもでフィルタ
    if (selectedChild !== 'all') {
      filtered = filtered.filter(conv => conv.childId === selectedChild);
    }

    // 教科でフィルタ
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(conv => conv.subject === selectedSubject);
    }

    // 検索クエリでフィルタ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conv =>
        conv.title?.toLowerCase().includes(query) ||
        conv.childName.toLowerCase().includes(query) ||
        conv.subject.toLowerCase().includes(query)
      );
    }

    setFilteredConversations(filtered);
  }, [conversations, selectedChild, selectedSubject, searchQuery]);

  // 統計情報
  const stats = {
    totalConversations: conversations.length,
    totalMessages: conversations.reduce((sum, conv) => sum + conv.messageCount, 0),
    subjects: [...new Set(conversations.map(conv => conv.subject))].length,
    children: [...new Set(conversations.map(conv => conv.childId))].length,
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">ログインしてください</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💬 会話履歴
          </h1>
          <p className="text-gray-600">
            過去の学習記録を確認できます
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">会話数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalConversations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">メッセージ数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Filter className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">学習教科</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.subjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👶</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">子ども</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.children}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* フィルター・検索エリア */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              検索・フィルター
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 検索 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="タイトルや子どもの名前で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* 子どもでフィルター */}
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger>
                  <SelectValue placeholder="子どもを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての子ども</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 教科でフィルター */}
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="教科を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての教科</SelectItem>
                  <SelectItem value="算数・数学">🔢 算数・数学</SelectItem>
                  <SelectItem value="国語">📚 国語</SelectItem>
                  <SelectItem value="英語">🌍 英語</SelectItem>
                  <SelectItem value="理科">🔬 理科</SelectItem>
                  <SelectItem value="社会">🌏 社会</SelectItem>
                  <SelectItem value="プログラミング">💻 プログラミング</SelectItem>
                  <SelectItem value="悩み相談">💝 悩み相談</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 会話一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>
              会話一覧 ({filteredConversations.length}件)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConversationList
              conversations={filteredConversations}
              isLoading={isLoading}
              emptyMessage={
                conversations.length === 0
                  ? "まだ会話履歴がありません。子どもとの学習を始めましょう！"
                  : "検索条件に一致する会話が見つかりませんでした。"
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}