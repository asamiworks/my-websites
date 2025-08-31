import { Metadata } from 'next';
import { Suspense } from 'react';
import TotalBudgetClient from './TotalBudgetClient';

export const metadata: Metadata = {
  title: '総予算設定 | 家づくり総予算シミュレーター - マイホームスターター',
  description: '家づくりの適正予算を無料で診断。年収・頭金・月々の返済可能額から、無理のない総予算を算出します。',
  keywords: '家づくり,総予算,シミュレーター,無料診断,注文住宅,予算計算,適正予算,年収,頭金,ローン',
  openGraph: {
    title: '総予算設定 | 家づくり総予算シミュレーター',
    description: '年収・頭金から適正な総予算を計算。無理のない返済計画で理想の家づくりを。',
    type: 'website',
    url: 'https://my-home-starter.com/start-home-building/total-budget',
  },
  twitter: {
    card: 'summary_large_image',
    title: '総予算設定 | 家づくり総予算シミュレーター',
    description: '年収・頭金から適正な総予算を計算します。',
  },
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

export default function TotalBudgetPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TotalBudgetClient />
    </Suspense>
  );
}