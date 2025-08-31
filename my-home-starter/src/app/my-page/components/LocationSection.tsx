// src/app/my-page/components/LocationSection.tsx

import React, { memo } from 'react';
import styles from '../MyPage.module.css';
import { UserState } from '../../../types/simulator';

interface LocationSectionProps {
  userData: UserState;
}

/**
 * 建築予定地セクション
 * メモ化により関連データが変わらない限り再レンダリングしない
 */
export const LocationSection = memo(({ userData }: LocationSectionProps) => {
  const hasLocation = userData.buildingLocation.prefecture || userData.buildingLocation.city;
  
  if (!hasLocation) {
    return null;
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>建築予定地</h2>
      <p>
        建築予定地: {userData.buildingLocation.prefecture} {userData.buildingLocation.city} ({userData.ownershipStatus})
      </p>
      {userData.ownershipStatus === "購入する" && userData.landBudget > 0 && (
        <p>土地予算: {Math.floor(userData.landBudget).toLocaleString()} 万円</p>
      )}
    </div>
  );
});

LocationSection.displayName = 'LocationSection';