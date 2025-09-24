// 認証用カスタムフック
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  getUserData
} from '@/lib/firebase/auth';
import { useAuthStore, useAuthSelectors, useAuthActions } from '@/stores/authStore';
import type { User } from '@/types';

export interface UseAuthReturn {
  // 状態
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  userData: User | null;
  currentChild: any;
  error: string | null;
  hasChildren: boolean;
  canAddChildren: () => boolean;
  isChildUnder13: () => boolean;

  // アクション
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  switchChild: (childId: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const selectors = useAuthSelectors();
  const actions = useAuthActions();
  const router = useRouter();

  // Firebase認証状態の監視
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      try {
        actions.setLoading(true);

        unsubscribe = onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            // ユーザーがログインしている場合
            try {
              const userData = await getUserData(firebaseUser.uid);
              actions.setUser(firebaseUser, userData);
            } catch (error) {
              console.error('ユーザーデータ取得エラー:', error);
              actions.setError('ユーザー情報の取得に失敗しました');
            }
          } else {
            // ユーザーがログアウトしている場合
            actions.clearAuth();
          }
        });
      } catch (error) {
        console.error('認証初期化エラー:', error);
        actions.setError('認証の初期化に失敗しました');
      }
    };

    initAuth();

    // クリーンアップ
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [actions]);

  // ユーザー登録
  const register = async (email: string, password: string, displayName?: string) => {
    try {
      actions.setLoading(true);
      actions.setError(null);

      const { user, userData } = await registerUser(email, password, displayName);
      actions.setUser(user, userData);

      // 登録成功時はダッシュボードに遷移
      router.push('/dashboard');
    } catch (error: any) {
      console.error('登録エラー:', error);
      actions.setError(error.message);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  };

  // ログイン
  const login = async (email: string, password: string) => {
    try {
      actions.setLoading(true);
      actions.setError(null);

      const user = await loginUser(email, password);
      const userData = await getUserData(user.uid);
      actions.setUser(user, userData);

      // ログイン成功時はダッシュボードに遷移
      router.push('/dashboard');
    } catch (error: any) {
      console.error('ログインエラー:', error);
      actions.setError(error.message);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  };

  // ログアウト
  const logout = async () => {
    try {
      actions.setLoading(true);
      await logoutUser();
      actions.clearAuth();

      // ログアウト後はホームページに遷移
      router.push('/');
    } catch (error: any) {
      console.error('ログアウトエラー:', error);
      actions.setError(error.message);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  };

  // パスワードリセット
  const forgotPassword = async (email: string) => {
    try {
      actions.setLoading(true);
      actions.setError(null);

      await resetPassword(email);
    } catch (error: any) {
      console.error('パスワードリセットエラー:', error);
      actions.setError(error.message);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  };

  // 子どもの切り替え
  const switchChild = async (childId: string) => {
    try {
      if (!selectors.userData?.children) {
        throw new Error('子どもプロファイルが見つかりません');
      }

      const child = selectors.userData.children.find(c => c.id === childId);
      if (!child) {
        throw new Error('指定された子どもプロファイルが見つかりません');
      }

      actions.setCurrentChild(child);
    } catch (error: any) {
      console.error('子ども切り替えエラー:', error);
      actions.setError(error.message);
      throw error;
    }
  };

  // ユーザーデータの再取得
  const refreshUserData = async () => {
    try {
      if (!selectors.user) return;

      actions.setLoading(true);
      const userData = await getUserData(selectors.user.uid);
      actions.setUser(selectors.user, userData);
    } catch (error: any) {
      console.error('ユーザーデータ更新エラー:', error);
      actions.setError(error.message);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  };

  return {
    // 状態
    isLoading: selectors.isLoading,
    isAuthenticated: selectors.isAuthenticated,
    user: selectors.user,
    userData: selectors.userData,
    currentChild: selectors.currentChild,
    error: selectors.error,
    hasChildren: selectors.hasChildren,
    canAddChildren: selectors.canAddChildren,
    isChildUnder13: selectors.isChildUnder13,

    // アクション
    register,
    login,
    logout,
    forgotPassword,
    switchChild,
    refreshUserData
  };
}

// 認証が必要なページ用のフック
export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 認証状態の確認が完了し、未認証の場合はログインページにリダイレクト
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  return auth;
}

// 未認証ユーザー用のフック（ログイン・登録ページ用）
export function useGuestOnly() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 認証済みの場合はダッシュボードにリダイレクト
    if (!auth.isLoading && auth.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  return auth;
}