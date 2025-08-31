import { Metadata } from 'next';
import { Suspense } from 'react';
import HouseSizeClient from './HouseSizeClient';

export const metadata: Metadata = {
  title: '家の大きさ設定 | 家づくり総予算シミュレーター - マイホームスターター',
  description: '希望する部屋数と広さから、建築に必要な坪数を計算します。間取りの例も参考にできます。',
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

export default function HouseSizePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HouseSizeClient />
    </Suspense>
  );
}