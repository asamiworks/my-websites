// 認証用カスタムフック
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser } from 'firebase/auth';
import {
  auth,
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
  isLoading: boolean;
  isAuthenticated: boolean;
  user: FirebaseUser | null;
  userData: User | null;
  currentChild: any;
  error: string | null;
  hasChildren: boolean;
  canAddChildren: () => boolean;
  isChildUnder13: () => boolean;
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
  const initRef = useRef(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const errorCountRef = useRef(0);
  const MAX_ERROR_RETRIES = 1; // エラー時の最大試行回数

  // Firebase認証状態の監視（一度だけ実行）
  useEffect(() => {
    // 既に初期化済みの場合はスキップ
    if (initRef.current) return;
    
    // 環境変数の状態をチェック（デバッグ用）
    if (typeof window !== 'undefined') {
      const envCheck = {
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        nodeEnv: process.env.NODE_ENV,
        // 最初の数文字だけ表示（セキュリティのため）
        apiKeyPreview: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
        projectIdValue: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      };
      console.log('🔍 Environment check:', envCheck);
      
      // Firebase authが正常に初期化されているか確認
      console.log('🔍 Firebase auth instance:', auth ? '✅ Available' : '❌ Not available');
    }

    const initAuth = async () => {
      try {
        // エラーカウントをチェック（無限ループ防止）
        if (errorCountRef.current >= MAX_ERROR_RETRIES) {
          console.error('認証の初期化に失敗しました（最大試行回数に到達）');
          actions.setError('Firebase認証の初期化に失敗しました。環境設定を確認してください。');
          actions.setLoading(false);
          return;
        }

        console.log('🔄 認証初期化開始');
        initRef.current = true;
        actions.setLoading(true);

        // authインスタンスの存在確認
        if (!auth) {
          console.error('❌ authインスタンスが存在しません');
          actions.setError('Firebase認証が正しく設定されていません');
          actions.setLoading(false);
          return;
        }

        console.log('📡 Firebase認証リスナー設定中...');
        
        // エミュレータ使用時は即座に未認証状態を設定
        setTimeout(() => {
          console.log('🔍 認証状態を手動チェック中...');
          const currentUser = auth.currentUser;
          if (currentUser === null && actions.setLoading) {
            console.log('⏱️ 初回チェック: 未認証状態を設定');
            actions.clearAuth();
            actions.setLoading(false);
          }
        }, 100); // 100ms後にチェック
        
        // タイムアウトを設定（エミュレータ対策）
        const timeoutId = setTimeout(() => {
          console.log('⏱️ タイムアウト: 認証状態の確認がタイムアウトしました');
          if (actions.setLoading) {
            console.log('⏱️ Loading状態を強制的にfalseに設定');
            actions.setLoading(false);
          }
        }, 1000); // 1秒待つ
        
        // Firebase認証の監視を開始
        unsubscribeRef.current = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          clearTimeout(timeoutId); // タイムアウトをクリア
          console.log('🔔 認証状態変更検出:', firebaseUser ? 'ログイン済み' : '未ログイン');
          
          if (firebaseUser) {
            try {
              console.log('👤 ユーザーID:', firebaseUser.uid);
              const userData = await getUserData(firebaseUser.uid);
              console.log('✅ ユーザーデータ取得成功');
              actions.setUser(firebaseUser, userData);
              errorCountRef.current = 0; // 成功したらエラーカウントをリセット
            } catch (error) {
              console.error('❌ ユーザーデータ取得エラー:', error);
              actions.setError('ユーザー情報の取得に失敗しました');
            }
          } else {
            console.log('🔓 未認証状態を設定');
            actions.clearAuth();
          }
          
          console.log('✅ Loading状態をfalseに設定');
          actions.setLoading(false);
        });
        
        console.log('✅ 認証リスナー設定完了');
      } catch (error: any) {
        errorCountRef.current++;
        console.error(`❌ 認証初期化エラー (試行 ${errorCountRef.current}/${MAX_ERROR_RETRIES}):`, error);
        
        // Firebase設定エラーの場合は詳細なメッセージを表示
        if (error.message?.includes('Firebase設定')) {
          actions.setError(
            '環境変数が正しく設定されていません。' +
            '\n1. .env.localファイルが存在することを確認' +
            '\n2. NEXT_PUBLIC_で始まる変数名を使用' +
            '\n3. npm run devを再起動'
          );
        } else {
          actions.setError(error.message || '認証の初期化に失敗しました');
        }
        
        actions.setLoading(false);
        initRef.current = false; // エラーの場合は初期化フラグをリセット
      }
    };

    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      initAuth();
    }

    // クリーンアップ
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []); // 空の依存配列 - 一度だけ実行

  // ユーザー登録
  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      actions.setLoading(true);
      actions.setError(null);
      const { user, userData } = await registerUser(email, password, displayName);
      actions.setUser(user, userData);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('登録エラー:', error);
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'このメールアドレスは既に使用されています'
        : error.code === 'auth/weak-password'
        ? 'パスワードは6文字以上で設定してください'
        : error.code === 'auth/invalid-email'
        ? '有効なメールアドレスを入力してください'
        : error.message;
      actions.setError(errorMessage);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }, [actions, router]);

  // ログイン
  const login = useCallback(async (email: string, password: string) => {
    try {
      actions.setLoading(true);
      actions.setError(null);
      const user = await loginUser(email, password);
      const userData = await getUserData(user.uid);
      actions.setUser(user, userData);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('ログインエラー:', error);
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'ユーザーが見つかりません'
        : error.code === 'auth/wrong-password'
        ? 'パスワードが間違っています'
        : error.code === 'auth/invalid-email'
        ? '有効なメールアドレスを入力してください'
        : error.code === 'auth/too-many-requests'
        ? 'ログイン試行回数が多すぎます。しばらくしてから再度お試しください'
        : error.message;
      actions.setError(errorMessage);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }, [actions, router]);

  // ログアウト
  const logout = useCallback(async () => {
    try {
      actions.setLoading(true);
      await logoutUser();
      actions.clearAuth();
      router.push('/');
    } catch (error: any) {
      console.error('ログアウトエラー:', error);
      actions.setError(error.message);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }, [actions, router]);

  // パスワードリセット
  const forgotPassword = useCallback(async (email: string) => {
    try {
      actions.setLoading(true);
      actions.setError(null);
      await resetPassword(email);
    } catch (error: any) {
      console.error('パスワードリセットエラー:', error);
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'ユーザーが見つかりません'
        : error.code === 'auth/invalid-email'
        ? '有効なメールアドレスを入力してください'
        : error.message;
      actions.setError(errorMessage);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  // 子どもの切り替え
  const switchChild = useCallback(async (childId: string) => {
    try {
      const userData = selectors.userData as any; // 型の問題を一時的に回避
      if (!userData?.children) {
        throw new Error('子どもプロファイルが見つかりません');
      }
      const child = userData.children.find((c: any) => c.id === childId);
      if (!child) {
        throw new Error('指定された子どもプロファイルが見つかりません');
      }
      actions.setCurrentChild(child);
    } catch (error: any) {
      console.error('子ども切り替えエラー:', error);
      actions.setError(error.message);
      throw error;
    }
  }, [actions, selectors.userData]);

  // ユーザーデータの再取得
  const refreshUserData = useCallback(async () => {
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
  }, [actions, selectors.user]);

  return {
    isLoading: selectors.isLoading,
    isAuthenticated: selectors.isAuthenticated,
    user: selectors.user,
    userData: selectors.userData,
    currentChild: selectors.currentChild,
    error: selectors.error,
    hasChildren: selectors.hasChildren,
    canAddChildren: selectors.canAddChildren,
    isChildUnder13: selectors.isChildUnder13,
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
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  return auth;
}

// 未認証ユーザー用のフック
export function useGuestOnly() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  return auth;
}