// src/hooks/useUserData.ts

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { dataManager } from '../utils/dataManager';
import { UserState, SimulatorData } from '../types/simulator';

const initialState: UserState = {
  totalBudget: 0,
  annualIncome: 0,
  monthlyLoanRepayment: 0,
  downPayment: 0,
  spouseIncome: 0,
  spouseLoanRepayment: 0,
  nickname: 'ゲスト',
  ownershipStatus: '未設定',
  landBudget: 0,
  houseSizeData: {
    totalFloorArea: 0,
    floors: 0,
    ldkSize: 0,
  },
  buildingLocation: { prefecture: '', city: '' },
  unreadMessages: 0,
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserState>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データを取得（dataManager経由）
  const fetchUserData = useCallback(async (userId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let data: SimulatorData | null = null;

      // 認証状態を確認
      const { isAuthenticated } = dataManager.getAuthStatus();
      
      if (isAuthenticated && userId) {
        // ログイン済み：Firestoreから取得
        data = await dataManager.getFromFirestore();
        
        // Firestoreにデータがない場合、ローカルストレージを確認
        if (!data && dataManager.hasLocalData()) {
          // ローカルストレージのデータを移行
          const migrated = await dataManager.migrateLocalToFirestore();
          if (migrated) {
            data = await dataManager.getFromFirestore();
          }
        }
      } else {
        // 未ログイン：ローカルストレージから取得
        data = dataManager.getFromLocalStorage();
      }

      if (data) {
        setUserData({
          ...initialState,
          ...data,
          nickname: data.name || auth.currentUser?.displayName || 'ゲスト',
          unreadMessages: (data as any).unreadMessages || 0,
        });
      } else {
        setUserData(initialState);
      }
    } catch (err) {
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 認証状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        // 未ログイン時もローカルストレージから取得を試みる
        fetchUserData();
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  // データを更新（dataManager経由）
  const updateUserData = useCallback(async (updates: Partial<SimulatorData>) => {
    try {
      setError(null);
      
      // dataManagerを通じて保存（認証状態に応じて自動判定）
      await dataManager.saveData(updates);
      
      // ローカルステートも更新
      setUserData(prev => ({ ...prev, ...updates }));
    } catch (err) {
      setError('データの更新に失敗しました');
      throw err; // エラーを再スローして呼び出し元で処理できるように
    }
  }, []);

  // データをリフレッシュ
  const refreshData = useCallback(async () => {
    const user = auth.currentUser;
    await fetchUserData(user?.uid);
  }, [fetchUserData]);

  return {
    userData,
    loading,
    error,
    updateUserData,
    refetch: refreshData,
    hasLocalData: dataManager.hasLocalData(),
    isAuthenticated: dataManager.getAuthStatus().isAuthenticated,
  };
};