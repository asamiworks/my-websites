"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { useAuth } from './AuthContext';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Timestamp;
}

export interface Chat {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  quickReplies?: string[];
  collectBusinessInfo?: string | null;
  collectInfo?: boolean;
  inquiryComplete?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt: Timestamp;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  loadChats: () => Promise<void>;
  createNewChat: (title?: string) => Promise<string>;
  loadChat: (chatId: string) => Promise<Chat | null>;
  saveMessage: (message: Message, chatToUse?: Chat) => Promise<string>;
  saveQuickReplies: (quickReplies: string[], chatId?: string) => Promise<void>;
  saveFormStates: (collectBusinessInfo: string | null, collectInfo: boolean, inquiryComplete: boolean, chatId?: string) => Promise<void>;
  saveCurrentChatToFirestore: (messages: Message[], contactInfo?: any) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  clearCurrentChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);

  // ユーザーログイン時にチャット履歴を読み込む
  useEffect(() => {
    if (user) {
      loadChats();

      // ゲストチャットがlocalStorageにあれば復元
      const restoreGuestChat = async () => {
        try {
          const guestMessages = localStorage.getItem('guestChatMessages');
          if (guestMessages) {
            const messages = JSON.parse(guestMessages) as Message[];
            // ユーザーメッセージが含まれている場合のみ保存（初期メッセージのみは除外）
            if (messages.length > 1 && messages.some(m => m.role === 'user')) {
              await saveCurrentChatToFirestore(messages);
              // 保存後にlocalStorageをクリア
              localStorage.removeItem('guestChatMessages');
            } else {
              // 初期メッセージのみの場合はクリアするだけ
              localStorage.removeItem('guestChatMessages');
            }
          }
        } catch (error) {
          console.error('Error restoring guest chat:', error);
          // エラーが発生してもlocalStorageはクリア
          localStorage.removeItem('guestChatMessages');
        }
      };

      restoreGuestChat();
    } else {
      setChats([]);
      setCurrentChat(null);
    }
  }, [user]);

  const loadChats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const chatsQuery = query(
        collection(db, 'chats'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc'),
        limit(20)
      );

      const snapshot = await getDocs(chatsQuery);
      const loadedChats: Chat[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];

      setChats(loadedChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async (title: string = '新しいチャット'): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const now = Timestamp.now();
      const expiresAt = Timestamp.fromMillis(now.toMillis() + 180 * 24 * 60 * 60 * 1000); // 180日後

      // ログインユーザーの場合は最初からFirestoreに保存
      const chatData = {
        userId: user.uid,
        title,
        messages: [],
        quickReplies: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiresAt,
      };

      const docRef = await addDoc(collection(db, 'chats'), chatData);
      const chatId = docRef.id;

      const newChat: Chat = {
        id: chatId,
        userId: user.uid,
        title,
        messages: [],
        quickReplies: [],
        createdAt: now,
        updatedAt: now,
        expiresAt,
      };

      setCurrentChat(newChat);

      // Firestoreから最新のチャット一覧を再読み込み
      await loadChats();

      return chatId;
    } catch (error) {
      console.error('Error creating new chat:', error);
      throw error;
    }
  };

  const loadChat = async (chatId: string): Promise<Chat | null> => {
    if (!user) return null;

    try {
      setLoading(true);
      const chatDoc = await getDoc(doc(db, 'chats', chatId));

      if (chatDoc.exists() && chatDoc.data().userId === user.uid) {
        const chat: Chat = {
          id: chatDoc.id,
          ...chatDoc.data(),
        } as Chat;

        setCurrentChat(chat);
        return chat;
      } else {
        console.error('Chat not found or unauthorized');
        return null;
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveMessage = async (message: Message, chatToUse?: Chat): Promise<string> => {
    const targetChat = chatToUse || currentChat;
    if (!user || !targetChat) return targetChat?.id || '';

    try {
      const chatId = targetChat.id;

      // Firestoreから最新のチャットデータを取得
      const chatDocRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatDocRef);

      if (!chatDoc.exists()) {
        throw new Error('Chat not found');
      }

      const chatData = chatDoc.data() as Chat;
      const currentMessages = chatData.messages || [];
      const updatedMessages = [...currentMessages, message];

      // Firestoreのチャットを更新
      const updateData: any = {
        messages: updatedMessages,
        updatedAt: serverTimestamp(),
      };

      // タイトルが「新しいチャット」で、最初のユーザーメッセージの場合はタイトルを更新
      if (chatData.title === '新しいチャット' && message.role === 'user') {
        updateData.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
      }

      await updateDoc(chatDocRef, updateData);

      // ローカル状態を更新
      const updatedChat = {
        ...targetChat,
        messages: updatedMessages,
        updatedAt: Timestamp.now(),
        ...(updateData.title && { title: updateData.title }),
      };

      setCurrentChat(updatedChat);

      // チャット一覧も更新
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? updatedChat : chat
        )
      );

      return chatId;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  };

  const saveQuickReplies = async (quickReplies: string[], chatId?: string) => {
    if (!user) return;

    const targetChatId = chatId || currentChat?.id;

    if (!targetChatId) {
      console.warn('No chat ID available for saving quick replies');
      return;
    }

    try {
      await updateDoc(doc(db, 'chats', targetChatId), {
        quickReplies,
        updatedAt: serverTimestamp(),
      });

      // ローカル状態を更新
      setCurrentChat((prev) =>
        prev
          ? {
              ...prev,
              quickReplies,
              updatedAt: Timestamp.now(),
            }
          : null
      );

      // チャット一覧も更新
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === targetChatId
            ? {
                ...chat,
                quickReplies,
                updatedAt: Timestamp.now(),
              }
            : chat
        )
      );
    } catch (error) {
      console.error('Error saving quick replies:', error);
      throw error;
    }
  };

  const saveFormStates = async (
    collectBusinessInfo: string | null,
    collectInfo: boolean,
    inquiryComplete: boolean,
    chatId?: string
  ) => {
    if (!user) return;

    const targetChatId = chatId || currentChat?.id;

    if (!targetChatId) {
      console.warn('No chat ID available for saving form states');
      return;
    }

    try {
      await updateDoc(doc(db, 'chats', targetChatId), {
        collectBusinessInfo,
        collectInfo,
        inquiryComplete,
        updatedAt: serverTimestamp(),
      });

      // ローカル状態を更新
      setCurrentChat((prev) =>
        prev
          ? {
              ...prev,
              collectBusinessInfo,
              collectInfo,
              inquiryComplete,
              updatedAt: Timestamp.now(),
            }
          : null
      );

      // チャット一覧も更新
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === targetChatId
            ? {
                ...chat,
                collectBusinessInfo,
                collectInfo,
                inquiryComplete,
                updatedAt: Timestamp.now(),
              }
            : chat
        )
      );
    } catch (error) {
      console.error('Error saving form states:', error);
      throw error;
    }
  };

  // 非会員からアカウント作成時に現在のチャットを保存
  const saveCurrentChatToFirestore = async (messages: Message[], contactInfo?: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const now = Timestamp.now();
      const expiresAt = Timestamp.fromMillis(now.toMillis() + 180 * 24 * 60 * 60 * 1000);

      // タイトルを最初のユーザーメッセージから生成
      const firstUserMessage = messages.find((m) => m.role === 'user');
      const title = firstUserMessage
        ? firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '')
        : '新しいチャット';

      const chatData = {
        userId: user.uid,
        title,
        messages,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiresAt,
      };

      const docRef = await addDoc(collection(db, 'chats'), chatData);

      const newChat: Chat = {
        id: docRef.id,
        userId: user.uid,
        title,
        messages,
        createdAt: now,
        updatedAt: now,
        expiresAt,
      };

      setCurrentChat(newChat);
      setChats((prev) => [newChat, ...prev]);
    } catch (error) {
      console.error('Error saving current chat:', error);
      throw error;
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'chats', chatId));
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));

      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  };

  const clearCurrentChat = () => {
    setCurrentChat(null);
  };

  const value: ChatContextType = {
    chats,
    currentChat,
    loading,
    loadChats,
    createNewChat,
    loadChat,
    saveMessage,
    saveQuickReplies,
    saveFormStates,
    saveCurrentChatToFirestore,
    deleteChat,
    clearCurrentChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
