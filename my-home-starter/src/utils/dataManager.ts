// src/utils/dataManager.ts

import { auth, db } from './firebaseConfig';
import { doc, setDoc, getDoc, onSnapshot, Unsubscribe, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { SimulatorData } from '../types/simulator';

interface DataManagerOptions {
  maxRetries?: number;
  retryDelay?: number;
  enableCache?: boolean;
  cacheTimeout?: number;
}

class DataManager {
  private localStorageKey = 'simulator_data';
  private isAuthenticated: boolean = false;
  private currentUserId: string | null = null;
  private cache: Map<string, { data: SimulatorData; timestamp: number }> = new Map();
  private listeners: Map<string, Unsubscribe> = new Map();
  private options: Required<DataManagerOptions>;

  constructor(options: DataManagerOptions = {}) {
    this.options = {
      maxRetries: 3,
      retryDelay: 1000,
      enableCache: true,
      cacheTimeout: 5 * 60 * 1000, // 5分
      ...options
    };

    // ブラウザ環境でのみ認証状態を監視
    if (typeof window !== 'undefined') {
      onAuthStateChanged(auth, (user) => {
        this.isAuthenticated = !!user;
        this.currentUserId = user?.uid || null;
        
        // ユーザーが変わったらキャッシュをクリア
        if (user?.uid !== this.currentUserId) {
          this.clearCache();
        }
      });
    }
  }

  // リトライ機能付きの非同期処理実行
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.error(`${operationName} - 試行 ${attempt + 1}/${this.options.maxRetries} 失敗:`, error);
        
        if (attempt < this.options.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, this.options.retryDelay * (attempt + 1)));
        }
      }
    }
    
    throw lastError;
  }

  // データを保存（認証状態に応じて自動判定）
  async saveData(data: Partial<SimulatorData>): Promise<void> {
    const timestamp = new Date();
    const dataWithTimestamp = {
      ...data,
      updatedAt: timestamp
    };

    if (this.isAuthenticated && this.currentUserId) {
      try {
        // ログイン済み：Firestoreに保存
        await this.saveToFirestore(dataWithTimestamp);
      } catch (error) {
        console.error('Firestore保存エラー、ローカルストレージにフォールバック:', error);
        // フォールバック：ローカルストレージに保存
        this.saveToLocalStorage(dataWithTimestamp);
        throw error; // エラーは再スローして呼び出し元に通知
      }
    } else {
      // 未ログイン：ローカルストレージに保存
      this.saveToLocalStorage(dataWithTimestamp);
    }
  }

  // 部分更新メソッド
  async updatePartialData(partialData: Partial<SimulatorData>): Promise<void> {
    if (!this.currentUserId) {
      throw new Error('ユーザーが認証されていません');
    }

    await this.executeWithRetry(async () => {
      const docRef = doc(db, 'users', this.currentUserId!);
      
      // serverTimestampを使用してupdatedAtを自動更新
      const dataToUpdate = {
        ...partialData,
        updatedAt: serverTimestamp(),
        lastPartialSyncedAt: serverTimestamp()
      };
      
      // Firestoreに部分更新
      await updateDoc(docRef, dataToUpdate);
      
      // キャッシュも更新
      if (this.options.enableCache) {
        const existingCache = this.cache.get(this.currentUserId!);
        if (existingCache) {
          // 既存のキャッシュデータとマージ
          const updatedData = {
            ...existingCache.data,
            ...partialData,
            updatedAt: new Date(),
            lastPartialSyncedAt: new Date()
          };
          
          this.cache.set(this.currentUserId!, {
            data: updatedData,
            timestamp: Date.now()
          });
        }
      }
      
      // ローカルストレージも更新（オプション）
      // 編集モードでもローカルとの同期を保ちたい場合
      try {
        const existingLocalData = this.getFromLocalStorage();
        if (existingLocalData) {
          this.saveToLocalStorage({
            ...existingLocalData,
            ...partialData
          });
        }
      } catch (error) {
        console.warn('ローカルストレージの更新に失敗しました:', error);
        // ローカルストレージの更新失敗は無視（Firestoreが主）
      }
    }, 'Firestore部分更新');
  }

  // ローカルストレージから取得（SSRセーフ版）
  getFromLocalStorage(): SimulatorData | null {
    // SSRチェック - サーバーサイドでは null を返す
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      // キャッシュチェック
      if (this.options.enableCache) {
        const cached = this.cache.get('local');
        if (cached && Date.now() - cached.timestamp < this.options.cacheTimeout) {
          return cached.data;
        }
      }

      // まず統合されたデータを確認
      const data = localStorage.getItem(this.localStorageKey);
      if (data) {
        const parsedData = JSON.parse(data);
        
        // キャッシュに保存
        if (this.options.enableCache) {
          this.cache.set('local', {
            data: parsedData,
            timestamp: Date.now()
          });
        }
        
        return parsedData;
      }

      // 統合データがない場合は個別のキーから構築
      const individualData: Record<string, any> = {};
      const keys = [
        'totalBudget',
        'annualIncome',
        'monthlyLoanRepayment',
        'downPayment',
        'spouseIncome',
        'spouseLoanRepayment',
        'houseSizeData',
        'ownershipStatus',
        'landBudget',
        'calculatedArea',
        'selectedPrefecture',
        'selectedCity',
        'q1',
        'q2',
        'pricePerTsubo',
        'detailedRoomData',
        'buildingLocation',
        'parkingCount',
        'houseTypeDiagnosis'
      ];

      let hasData = false;
      keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) {
          try {
            individualData[key] = JSON.parse(value);
            hasData = true;
          } catch {
            individualData[key] = value;
            hasData = true;
          }
        }
      });

      if (!hasData) {
        return null;
      }

      // データ構造の変換
      // buildingLocationオブジェクトを構築
      if ((individualData.selectedPrefecture || individualData.selectedCity) && !individualData.buildingLocation) {
        individualData.buildingLocation = {
          prefecture: individualData.selectedPrefecture || '',
          city: individualData.selectedCity || ''
        };
      }

      // houseTypeDiagnosisオブジェクトを構築
      if ((individualData.q1 !== undefined || individualData.q2 !== undefined) && !individualData.houseTypeDiagnosis) {
        individualData.houseTypeDiagnosis = {
          q1: individualData.q1 || 0,
          q2: individualData.q2 || 0
        };
      }

      // キャッシュに保存
      if (this.options.enableCache) {
        this.cache.set('local', {
          data: individualData as SimulatorData,
          timestamp: Date.now()
        });
      }
      
      return individualData as SimulatorData;
    } catch (error) {
      console.error('ローカルストレージからのデータ取得エラー:', error);
      return null;
    }
  }

  // ローカルストレージに保存（SSRセーフ版）
  private saveToLocalStorage(data: Partial<SimulatorData>): void {
    // SSRチェック
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const existingData = this.getFromLocalStorage();
      const updatedData: Record<string, any> = {
        ...existingData,
        ...data,
        updatedAt: data.updatedAt || new Date()
      };
      
      // 統合データとして保存
      localStorage.setItem(this.localStorageKey, JSON.stringify(updatedData));
      
      // 個別のキーとしても保存（互換性のため）
      // buildingLocationを展開
      if (updatedData.buildingLocation) {
        if (updatedData.buildingLocation.prefecture) {
          localStorage.setItem('selectedPrefecture', updatedData.buildingLocation.prefecture);
        }
        if (updatedData.buildingLocation.city) {
          localStorage.setItem('selectedCity', updatedData.buildingLocation.city);
        }
      }

      // houseTypeDiagnosisを展開
      if (updatedData.houseTypeDiagnosis) {
        if (updatedData.houseTypeDiagnosis.q1 !== undefined) {
          localStorage.setItem('q1', String(updatedData.houseTypeDiagnosis.q1));
        }
        if (updatedData.houseTypeDiagnosis.q2 !== undefined) {
          localStorage.setItem('q2', String(updatedData.houseTypeDiagnosis.q2));
        }
      }

      // その他の個別キーも保存
      const individualKeys = [
        'totalBudget',
        'annualIncome',
        'monthlyLoanRepayment',
        'downPayment',
        'spouseIncome',
        'spouseLoanRepayment',
        'houseSizeData',
        'ownershipStatus',
        'landBudget',
        'calculatedArea',
        'pricePerTsubo',
        'detailedRoomData',
        'parkingCount'
      ];

      individualKeys.forEach(key => {
        if (updatedData[key] !== undefined) {
          const value = typeof updatedData[key] === 'object' 
            ? JSON.stringify(updatedData[key]) 
            : String(updatedData[key]);
          localStorage.setItem(key, value);
        }
      });
      
      // キャッシュも更新
      if (this.options.enableCache) {
        this.cache.set('local', {
          data: updatedData as SimulatorData,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      // ストレージがフルの場合は古いデータを削除して再試行
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearOldLocalStorageData();
        // 再試行
        try {
          const existingData = this.getFromLocalStorage();
          const updatedData = { ...existingData, ...data };
          localStorage.setItem(this.localStorageKey, JSON.stringify(updatedData));
        } catch (retryError) {
          throw retryError;
        }
      } else {
        throw error;
      }
    }
  }

  // 古いローカルストレージデータを削除
  private clearOldLocalStorageData(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('simulator_') && key !== this.localStorageKey) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Firestoreに保存
  private async saveToFirestore(data: Partial<SimulatorData>): Promise<void> {
    if (!this.currentUserId) {
      throw new Error('ユーザーIDが存在しません');
    }

    await this.executeWithRetry(async () => {
      const docRef = doc(db, 'users', this.currentUserId!);
      await setDoc(docRef, data, { merge: true });
      
      // キャッシュも更新
      if (this.options.enableCache) {
        const existingCache = this.cache.get(this.currentUserId!);
        const updatedData = existingCache 
          ? { ...existingCache.data, ...data }
          : data as SimulatorData;
          
        this.cache.set(this.currentUserId!, {
          data: updatedData,
          timestamp: Date.now()
        });
      }
    }, 'Firestore保存');
  }

  // Firestoreから取得
  async getFromFirestore(): Promise<SimulatorData | null> {
    if (!this.currentUserId) return null;

    // キャッシュチェック
    if (this.options.enableCache) {
      const cached = this.cache.get(this.currentUserId);
      if (cached && Date.now() - cached.timestamp < this.options.cacheTimeout) {
        return cached.data;
      }
    }

    return await this.executeWithRetry(async () => {
      const docRef = doc(db, 'users', this.currentUserId!);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as SimulatorData;
        
        // キャッシュに保存
        if (this.options.enableCache) {
          this.cache.set(this.currentUserId!, {
            data,
            timestamp: Date.now()
          });
        }
        
        return data;
      }
      return null;
    }, 'Firestoreデータ取得');
  }

  // リアルタイムリスナーを設定
  subscribeToFirestore(
    callback: (data: SimulatorData | null) => void,
    onError?: (error: Error) => void
  ): () => void {
    if (!this.currentUserId) {
      return () => {};
    }

    // 既存のリスナーがあれば削除
    this.unsubscribeFromFirestore();

    const docRef = doc(db, 'users', this.currentUserId);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SimulatorData;
          
          // キャッシュを更新
          if (this.options.enableCache && this.currentUserId) {
            this.cache.set(this.currentUserId, {
              data,
              timestamp: Date.now()
            });
          }
          
          callback(data);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Firestoreリスナーエラー:', error);
        onError?.(error);
      }
    );

    this.listeners.set(this.currentUserId, unsubscribe);
    
    // クリーンアップ関数を返す
    return () => this.unsubscribeFromFirestore();
  }

  // リアルタイムリスナーを解除
  private unsubscribeFromFirestore(): void {
    if (this.currentUserId && this.listeners.has(this.currentUserId)) {
      const unsubscribe = this.listeners.get(this.currentUserId);
      unsubscribe?.();
      this.listeners.delete(this.currentUserId);
    }
  }

  // ローカルストレージからFirestoreへ移行
  async migrateLocalToFirestore(): Promise<boolean> {
    if (!this.isAuthenticated || !this.currentUserId) {
      return false;
    }

    try {
      // ローカルストレージからデータ取得
      const localData = this.getFromLocalStorage();
      if (!localData) {
        return false;
      }

      // 既存のFirestoreデータを確認
      const existingData = await this.getFromFirestore();
      
      // 既存データがある場合は確認が必要
      if (existingData) {
        const shouldOverwrite = await this.confirmOverwrite(localData, existingData);
        if (!shouldOverwrite) {
          return false;
        }
      }

      // Firestoreに保存（リトライ付き）
      await this.saveToFirestore({
        ...localData,
        migratedAt: new Date()
      });

      // ローカルストレージをクリア
      this.clearLocalStorage();
      
      return true;
    } catch (error) {
      console.error('データ移行エラー:', error);
      return false;
    }
  }

  // 上書き確認（UIコンポーネントで実装）
  private async confirmOverwrite(
    localData: SimulatorData,
    existingData: SimulatorData
  ): Promise<boolean> {
    // この関数は実際のUIコンポーネントで上書きして使用
    // デフォルトでは最新のデータを採用
    const localUpdated = (localData.updatedAt as any)?.getTime?.() || 0;
    const existingUpdated = (existingData.updatedAt as any)?.getTime?.() || 0;
    
    return localUpdated > existingUpdated;
  }

  // ローカルストレージをクリア（SSRセーフ版）
  clearLocalStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // 統合データを削除
    localStorage.removeItem(this.localStorageKey);
    
    // 個別のキーも削除
    const keysToRemove = [
      'totalBudget',
      'annualIncome',
      'monthlyLoanRepayment',
      'downPayment',
      'spouseIncome',
      'spouseLoanRepayment',
      'houseSizeData',
      'ownershipStatus',
      'landBudget',
      'calculatedArea',
      'selectedPrefecture',
      'selectedCity',
      'q1',
      'q2',
      'pricePerTsubo',
      'detailedRoomData',
      'buildingLocation',
      'parkingCount',
      'houseTypeDiagnosis'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    this.cache.delete('local');
  }

  // キャッシュをクリア
  clearCache(): void {
    this.cache.clear();
  }

  // データの存在確認（SSRセーフ版）
  hasLocalData(): boolean {
    // SSRチェック
    if (typeof window === 'undefined') {
      return false;
    }
    return !!this.getFromLocalStorage();
  }

  // 認証状態の確認
  getAuthStatus(): { isAuthenticated: boolean; userId: string | null } {
    return {
      isAuthenticated: this.isAuthenticated,
      userId: this.currentUserId
    };
  }
}

// シングルトンインスタンスをエクスポート
export const dataManager = new DataManager({
  maxRetries: 3,
  retryDelay: 1000,
  enableCache: true,
  cacheTimeout: 5 * 60 * 1000 // 5分
});