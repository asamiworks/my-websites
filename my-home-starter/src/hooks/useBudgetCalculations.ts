// src/hooks/useBudgetCalculations.ts

import { useMemo } from 'react';
import { UserState } from '../types/simulator';

interface BudgetCalculations {
  totalBudget: number;
  landBudget: number;
  miscBudget: number;
  buildingBudget: number;
  reserveBudget: number;
  reducedLandBudget: number;
  totalBudgetForGraph: number;
  landPercentage: number;
  buildingPercentage: number;
  miscPercentage: number;
  reservePercentage: number;
}

/**
 * 予算計算をメモ化するカスタムフック
 * 依存する値が変わらない限り再計算しない
 */
export const useBudgetCalculations = (userData: UserState): BudgetCalculations => {
  return useMemo(() => {
    const totalBudget = userData.totalBudget || 0;
    const landBudget = userData.landBudget || 0;
    const miscBudget = Math.floor(totalBudget * 0.1);
    const buildingBudget = Math.floor(
      (totalBudget - landBudget - miscBudget) * 
      (userData.ownershipStatus === "購入する" ? 0.975 : 0.9)
    );
    const reserveBudget = Math.floor(totalBudget * 0.05);
    const reducedLandBudget = userData.ownershipStatus === "購入する" 
      ? Math.floor(landBudget * 0.975) 
      : 0;

    // 円グラフ用の計算
    const totalBudgetForGraph = reducedLandBudget + buildingBudget + miscBudget + reserveBudget;
    
    const landPercentage = userData.ownershipStatus === "購入する" && totalBudgetForGraph > 0
      ? (reducedLandBudget / totalBudgetForGraph) * 100 
      : 0;
    
    const buildingPercentage = totalBudgetForGraph > 0
      ? (buildingBudget / totalBudgetForGraph) * 100
      : 0;
    
    const miscPercentage = totalBudgetForGraph > 0
      ? (miscBudget / totalBudgetForGraph) * 100
      : 0;
    
    const reservePercentage = totalBudgetForGraph > 0
      ? (reserveBudget / totalBudgetForGraph) * 100
      : 0;

    return {
      totalBudget,
      landBudget,
      miscBudget,
      buildingBudget,
      reserveBudget,
      reducedLandBudget,
      totalBudgetForGraph,
      landPercentage,
      buildingPercentage,
      miscPercentage,
      reservePercentage,
    };
  }, [
    userData.totalBudget,
    userData.landBudget,
    userData.ownershipStatus
  ]);
};