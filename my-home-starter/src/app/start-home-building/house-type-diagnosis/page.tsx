import { Metadata } from 'next';
import { Suspense } from 'react';
import HouseTypeDiagnosisClient from './HouseTypeDiagnosisClient';

export const metadata: Metadata = {
  title: '家づくりタイプ診断 | 家づくり総予算シミュレーター - マイホームスターター',
  description: 'あなたに最適な家づくりのタイプを診断します。簡単な質問に答えるだけで、理想の住まいづくりの方向性が見つかります。',
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

export default function HouseTypeDiagnosisPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HouseTypeDiagnosisClient />
    </Suspense>
  );
}