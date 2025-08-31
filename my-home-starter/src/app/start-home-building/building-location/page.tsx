import { Metadata } from 'next';
import { Suspense } from 'react';
import BuildingLocationClient from './BuildingLocationClient';

export const metadata: Metadata = {
  title: '建築地選択 | 家づくり総予算シミュレーター - マイホームスターター',
  description: '建築予定地の都道府県・市区町村を選択し、土地の所有状況に応じた予算を計算します。',
};

// ローディングコンポーネント
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      fontSize: '16px',
      color: '#6b7280'
    }}>
      読み込み中...
    </div>
  );
}

export default function BuildingLocationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BuildingLocationClient />
    </Suspense>
  );
}