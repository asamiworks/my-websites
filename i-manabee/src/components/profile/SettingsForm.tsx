'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { doc, updateDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { getFirebaseFirestore } from '@/lib/firebase/config';

interface SettingsFormData {
  emailNotifications: boolean;
  weeklyReports: boolean;
  safetyAlerts: boolean;
  emergencyContact?: string;
}

export function SettingsForm() {
  const { user, setUser } = useAuthStore();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<SettingsFormData>({
    defaultValues: {
      emailNotifications: user?.settings?.emailNotifications ?? true,
      weeklyReports: user?.settings?.weeklyReports ?? false,
      safetyAlerts: user?.settings?.safetyAlerts ?? true,
      emergencyContact: user?.settings?.emergencyContact ?? '',
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    if (!user) return;

    try {
      setError(null);
      setSuccess(null);
      setIsLoading(true);

      const db = getFirebaseFirestore();
      const userRef = doc(db, 'users', user.id);

      // 設定を更新
      await updateDoc(userRef, {
        'settings.emailNotifications': data.emailNotifications,
        'settings.weeklyReports': data.weeklyReports,
        'settings.safetyAlerts': data.safetyAlerts,
        'settings.emergencyContact': data.emergencyContact || '',
      });

      // ローカル状態を更新
      setUser(null, {
        ...user,
        settings: {
          ...user.settings,
          emailNotifications: data.emailNotifications,
          weeklyReports: data.weeklyReports,
          safetyAlerts: data.safetyAlerts,
          emergencyContact: data.emergencyContact,
        },
      });

      setSuccess('設定を更新しました');
    } catch (err: any) {
      console.error('Settings update error:', err);
      setError('設定の更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">設定を読み込み中...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {success && (
        <Alert className="text-green-800 bg-green-50 border-green-200">
          {success}
        </Alert>
      )}

      {error && (
        <Alert className="text-red-800 bg-red-50 border-red-200">
          {error}
        </Alert>
      )}

      {/* 通知設定 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">通知設定</h3>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              {...register('emailNotifications')}
              type="checkbox"
              id="emailNotifications"
              className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="emailNotifications" className="ml-3">
              <span className="text-sm font-medium text-gray-700">
                メール通知
              </span>
              <p className="text-sm text-gray-500">
                重要な更新やお知らせをメールで受け取る
              </p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              {...register('weeklyReports')}
              type="checkbox"
              id="weeklyReports"
              className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="weeklyReports" className="ml-3">
              <span className="text-sm font-medium text-gray-700">
                週次レポート
              </span>
              <p className="text-sm text-gray-500">
                お子様の学習状況を週次でレポート受信
              </p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              {...register('safetyAlerts')}
              type="checkbox"
              id="safetyAlerts"
              className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="safetyAlerts" className="ml-3">
              <span className="text-sm font-medium text-gray-700">
                安全性アラート
              </span>
              <p className="text-sm text-gray-500">
                不適切なコンテンツ検出時の即座通知
              </p>
            </label>
          </div>
        </div>
      </div>

      {/* 緊急時連絡先 */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-800">緊急時設定</h3>
        <div>
          <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
            緊急時連絡先
          </label>
          <input
            {...register('emergencyContact')}
            type="email"
            id="emergencyContact"
            placeholder="emergency@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            disabled={isLoading}
          />
          <p className="text-sm text-gray-500 mt-1">
            セキュリティ上の問題が発生した場合の連絡先
          </p>
        </div>
      </div>

      {/* プライバシー設定 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-gray-800">プライバシー情報</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            • お子様の学習データは暗号化されて保存されます
          </p>
          <p>
            • チャット履歴は安全性確認のため一時的に保存されます
          </p>
          <p>
            • 個人情報は第三者と共有されることはありません
          </p>
          <p className="pt-2">
            詳細は{' '}
            <a href="/privacy" className="text-yellow-600 hover:underline">
              プライバシーポリシー
            </a>{' '}
            をご確認ください
          </p>
        </div>
      </div>

      {/* 保存ボタン */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={!isDirty || isLoading}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-800"
        >
          {isLoading ? '更新中...' : '設定を保存'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.reload()}
          disabled={isLoading}
        >
          リセット
        </Button>
      </div>
    </form>
  );
}