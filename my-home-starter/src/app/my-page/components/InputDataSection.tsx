// src/app/my-page/components/InputDataSection.tsx

import React, { memo } from 'react';
import styles from '../MyPage.module.css';

interface BuildingLocation {
  prefecture: string;
  city: string;
}

interface HouseSizeData {
  totalFloorArea: number;
  floors: number;
  ldkSize: number;
  japaneseRoomSize?: number;
  japaneseRooms?: number;
  masterBedroomSize?: number;
  masterBedroomRooms?: number;
  westernRoomSize?: number;
  westernRooms?: number;
  otherRoomSize?: number;
  otherRooms?: number;
}

interface UserState {
  totalBudget: number;
  annualIncome: number;
  monthlyLoanRepayment: number;
  downPayment: number;
  spouseIncome?: number;
  spouseLoanRepayment?: number;
  nickname: string;
  ownershipStatus: string;
  landBudget: number;
  houseSizeData: HouseSizeData;
  buildingLocation: BuildingLocation;
  unreadMessages: number;
}

interface InputDataSectionProps {
  userData: UserState;
}

// 表示項目の型定義
type DisplayItem = {
  key: string;
  label: string;
  value: string;
};

/**
 * 総予算と入力データセクション
 * メモ化により、userDataの該当部分が変わらない限り再レンダリングしない
 */
export const InputDataSection = memo(({ userData }: InputDataSectionProps) => {
  // 表示する項目を配列で管理（条件付きレンダリングの最適化）
  const displayItems = React.useMemo((): DisplayItem[] => {
    const items: DisplayItem[] = [];
    
    if (userData.totalBudget > 0) {
      items.push({
        key: 'totalBudget',
        label: '総予算',
        value: `${Math.floor(userData.totalBudget).toLocaleString()} 万円（35年ローン）`
      });
    }
    
    if (userData.annualIncome > 0) {
      items.push({
        key: 'annualIncome',
        label: 'ご年収',
        value: `${Math.floor(userData.annualIncome).toLocaleString()} 万円`
      });
    }
    
    if (userData.monthlyLoanRepayment > 0) {
      items.push({
        key: 'monthlyLoanRepayment',
        label: '現在あるローンの毎月返済額',
        value: `${userData.monthlyLoanRepayment.toLocaleString()} 万円`
      });
    }
    
    if (userData.downPayment > 0) {
      items.push({
        key: 'downPayment',
        label: '頭金の額',
        value: `${Math.floor(userData.downPayment).toLocaleString()} 万円`
      });
    }
    
    if ((userData.spouseIncome ?? 0) > 0) {
      items.push({
        key: 'spouseIncome',
        label: '配偶者の年収',
        value: `${Math.floor(userData.spouseIncome!).toLocaleString()} 万円`
      });
    }
    
    if ((userData.spouseLoanRepayment ?? 0) > 0) {
      items.push({
        key: 'spouseLoanRepayment',
        label: '配偶者の現在あるローンの毎月返済額',
        value: `${userData.spouseLoanRepayment!.toLocaleString()} 万円`
      });
    }
    
    return items;
  }, [
    userData.totalBudget,
    userData.annualIncome,
    userData.monthlyLoanRepayment,
    userData.downPayment,
    userData.spouseIncome,
    userData.spouseLoanRepayment
  ]);

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>総予算と入力データ</h2>
      {displayItems.map(item => (
        <p key={item.key}>{item.label}: {item.value}</p>
      ))}
    </div>
  );
});

InputDataSection.displayName = 'InputDataSection';