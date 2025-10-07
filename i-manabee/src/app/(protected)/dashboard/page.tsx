import { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { LearningProgress } from '@/components/dashboard/LearningProgress';
import { ChildrenSection } from '@/components/dashboard/ChildrenSection';

export const metadata: Metadata = {
  title: 'ダッシュボード | i-manabee',
  description: 'まなびーダッシュボード - 学習状況を確認して、今日も楽しく学習しましょう',
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ウェルカムセクション */}
        <WelcomeCard />

        {/* クイックアクション */}
        <QuickActions />

        {/* 子どもプロファイル */}
        <ChildrenSection />

        {/* メインコンテンツエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 学習進捗 */}
          <div className="lg:col-span-2">
            <LearningProgress />
          </div>

          {/* 最近のアクティビティ */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}