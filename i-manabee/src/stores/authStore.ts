// 認証状態管理 - Zustand Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User as FirebaseUser } from 'firebase/auth';
import { User, Child } from '@/types';

interface AuthState {
  // 認証状態
  isLoading: boolean;
  isAuthenticated: boolean;

  // ユーザー情報
  firebaseUser: FirebaseUser | null;
  userData: User | null;
  currentChild: Child | null;

  // エラー状態
  error: string | null;

  // アクション
  setLoading: (loading: boolean) => void;
  setUser: (firebaseUser: FirebaseUser | null, userData?: User | null) => void;
  setCurrentChild: (child: Child | null) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  updateUserData: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初期状態
      isLoading: true,
      isAuthenticated: false,
      firebaseUser: null,
      userData: null,
      currentChild: null,
      error: null,

      // ローディング状態の設定
      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      // ユーザー設定
      setUser: (firebaseUser: FirebaseUser | null, userData?: User | null) =>
        set({
          firebaseUser,
          userData: userData ?? null,
          isAuthenticated: !!firebaseUser,
          isLoading: false,
          error: null,
          // ユーザーが変わったら子どもも初期化
          currentChild: firebaseUser ? get().currentChild : null
        }),

      // 現在の子ども設定
      setCurrentChild: (child: Child | null) =>
        set({ currentChild: child }),

      // エラー設定
      setError: (error: string | null) =>
        set({
          error,
          isLoading: false
        }),

      // 認証状態クリア
      clearAuth: () =>
        set({
          isLoading: false,
          isAuthenticated: false,
          firebaseUser: null,
          userData: null,
          currentChild: null,
          error: null
        }),

      // ユーザーデータ更新
      updateUserData: (updates: Partial<User>) =>
        set((state) => ({
          userData: state.userData ? { ...state.userData, ...updates } : null
        }))
    }),
    {
      name: 'auth-storage',
      // セキュリティ上、Firebase Userオブジェクトは永続化しない
      partialize: (state) => ({
        userData: state.userData,
        currentChild: state.currentChild,
      }),
    }
  )
);

// セレクター（最適化のため）
export const useAuthSelectors = () => {
  const store = useAuthStore();

  return {
    // 基本状態
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    error: store.error,

    // ユーザー情報
    user: store.firebaseUser,
    userData: store.userData,
    currentChild: store.currentChild,

    // 計算されたプロパティ
    hasChildren: store.userData?.children?.length ?? 0 > 0,
    canAddChildren: () => {
      if (!store.userData) return false;
      const plan = store.userData.plan;
      const currentCount = store.userData.children?.length ?? 0;

      const limits = {
        free: 1,
        kids: 1,
        friends: 3,
        premium: 5
      };

      return currentCount < limits[plan];
    },

    // 子ども年齢確認
    isChildUnder13: () => {
      if (!store.currentChild) return false;
      const birth = new Date(store.currentChild.birthMonth + '-01');
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      return (monthDiff < 0 ? age - 1 : age) < 13;
    }
  };
};

// アクションのみを取得するセレクター
export const useAuthActions = () => {
  const store = useAuthStore();

  return {
    setLoading: store.setLoading,
    setUser: store.setUser,
    setCurrentChild: store.setCurrentChild,
    setError: store.setError,
    clearAuth: store.clearAuth,
    updateUserData: store.updateUserData
  };
};