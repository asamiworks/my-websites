"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import styles from './ChatHistory.module.css';

interface ChatHistoryProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export default function ChatHistory({ onSelectChat, onNewChat }: ChatHistoryProps) {
  const { user, signOut } = useAuth();
  const { chats, currentChat, deleteChat } = useChat();

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (confirm('このチャットを削除しますか？')) {
      try {
        await deleteChat(chatId);
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '今日';
    } else if (diffDays === 1) {
      return '昨日';
    } else if (diffDays < 7) {
      return `${diffDays}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>チャット履歴</h2>
        <button className={styles.newChatButton} onClick={onNewChat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          新規
        </button>
      </div>

      <div className={styles.chatList}>
        {chats.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>💬</div>
            <p className={styles.emptyStateText}>
              まだチャット履歴がありません。<br />
              新しいチャットを開始しましょう。
            </p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${currentChat?.id === chat.id ? styles.active : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className={styles.chatItemContent}>
                <h3 className={styles.chatItemTitle}>{chat.title}</h3>
                <p className={styles.chatItemDate}>{formatDate(chat.updatedAt)}</p>
              </div>
              <button
                className={styles.deleteButton}
                onClick={(e) => handleDeleteChat(e, chat.id)}
                aria-label="削除"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {user && (
        <div className={styles.userInfo}>
          <p className={styles.userName}>{user.displayName || user.email}</p>
          <button className={styles.signOutButton} onClick={signOut}>
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
