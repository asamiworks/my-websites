// src/app/my-page/components/BudgetSection.tsx

import React, { memo } from 'react';
import styles from '../MyPage.module.css';

interface BudgetSectionProps {
  ownershipStatus: string;
  reducedLandBudget: number;
  buildingBudget: number;
  miscBudget: number;
  reserveBudget: number;
  landPercentage: number;
  buildingPercentage: number;
  miscPercentage: number;
}

/**
 * 家づくりの総予算セクション
 * React.memoで最適化 - propsが変わらない限り再レンダリングしない
 */
export const BudgetSection = memo(({
  ownershipStatus,
  reducedLandBudget,
  buildingBudget,
  miscBudget,
  reserveBudget,
  landPercentage,
  buildingPercentage,
  miscPercentage,
}: BudgetSectionProps) => {
  // 円グラフのスタイルをメモ化
  const circleStyle = React.useMemo(() => ({
    background: `conic-gradient(
      ${ownershipStatus === "購入する" ? `#f78ca0 0% ${landPercentage}%,` : ""}
      #8bc34a ${landPercentage}% ${landPercentage + buildingPercentage}%,
      #ffeb3b ${landPercentage + buildingPercentage}% ${landPercentage + buildingPercentage + miscPercentage}%,
      #03a9f4 ${landPercentage + buildingPercentage + miscPercentage}% 100%
    )`,
  }), [ownershipStatus, landPercentage, buildingPercentage, miscPercentage]);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>家づくりの総予算</h2>
      <div
        className={styles.circle}
        style={circleStyle}
      />
      <div className={styles.labels}>
        {ownershipStatus === "購入する" && (
          <div>
            <span className={styles.land}>■</span> 土地予算: {reducedLandBudget.toLocaleString()} 万円
          </div>
        )}
        <div>
          <span className={styles.building}>■</span> 建物予算: {buildingBudget.toLocaleString()} 万円
        </div>
        <div>
          <span className={styles.misc}>■</span> 諸費用: {miscBudget.toLocaleString()} 万円
        </div>
        <div>
          <span className={styles.reserve}>■</span> 予備費: {reserveBudget.toLocaleString()} 万円
        </div>
      </div>
    </div>
  );
});

BudgetSection.displayName = 'BudgetSection';