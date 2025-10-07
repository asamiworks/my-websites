import { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ChildForm } from '@/components/profile/ChildForm';

export const metadata: Metadata = {
  title: '新しい子どもプロファイル作成 | i-manabee',
  description: 'まなびー新しい子どもプロファイル作成 - お子様の情報を入力してプロファイルを作成',
};

export default function NewChildPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">新しい子どもプロファイル作成</h1>
          <p className="text-gray-600 mt-1">
            お子様の情報を入力してプロファイルを作成してください
          </p>
        </div>

        <ChildForm mode="create" />
      </div>
    </DashboardLayout>
  );
}