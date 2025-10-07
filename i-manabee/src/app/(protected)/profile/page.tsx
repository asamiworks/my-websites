import { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProfileForm } from '@/components/profile/ProfileForm';

export const metadata: Metadata = {
  title: 'プロフィール管理 | i-manabee',
  description: 'まなびープロフィール管理 - アカウント情報を確認・編集できます',
};

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">プロフィール管理</h1>
          <p className="text-gray-600 mt-1">
            アカウント情報の確認・編集ができます
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              基本情報
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              表示名やメールアドレスなどの基本情報を管理できます
            </p>
          </div>
          <div className="p-6">
            <ProfileForm />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}