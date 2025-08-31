// src/app/my-page/components/FloorPlanSection.tsx

import React, { memo } from 'react';
import styles from '../MyPage.module.css';

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

interface FloorPlanSectionProps {
  houseSizeData: HouseSizeData;
}

// 表示項目の型定義
type RoomItem = {
  key: string;
  label: string;
  value: string;
};

/**
 * 間取りの詳細セクション
 * メモ化により間取りデータが変わらない限り再レンダリングしない
 */
export const FloorPlanSection = memo(({ houseSizeData }: FloorPlanSectionProps) => {
  // 表示する部屋情報を配列で管理
  const roomItems = React.useMemo((): RoomItem[] => {
    const items: RoomItem[] = [];
    
    if (houseSizeData.totalFloorArea > 0) {
      items.push({
        key: 'totalFloorArea',
        label: '延床面積',
        value: `約 ${Math.ceil(houseSizeData.totalFloorArea)} 坪`
      });
    }
    
    if (houseSizeData.floors > 0) {
      items.push({
        key: 'floors',
        label: '階数',
        value: `${houseSizeData.floors} 階`
      });
    }
    
    if (houseSizeData.ldkSize > 0) {
      items.push({
        key: 'ldk',
        label: 'LDK',
        value: `${houseSizeData.ldkSize} 帖`
      });
    }
    
    if ((houseSizeData.japaneseRoomSize ?? 0) > 0 && (houseSizeData.japaneseRooms ?? 0) > 0) {
      items.push({
        key: 'japaneseRoom',
        label: '和室',
        value: `${houseSizeData.japaneseRoomSize} 帖 × ${Math.ceil(houseSizeData.japaneseRooms!)} 部屋`
      });
    }
    
    if ((houseSizeData.masterBedroomSize ?? 0) > 0 && (houseSizeData.masterBedroomRooms ?? 0) > 0) {
      items.push({
        key: 'masterBedroom',
        label: '主寝室',
        value: `${houseSizeData.masterBedroomSize} 帖 × ${Math.ceil(houseSizeData.masterBedroomRooms!)} 部屋`
      });
    }
    
    if ((houseSizeData.westernRoomSize ?? 0) > 0 && (houseSizeData.westernRooms ?? 0) > 0) {
      items.push({
        key: 'westernRoom',
        label: '洋室',
        value: `${houseSizeData.westernRoomSize} 帖 × ${Math.ceil(houseSizeData.westernRooms!)} 部屋`
      });
    }
    
    if ((houseSizeData.otherRoomSize ?? 0) > 0 && (houseSizeData.otherRooms ?? 0) > 0) {
      items.push({
        key: 'otherRoom',
        label: 'その他の部屋',
        value: `${houseSizeData.otherRoomSize} 帖 × ${Math.ceil(houseSizeData.otherRooms!)} 部屋`
      });
    }
    
    return items;
  }, [houseSizeData]);

  if (roomItems.length === 0) {
    return null;
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>間取りの詳細</h2>
      {roomItems.map(item => (
        <p key={item.key}>{item.label}: {item.value}</p>
      ))}
    </div>
  );
});

FloorPlanSection.displayName = 'FloorPlanSection';