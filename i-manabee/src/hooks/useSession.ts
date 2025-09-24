// セッション管理用カスタムフック
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, useAuthSelectors, useAuthActions } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export interface SessionData {
  type: 'parent' | 'child';
  userId: string;
  childId?: string;
  expiresAt: Date;
  startedAt: Date;
}

interface UseSessionReturn {
  // セッション状態
  currentSession: SessionData | null;
  isParentSession: boolean;
  isChildSession: boolean;
  sessionTimeRemaining: number | null;

  // セッション管理
  startChildSession: (childId: string, pin: string) => Promise<boolean>;
  endChildSession: () => Promise<void>;
  extendSession: (minutes: number) => Promise<void>;
  switchToParentSession: () => Promise<void>;

  // セッション検証
  validateSession: () => Promise<boolean>;
  isSessionExpired: () => boolean;
}

export function useSession(): UseSessionReturn {
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(null);

  const selectors = useAuthSelectors();
  const actions = useAuthActions();
  const router = useRouter();

  // セッション時間の更新
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentSession && currentSession.expiresAt) {
      interval = setInterval(() => {
        const now = new Date();
        const remaining = Math.max(0, currentSession.expiresAt.getTime() - now.getTime());
        setSessionTimeRemaining(remaining);

        // セッション期限切れの場合
        if (remaining <= 0) {
          handleSessionExpiry();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSession]);

  // ページロード時のセッション復元
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = () => {
    try {
      const savedSession = localStorage.getItem('currentSession');
      if (savedSession) {
        const session: SessionData = JSON.parse(savedSession);
        // 日付オブジェクトの復元
        session.expiresAt = new Date(session.expiresAt);
        session.startedAt = new Date(session.startedAt);

        // セッションが有効期限内かチェック
        if (session.expiresAt.getTime() > Date.now()) {
          setCurrentSession(session);
        } else {
          // 期限切れのセッションを削除
          localStorage.removeItem('currentSession');
        }
      }
    } catch (error) {
      console.error('セッション復元エラー:', error);
      localStorage.removeItem('currentSession');
    }
  };

  const saveSession = (session: SessionData | null) => {
    if (session) {
      localStorage.setItem('currentSession', JSON.stringify(session));
    } else {
      localStorage.removeItem('currentSession');
    }
  };

  const handleSessionExpiry = async () => {
    console.log('セッションが期限切れになりました');

    if (currentSession?.type === 'child') {
      // 子どもセッションの場合は保護者画面に戻る
      await endChildSession();
      router.push('/dashboard');
    }

    setCurrentSession(null);
    setSessionTimeRemaining(null);
    saveSession(null);
  };

  const startChildSession = async (childId: string, pin: string): Promise<boolean> => {
    try {
      // TODO: PIN認証API呼び出し
      const isValidPin = await validateChildPin(childId, pin);

      if (!isValidPin) {
        return false;
      }

      // 子どもセッション開始
      const session: SessionData = {
        type: 'child',
        userId: selectors.user?.uid || '',
        childId,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2時間
      };

      setCurrentSession(session);
      saveSession(session);

      // 現在の子どもを設定
      const childData = await getChildData(childId);
      if (childData) {
        actions.setCurrentChild(childData);
      }

      console.log('子どもセッション開始:', session);
      return true;
    } catch (error) {
      console.error('子どもセッション開始エラー:', error);
      return false;
    }
  };

  const endChildSession = async (): Promise<void> => {
    try {
      if (currentSession?.type === 'child') {
        // セッション終了ログ
        console.log('子どもセッション終了:', {
          childId: currentSession.childId,
          duration: Date.now() - currentSession.startedAt.getTime()
        });

        // TODO: セッション終了API呼び出し（使用時間の記録など）
      }

      // 現在の子どもクリア
      actions.setCurrentChild(null);

      // セッション情報クリア
      setCurrentSession(null);
      setSessionTimeRemaining(null);
      saveSession(null);
    } catch (error) {
      console.error('子どもセッション終了エラー:', error);
    }
  };

  const extendSession = async (minutes: number): Promise<void> => {
    if (!currentSession) return;

    try {
      const newExpiryTime = new Date(currentSession.expiresAt.getTime() + minutes * 60 * 1000);

      // 最大セッション時間の制限（例：4時間）
      const maxSessionDuration = 4 * 60 * 60 * 1000;
      const maxExpiryTime = new Date(currentSession.startedAt.getTime() + maxSessionDuration);

      const updatedSession: SessionData = {
        ...currentSession,
        expiresAt: newExpiryTime.getTime() <= maxExpiryTime.getTime() ? newExpiryTime : maxExpiryTime
      };

      setCurrentSession(updatedSession);
      saveSession(updatedSession);

      console.log('セッション延長:', {
        childId: currentSession.childId,
        newExpiry: updatedSession.expiresAt
      });
    } catch (error) {
      console.error('セッション延長エラー:', error);
    }
  };

  const switchToParentSession = async (): Promise<void> => {
    try {
      // 子どもセッション終了
      await endChildSession();

      // 保護者セッション（無期限）
      const session: SessionData = {
        type: 'parent',
        userId: selectors.user?.uid || '',
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24時間
      };

      setCurrentSession(session);
      saveSession(session);

      console.log('保護者セッション開始');
    } catch (error) {
      console.error('保護者セッション切り替えエラー:', error);
    }
  };

  const validateSession = async (): Promise<boolean> => {
    if (!currentSession) return false;

    try {
      // セッションの有効期限チェック
      if (isSessionExpired()) {
        await handleSessionExpiry();
        return false;
      }

      // 追加の検証（必要に応じて）
      // TODO: サーバーサイドでのセッション検証

      return true;
    } catch (error) {
      console.error('セッション検証エラー:', error);
      return false;
    }
  };

  const isSessionExpired = (): boolean => {
    if (!currentSession) return true;
    return currentSession.expiresAt.getTime() <= Date.now();
  };

  // ヘルパー関数
  const validateChildPin = async (childId: string, pin: string): Promise<boolean> => {
    // TODO: 実際のPIN検証API
    console.log('PIN検証:', { childId, pin });

    // 仮の実装（実際はデータベースから取得）
    const mockPins = {
      '1': '1234',
      '2': '5678'
    };

    return mockPins[childId as keyof typeof mockPins] === pin;
  };

  const getChildData = async (childId: string) => {
    // TODO: 実際の子どもデータ取得API
    const mockChildren = [
      {
        id: '1',
        name: 'たろう',
        ageGroup: 'junior' as const,
        birthMonth: '2015-04',
        grade: '小3'
      },
      {
        id: '2',
        name: 'はなこ',
        ageGroup: 'middle' as const,
        birthMonth: '2012-08',
        grade: '中1'
      }
    ];

    return mockChildren.find(child => child.id === childId) || null;
  };

  return {
    // セッション状態
    currentSession,
    isParentSession: currentSession?.type === 'parent',
    isChildSession: currentSession?.type === 'child',
    sessionTimeRemaining,

    // セッション管理
    startChildSession,
    endChildSession,
    extendSession,
    switchToParentSession,

    // セッション検証
    validateSession,
    isSessionExpired
  };
}

export default useSession;