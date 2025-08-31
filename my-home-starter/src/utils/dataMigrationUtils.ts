// src/utils/dataMigrationUtils.ts

import { dataManager } from './dataManager';
import { SimulatorData } from '../types/simulator';

/**
 * 既存のlocalStorageベースのコードからdataManagerへの段階的移行を支援するユーティリティ
 */

// localStorage のキーマッピング
const STORAGE_KEY_MAPPING: Record<string, keyof SimulatorData> = {
  'totalBudget': 'totalBudget',
  'annualIncome': 'annualIncome',
  'monthlyLoanRepayment': 'monthlyLoanRepayment',
  'downPayment': 'downPayment',
  'spouseIncome': 'spouseIncome',
  'spouseLoanRepayment': 'spouseLoanRepayment',
  'houseSizeData': 'houseSizeData',
  'buildingLocation': 'buildingLocation',
  'ownershipStatus': 'ownershipStatus',
  'landBudget': 'landBudget',
  'parkingCount': 'parkingCount',
  'houseTypeDiagnosis': 'houseTypeDiagnosis',
};

/**
 * 既存のlocalStorageからdataManager形式にデータを変換
 */
export const convertLocalStorageToDataManager = (): Partial<SimulatorData> => {
  const data: Partial<SimulatorData> = {};

  Object.entries(STORAGE_KEY_MAPPING).forEach(([localKey, dataKey]) => {
    const storedValue = localStorage.getItem(localKey);
    if (storedValue) {
      try {
        const parsedValue = JSON.parse(storedValue);
        (data as any)[dataKey] = parsedValue;
      } catch (error) {
        // パースエラーは無視
      }
    }
  });

  return data;
};

/**
 * dataManagerからlocalStorage形式にデータを変換して保存
 * （既存のシミュレータとの互換性のため）
 */
export const syncDataManagerToLocalStorage = async (): Promise<void> => {
  try {
    let data: SimulatorData | null = null;

    // 認証状態に応じてデータを取得
    const { isAuthenticated } = dataManager.getAuthStatus();
    if (isAuthenticated) {
      data = await dataManager.getFromFirestore();
    } else {
      data = dataManager.getFromLocalStorage();
    }

    if (!data) return;

    // 各フィールドを個別のlocalStorageキーとして保存
    Object.entries(STORAGE_KEY_MAPPING).forEach(([localKey, dataKey]) => {
      const value = (data as any)[dataKey];
      if (value !== undefined && value !== null) {
        localStorage.setItem(localKey, JSON.stringify(value));
      }
    });
  } catch (err) {
    // エラーは無視
  }
};

/**
 * 既存のlocalStorageデータをdataManagerに移行
 */
export const migrateExistingData = async (): Promise<boolean> => {
  try {
    const existingData = convertLocalStorageToDataManager();
    
    if (Object.keys(existingData).length === 0) {
      return false;
    }

    // dataManagerに保存
    await dataManager.saveData(existingData);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * localStorageとdataManagerの両方にデータを保存
 * （移行期間中の互換性維持のため）
 */
export const saveDataCompat = async (
  key: string,
  value: any,
  saveToDataManager: boolean = true
): Promise<void> => {
  // 従来のlocalStorageへの保存
  localStorage.setItem(key, JSON.stringify(value));

  // dataManagerへの保存
  if (saveToDataManager && STORAGE_KEY_MAPPING[key]) {
    const dataKey = STORAGE_KEY_MAPPING[key];
    await dataManager.saveData({
      [dataKey]: value
    } as Partial<SimulatorData>);
  }
};

/**
 * データ取得の互換レイヤー
 * dataManagerから取得を試み、なければlocalStorageから取得
 */
export const getDataCompat = async (key: string): Promise<any> => {
  const dataKey = STORAGE_KEY_MAPPING[key];
  
  if (dataKey) {
    // まずdataManagerから取得を試みる
    let data: SimulatorData | null = null;
    
    const { isAuthenticated } = dataManager.getAuthStatus();
    if (isAuthenticated) {
      data = await dataManager.getFromFirestore();
    } else {
      data = dataManager.getFromLocalStorage();
    }

    if (data && (data as any)[dataKey] !== undefined) {
      return (data as any)[dataKey];
    }
  }

  // dataManagerになければlocalStorageから取得
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    try {
      return JSON.parse(storedValue);
    } catch {
      return storedValue;
    }
  }

  return null;
};

/**
 * 初期化時のデータチェックと移行
 */
export const initializeDataMigration = async (): Promise<void> => {
  try {
    const { isAuthenticated } = dataManager.getAuthStatus();

    if (isAuthenticated) {
      // ログイン済みの場合
      const hasFirestoreData = await dataManager.getFromFirestore();
      const hasLocalData = dataManager.hasLocalData();
      const hasLegacyData = Object.keys(convertLocalStorageToDataManager()).length > 0;

      if (!hasFirestoreData && (hasLocalData || hasLegacyData)) {
        // Firestoreにデータがなく、ローカルにデータがある場合は移行
        
        // レガシーデータがある場合は先に変換
        if (hasLegacyData && !hasLocalData) {
          await migrateExistingData();
        }
        
        // Firestoreへ移行
        await dataManager.migrateLocalToFirestore();
      } else if (hasFirestoreData) {
        // Firestoreのデータで既存のlocalStorageを更新
        await syncDataManagerToLocalStorage();
      }
    } else {
      // 未ログインの場合
      const hasLocalData = dataManager.hasLocalData();
      const hasLegacyData = Object.keys(convertLocalStorageToDataManager()).length > 0;

      if (!hasLocalData && hasLegacyData) {
        // レガシーデータをdataManager形式に移行
        await migrateExistingData();
      }
    }
  } catch (err) {
    // エラーは無視
  }
};