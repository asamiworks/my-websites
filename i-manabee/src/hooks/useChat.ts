// チャット機能用カスタムフック
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useSession } from './useSession';
import type { ChatMessage } from '@/lib/ai/openai';
import type { TokenUsage, UsageStats } from '@/lib/ai/tokenCounter';

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  usageStats: UsageStats | null;
  canSendMessage: boolean;
  limitWarning: string | null;
}

interface UseChatReturn extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  regenerateLastResponse: () => Promise<void>;
  loadChatHistory: () => Promise<void>;
  updateUsageStats: () => Promise<void>;
  retryMessage: (messageIndex: number) => Promise<void>;
}

export function useChat(childId?: string): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [limitWarning, setLimitWarning] = useState<string | null>(null);

  const auth = useAuth();
  const session = useSession();
  const abortControllerRef = useRef<AbortController | null>(null);

  // チャット履歴の読み込み
  useEffect(() => {
    if (childId && auth.isAuthenticated) {
      loadChatHistory();
      updateUsageStats();
    }
  }, [childId, auth.isAuthenticated]);

  // 使用状況の定期更新
  useEffect(() => {
    const interval = setInterval(() => {
      if (auth.isAuthenticated) {
        updateUsageStats();
      }
    }, 60000); // 1分ごと

    return () => clearInterval(interval);
  }, [auth.isAuthenticated]);

  const loadChatHistory = async () => {
    if (!childId || !auth.user) return;

    try {
      const token = await auth.user.getIdToken();
      const response = await fetch(`/api/chat/${childId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('チャット履歴読み込みエラー:', error);
    }
  };

  const updateUsageStats = async () => {
    if (!auth.user) return;

    try {
      const token = await auth.user.getIdToken();
      const response = await fetch('/api/usage/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const stats = await response.json();
        setUsageStats(stats);

        // 制限チェック
        const plan = auth.userData?.plan || 'free';
        const limitCheck = await fetch('/api/usage/check', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ plan, estimatedTokens: 500 })
        });

        const limitResult = await limitCheck.json();
        setCanSendMessage(limitResult.canProceed);
        setLimitWarning(limitResult.warning || null);
      }
    } catch (error) {
      console.error('使用状況更新エラー:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!childId || !auth.user || !canSendMessage || isLoading) return;

    // 現在のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    // ユーザーメッセージを追加
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const token = await auth.user.getIdToken();

      // APIリクエスト
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childId,
          message: content,
          sessionId: session.currentSession?.sessionId
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'メッセージの送信に失敗しました');
      }

      const data = await response.json();

      // AIレスポンスを追加
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        metadata: {
          tokens: data.tokens?.total,
          model: data.model,
          safetyScore: data.safetyScore
        }
      };

      setMessages(prev => [...prev, aiMessage]);

      // 使用状況を更新
      await updateUsageStats();

      // フォローアップ提案があれば表示
      if (data.suggestions) {
        // 提案を状態として保存（後で実装）
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        return; // キャンセルされた場合は何もしない
      }

      console.error('メッセージ送信エラー:', error);
      setError(error.message);

      // エラーメッセージを追加
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '申し訳ありません。エラーが発生しました。もう一度お試しください。',
        timestamp: new Date(),
        metadata: {
          tokens: 0,
          safetyScore: 10
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const regenerateLastResponse = async () => {
    if (messages.length < 2) return;

    const lastUserMessage = messages[messages.length - 2];
    if (lastUserMessage.role !== 'user') return;

    // 最後のAIレスポンスを削除
    setMessages(prev => prev.slice(0, -1));

    // メッセージを再送信
    await sendMessage(lastUserMessage.content);
  };

  const retryMessage = async (messageIndex: number) => {
    if (messageIndex >= messages.length - 1) return;

    const messageToRetry = messages[messageIndex];
    if (messageToRetry.role !== 'user') return;

    // 指定されたメッセージ以降を削除
    setMessages(prev => prev.slice(0, messageIndex));

    // メッセージを再送信
    await sendMessage(messageToRetry.content);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setLimitWarning(null);

    // サーバー側のチャット履歴もクリア
    if (childId && auth.user) {
      auth.user.getIdToken().then(token => {
        fetch(`/api/chat/${childId}/clear`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(error => {
          console.error('チャット履歴クリアエラー:', error);
        });
      });
    }
  };

  return {
    messages,
    isLoading,
    error,
    usageStats,
    canSendMessage,
    limitWarning,
    sendMessage,
    clearChat,
    regenerateLastResponse,
    loadChatHistory,
    updateUsageStats,
    retryMessage
  };
}