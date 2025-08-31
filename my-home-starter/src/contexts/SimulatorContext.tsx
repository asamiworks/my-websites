// src/contexts/SimulatorContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SimulatorData, HouseSizeData, BuildingLocation } from '../types/simulator';
import { dataManager } from '../utils/dataManager';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastContext';

interface SimulatorContextType {
  data: Partial<SimulatorData>;
  isLoading: boolean;
  isSaving: boolean;
  isEditMode: boolean;
  
  // 編集モード設定
  setEditMode: (editMode: boolean) => void;
  
  // 総予算関連
  updateTotalBudget: (data: {
    totalBudget: number;
    annualIncome: number;
    monthlyLoanRepayment: number;
    downPayment: number;
    spouseIncome?: number;
    spouseLoanRepayment?: number;
    miscCosts?: number;
    buildingBudget?: number;
  }) => Promise<void>;
  
  // 家のサイズ
  updateHouseSize: (data: HouseSizeData & { detailedRoomData?: any }) => Promise<void>;
  
  // 建築地
  updateBuildingLocation: (data: {
    buildingLocation: BuildingLocation;
    ownershipStatus: string;
    landBudget: number;
    parkingCount?: number;
    calculatedArea?: number;
    ultimateAverage?: number;
    areaDescription?: string;
    landPriceSource?: string;
    landPriceYear?: number;
  }) => Promise<void>;
  
  // 診断結果
  updateHouseTypeDiagnosis: (diagnosis: Record<string, number>) => Promise<void>;
  
  // データ取得・保存
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
  clearData: () => void;
  
  // マイグレーション
  migrateData: () => Promise<boolean>;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within SimulatorProvider');
  }
  return context;
};

// 改善された諸経費計算関数
const calculateMiscCosts = (totalBudget: number): number => {
  let rate = 0.08;
  
  if (totalBudget <= 3000) {
    rate = 0.10;
  } else if (totalBudget <= 5000) {
    const excess = totalBudget - 3000;
    const rateReduction = (excess / 2000) * 0.02;
    rate = 0.10 - rateReduction;
  } else {
    const excess = totalBudget - 5000;
    const rateReduction = Math.min(excess / 5000 * 0.02, 0.02);
    rate = 0.08 - rateReduction;
  }
  
  return Math.floor(totalBudget * rate);
};

// 家づくりタイプ別の基準坪単価
const BASE_UNIT_PRICES: { [key: string]: number } = {
  "コスパ重視タイプ": 50,
  "バランス重視タイプ": 65,
  "品質重視タイプ": 70,
  "高性能住宅タイプ": 85,
  "デザイン重視タイプ": 75,
  "個性重視タイプ": 70,
  "機能性重視タイプ": 70,
  "実用性重視タイプ": 60,
};

// 地域係数
const REGION_MULTIPLIERS: { [key: string]: number } = {
  "東京都": 1.3,
  "神奈川県": 1.2,
  "大阪府": 1.15,
  "愛知県": 1.1,
  "埼玉県": 1.1,
  "千葉県": 1.1,
  "福岡県": 1.05,
};

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<Partial<SimulatorData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // loadDataの定義（useEffectの前に移動）
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 認証状態に応じて適切なソースから読み込み
      if (isAuthenticated) {
        // Firestoreから読み込み
        const firestoreData = await dataManager.getFromFirestore();
        if (firestoreData) {
          setData(firestoreData);
        } else {
          // Firestoreにデータがない場合はローカルから読み込み
          const localData = dataManager.getFromLocalStorage();
          if (localData) {
            setData(localData);
            // マイグレーションの提案
            showToast('success', 'ローカルデータが見つかりました。保存しますか？');
          }
        }
      } else {
        // 未認証の場合はローカルストレージから読み込み
        const localData = dataManager.getFromLocalStorage();
        if (localData) {
          setData(localData);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('error', 'データの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, showToast]);

  // 初期データ読み込みとリアルタイムリスナー設定
  useEffect(() => {
    loadData();
    
    // 認証済みの場合はリアルタイムリスナーを設定
    if (isAuthenticated && user) {
      const unsubscribe = dataManager.subscribeToFirestore(
        (firestoreData) => {
          if (firestoreData) {
            setData(firestoreData);
          }
        },
        (error) => {
          console.error('Firestore subscription error:', error);
        }
      );
      
      return () => {
        unsubscribe();
      };
    }
    
    // 認証されていない場合も空の関数を返す
    return () => {};
  }, [isAuthenticated, user, loadData]);

  // データ保存
  const saveData = useCallback(async () => {
    if (!data || Object.keys(data).length === 0) return;

    setIsSaving(true);
    try {
      await dataManager.saveData(data);
      showToast('success', 'データを保存しました');
    } catch (error) {
      console.error('Failed to save data:', error);
      showToast('error', 'データの保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  }, [data, showToast]);

  // 総予算更新（関連データの自動計算付き）
  const updateTotalBudget = useCallback(async (budgetData: {
    totalBudget: number;
    annualIncome: number;
    monthlyLoanRepayment: number;
    downPayment: number;
    spouseIncome?: number;
    spouseLoanRepayment?: number;
    miscCosts?: number;
    buildingBudget?: number;
  }) => {
    // 諸経費と建物予算を自動計算
    const totalBudget = budgetData.totalBudget;
    const miscCosts = budgetData.miscCosts || calculateMiscCosts(totalBudget);
    const landBudget = data.landBudget || 0;
    const buildingBudget = budgetData.buildingBudget || Math.floor(totalBudget - miscCosts - landBudget);

    const updatedData = {
      ...data,
      ...budgetData,
      miscCosts,
      buildingBudget,
    };
    
    setData(updatedData);
    
    // 編集モードかつ認証済みの場合は直接Firebaseに保存
    if (isEditMode && isAuthenticated) {
      try {
        await dataManager.updatePartialData({
          totalBudget,
          annualIncome: budgetData.annualIncome,
          monthlyLoanRepayment: budgetData.monthlyLoanRepayment,
          downPayment: budgetData.downPayment,
          spouseIncome: budgetData.spouseIncome || 0,
          spouseLoanRepayment: budgetData.spouseLoanRepayment || 0,
          miscCosts,
          buildingBudget,
        });
      } catch (error) {
        console.error('Failed to update Firebase:', error);
        showToast('error', 'データの更新に失敗しました');
      }
    } else {
      // 通常モードの場合は自動保存
      try {
        await dataManager.saveData(updatedData);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  }, [data, isEditMode, isAuthenticated, showToast]);

  // 家のサイズ更新（必要予算の再計算付き）
  const updateHouseSize = useCallback(async (houseSizeData: HouseSizeData & { detailedRoomData?: any }) => {
    const updatedData: any = {
      ...data,
      houseSizeData: {
        totalFloorArea: houseSizeData.totalFloorArea,
        floors: houseSizeData.floors,
        ldkSize: houseSizeData.ldkSize,
      },
    };

    // detailedRoomDataがある場合は追加
    if (houseSizeData.detailedRoomData) {
      updatedData.detailedRoomData = houseSizeData.detailedRoomData;
    }
    
    // 必要予算の再計算（家づくりタイプが設定されている場合）
    if (data.houseTypeDiagnosis && data.buildingLocation) {
      const houseType = getHouseTypeFromDiagnosis(data.houseTypeDiagnosis);
      const baseUnitPrice = BASE_UNIT_PRICES[houseType] || 65;
      const regionMultiplier = REGION_MULTIPLIERS[data.buildingLocation.prefecture] || 1.0;
      const sizeMultiplier = getSizeMultiplier(houseSizeData.totalFloorArea);
      
      const requiredUnitPrice = Math.round(baseUnitPrice * regionMultiplier * sizeMultiplier);
      const requiredBuildingBudget = Math.round(houseSizeData.totalFloorArea * requiredUnitPrice);
      
      updatedData.requiredBuildingBudget = requiredBuildingBudget;
      updatedData.requiredUnitPrice = requiredUnitPrice;
    }
    
    setData(updatedData);
    
    // 編集モードかつ認証済みの場合は直接Firebaseに保存
    if (isEditMode && isAuthenticated) {
      try {
        const updatePayload: any = {
          houseSizeData: updatedData.houseSizeData,
        };
        
        if (houseSizeData.detailedRoomData) {
          updatePayload.detailedRoomData = houseSizeData.detailedRoomData;
        }
        
        if (updatedData.requiredBuildingBudget) {
          updatePayload.requiredBuildingBudget = updatedData.requiredBuildingBudget;
          updatePayload.requiredUnitPrice = updatedData.requiredUnitPrice;
        }
        
        await dataManager.updatePartialData(updatePayload);
      } catch (error) {
        console.error('Failed to update Firebase:', error);
        showToast('error', 'データの更新に失敗しました');
      }
    } else {
      // 通常モードの場合は自動保存
      try {
        await dataManager.saveData(updatedData);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  }, [data, isEditMode, isAuthenticated, showToast]);

  // 建築地更新（地域係数による予算への影響を反映）
  const updateBuildingLocation = useCallback(async (locationData: {
    buildingLocation: BuildingLocation;
    ownershipStatus: string;
    landBudget: number;
    parkingCount?: number;
    calculatedArea?: number;
    ultimateAverage?: number;
    areaDescription?: string;
    landPriceSource?: string;
    landPriceYear?: number;
  }) => {
    // 土地購入の変更による建物予算の再計算
    const totalBudget = data.totalBudget || 0;
    const miscCosts = data.miscCosts || calculateMiscCosts(totalBudget);
    const buildingBudget = Math.floor(totalBudget - miscCosts - locationData.landBudget);

    const updatedData = {
      ...data,
      ...locationData,
      buildingBudget,
    };
    
    setData(updatedData);
    
    // 編集モードかつ認証済みの場合は直接Firebaseに保存
    if (isEditMode && isAuthenticated) {
      try {
        const updatePayload: any = {
          buildingLocation: locationData.buildingLocation,
          ownershipStatus: locationData.ownershipStatus,
          landBudget: locationData.landBudget,
          parkingCount: locationData.parkingCount,
          buildingBudget,
        };
        
        // 追加フィールドがある場合は含める
        if (locationData.calculatedArea !== undefined) {
          updatePayload.calculatedArea = locationData.calculatedArea;
        }
        if (locationData.ultimateAverage !== undefined) {
          updatePayload.ultimateAverage = locationData.ultimateAverage;
        }
        if (locationData.areaDescription !== undefined) {
          updatePayload.areaDescription = locationData.areaDescription;
        }
        if (locationData.landPriceSource !== undefined) {
          updatePayload.landPriceSource = locationData.landPriceSource;
        }
        if (locationData.landPriceYear !== undefined) {
          updatePayload.landPriceYear = locationData.landPriceYear;
        }
        
        await dataManager.updatePartialData(updatePayload);
      } catch (error) {
        console.error('Failed to update Firebase:', error);
        showToast('error', 'データの更新に失敗しました');
      }
    } else {
      // 通常モードの場合は自動保存
      try {
        await dataManager.saveData(updatedData);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  }, [data, isEditMode, isAuthenticated, showToast]);

  // 診断結果更新
  const updateHouseTypeDiagnosis = useCallback(async (diagnosis: Record<string, number>) => {
    const updatedData = {
      ...data,
      houseTypeDiagnosis: diagnosis,
    };
    
    setData(updatedData);
    
    // 編集モードかつ認証済みの場合は直接Firebaseに保存
    if (isEditMode && isAuthenticated) {
      try {
        await dataManager.updatePartialData({
          houseTypeDiagnosis: diagnosis,
        });
      } catch (error) {
        console.error('Failed to update Firebase:', error);
        showToast('error', 'データの更新に失敗しました');
      }
    } else {
      // 通常モードの場合は自動保存
      try {
        await dataManager.saveData(updatedData);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  }, [data, isEditMode, isAuthenticated, showToast]);

  // データクリア
  const clearData = useCallback(() => {
    setData({});
    dataManager.clearLocalStorage();
    dataManager.clearCache();
    showToast('success', 'データをクリアしました');
  }, [showToast]);

  // データマイグレーション
  const migrateData = useCallback(async (): Promise<boolean> => {
    try {
      const result = await dataManager.migrateLocalToFirestore();
      if (result) {
        showToast('success', 'データを正常に移行しました');
        // 移行後に再読み込み
        setIsLoading(true);
        try {
          if (isAuthenticated) {
            const firestoreData = await dataManager.getFromFirestore();
            if (firestoreData) {
              setData(firestoreData);
            }
          }
        } finally {
          setIsLoading(false);
        }
      }
      return result;
    } catch (error) {
      console.error('Migration failed:', error);
      showToast('error', 'データの移行に失敗しました');
      return false;
    }
  }, [showToast, isAuthenticated]);

  const value: SimulatorContextType = {
    data,
    isLoading,
    isSaving,
    isEditMode,
    setEditMode,
    updateTotalBudget,
    updateHouseSize,
    updateBuildingLocation,
    updateHouseTypeDiagnosis,
    loadData,
    saveData,
    clearData,
    migrateData,
  };

  return (
    <SimulatorContext.Provider value={value}>
      {children}
    </SimulatorContext.Provider>
  );
};

// ヘルパー関数
function getHouseTypeFromDiagnosis(diagnosis: Record<string, number>): string {
  const q1 = diagnosis.q1 || 0;
  const q2 = diagnosis.q2 || 0;
  
  if (q1 === 1 && q2 === 1) return "高性能住宅タイプ";
  if (q1 === 2 && q2 === 2) return "コスパ重視タイプ";
  if (q1 === 3 && q2 === 3) return "デザイン重視タイプ";
  if (q1 === 4 && q2 === 4) return "機能性重視タイプ";
  
  const average = (q1 + q2) / 2;
  if (average <= 1.5) return "品質重視タイプ";
  if (average <= 2.5) return "バランス重視タイプ";
  if (average <= 3.5) return "個性重視タイプ";
  return "実用性重視タイプ";
}

function getSizeMultiplier(size: number): number {
  if (size <= 20) return 1.2;
  if (size <= 25) return 1.1;
  if (size <= 30) return 1.0;
  if (size <= 35) return 0.95;
  if (size <= 40) return 0.9;
  return 0.85;
}