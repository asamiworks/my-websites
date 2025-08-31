// src/utils/migrateLegacyData.ts

import { dataManager } from './dataManager';
import { SimulatorData } from '../types/simulator';

// レガシーデータの型定義
interface LegacyData extends Partial<SimulatorData> {
  selectedPrefecture?: string;
  selectedCity?: string;
  q1?: number;
  q2?: number;
}

/**
 * 古いsyncLocalStorageWithFirebaseの代替
 * dataManagerを使用してより効率的にデータを移行
 */
export const migrateLegacyData = async (): Promise<boolean> => {
  try {
    // dataManagerの移行機能を使用
    const result = await dataManager.migrateLocalToFirestore();
    
    if (result) {
      // 移行成功後、古いキーをクリーンアップ
      cleanupLegacyKeys();
    }
    
    return result;
  } catch (error) {
    return false;
  }
};

/**
 * 古いlocalStorageキーをクリーンアップ
 * dataManager形式でない個別のキーを削除
 */
const cleanupLegacyKeys = (): void => {
  const legacyKeys = [
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
    'pricePerTsubo'
  ];

  // simulator_data キーは保持（dataManagerが使用）
  legacyKeys.forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * 建築地情報を統合する
 * 古いデータ形式から新しい形式に変換
 */
export const consolidateBuildingLocation = (data: LegacyData): Partial<SimulatorData> => {
  // データをコピー（元のデータを変更しない）
  const result = { ...data };
  
  // レガシーキーを一時的に保存
  const { selectedPrefecture, selectedCity, q1, q2, ...cleanData } = result;

  // 建築地情報を統合
  if (selectedPrefecture !== undefined || selectedCity !== undefined) {
    cleanData.buildingLocation = {
      prefecture: selectedPrefecture || '',
      city: selectedCity || ''
    };
  }

  // 診断結果を統合
  if (q1 !== undefined || q2 !== undefined) {
    cleanData.houseTypeDiagnosis = {} as Record<string, number>;
    
    if (q1 !== undefined) {
      cleanData.houseTypeDiagnosis.q1 = q1;
    }
    if (q2 !== undefined) {
      cleanData.houseTypeDiagnosis.q2 = q2;
    }
  }

  return cleanData;
};