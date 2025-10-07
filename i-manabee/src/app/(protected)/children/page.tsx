import { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ChildrenList } from '@/components/profile/ChildrenList';

export const metadata: Metadata = {
  title: '子どもプロファイル管理 | i-manabee',
  description: 'まなびー子どもプロファイル管理 - お子様のプロファイル作成・編集・削除',
};

export default function ChildrenPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">子どもプロファイル管理</h1>
          <p className="text-gray-600 mt-1">
            お子様のプロファイルを作成・管理できます
          </p>
        </div>

        <ChildrenList />
      </div>
    </DashboardLayout>
  );
}