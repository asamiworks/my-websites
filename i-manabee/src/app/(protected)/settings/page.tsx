import { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SettingsForm } from '@/components/profile/SettingsForm';
import { PasswordChangeForm } from '@/components/profile/PasswordChangeForm';

export const metadata: Metadata = {
  title: '設定 | i-manabee',
  description: 'まなびー設定 - 通知設定、プライバシー設定、パスワード変更',
};

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">設定</h1>
          <p className="text-gray-600 mt-1">
            通知設定、プライバシー設定、セキュリティ設定を管理できます
          </p>
        </div>

        {/* 基本設定 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              基本設定
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              通知設定やプライバシー設定を管理できます
            </p>
          </div>
          <div className="p-6">
            <SettingsForm />
          </div>
        </div>

        {/* セキュリティ設定 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              セキュリティ設定
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              パスワードの変更やセキュリティ設定を管理できます
            </p>
          </div>
          <div className="p-6">
            <PasswordChangeForm />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}