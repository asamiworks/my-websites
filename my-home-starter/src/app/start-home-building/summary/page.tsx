import { Metadata } from 'next';
import { Suspense } from 'react';
import SummaryClient from './SummaryClient';

export const metadata: Metadata = {
  title: '診断結果まとめ | 家づくり総予算シミュレーター - マイホームスターター',
  description: '家づくりの総予算、希望の広さ、建築地、タイプ診断の結果をまとめて確認。最適な住宅会社を探しましょう。',
  keywords: '家づくり,総予算,診断結果,まとめ,住宅会社,建築会社',
  openGraph: {
    title: '診断結果まとめ | 家づくり総予算シミュレーター',
    description: '診断結果を確認して、最適な住宅会社を探す',
    type: 'website',
    url: 'https://my-home-starter.com/start-home-building/summary',
  },
  twitter: {
    card: 'summary_large_image',
    title: '診断結果まとめ | 家づくり総予算シミュレーター',
    description: '診断結果を確認して、最適な住宅会社を探す',
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

export default function SummaryPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SummaryClient />
    </Suspense>
  );
}