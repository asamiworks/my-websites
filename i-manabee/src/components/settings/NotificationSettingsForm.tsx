'use client';

import { Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import {
  Mail,
  Smartphone,
  Bell,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface NotificationSettings {
  email: {
    safety: boolean;
    weekly: boolean;
    updates: boolean;
  };
  push: {
    safety: boolean;
    messages: boolean;
  };
}

interface NotificationSettingsFormProps {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
}

export function NotificationSettingsForm({ settings, onChange }: NotificationSettingsFormProps) {
  const updateSettings = (updates: Partial<NotificationSettings>) => {
    onChange({ ...settings, ...updates });
  };

  const toggleEmailSetting = (key: keyof NotificationSettings['email']) => {
    updateSettings({
      email: {
        ...settings.email,
        [key]: !settings.email[key]
      }
    });
  };

  const togglePushSetting = (key: keyof NotificationSettings['push']) => {
    updateSettings({
      push: {
        ...settings.push,
        [key]: !settings.push[key]
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* メール通知設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            メール通知設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: 'safety' as const,
              icon: AlertCircle,
              title: '安全性アラート',
              description: '問題が検知された時に即座にメール通知',
              color: 'text-red-600'
            },
            {
              key: 'weekly' as const,
              icon: Calendar,
              title: '週次レポート',
              description: '週に1回、学習状況のレポートをメール送信',
              color: 'text-blue-600'
            },
            {
              key: 'updates' as const,
              icon: Bell,
              title: 'システム更新情報',
              description: '新機能やメンテナンス情報の通知',
              color: 'text-green-600'
            }
          ].map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${option.color}`} />
                  <div>
                    <h4 className="font-medium">{option.title}</h4>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleEmailSetting(option.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.email[option.key] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.email[option.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* プッシュ通知設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            プッシュ通知設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: 'safety' as const,
              icon: AlertCircle,
              title: '緊急安全アラート',
              description: 'クリティカルな問題が検知された時の緊急通知',
              color: 'text-red-600'
            },
            {
              key: 'messages' as const,
              icon: Bell,
              title: 'メッセージ通知',
              description: 'お子さまから新しいメッセージがあった時の通知',
              color: 'text-blue-600'
            }
          ].map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${option.color}`} />
                  <div>
                    <h4 className="font-medium">{option.title}</h4>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePushSetting(option.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.push[option.key] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.push[option.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}

          {/* 通知時間設定の案内 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">おやすみモード</h4>
                <p className="text-sm text-blue-700 mt-1">
                  夜間（22:00〜7:00）は緊急時を除いて通知を停止します。
                  緊急度の高い安全アラートのみ通知されます。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 通知テスト */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            通知テスト
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 text-left border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <Mail className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">テストメール送信</h4>
              <p className="text-sm text-gray-600">設定したメールアドレスにテストメールを送信</p>
            </button>

            <button className="p-4 text-left border-2 border-dashed border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
              <Smartphone className="h-6 w-6 text-green-600 mb-2" />
              <h4 className="font-medium text-gray-900">テスト通知送信</h4>
              <p className="text-sm text-gray-600">プッシュ通知のテストを実行</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 通知履歴 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            最近の通知履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">週次レポート送信完了</p>
                <p className="text-xs text-gray-500">2025年1月6日 09:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">安全性アラート検知</p>
                <p className="text-xs text-gray-500">2025年1月5日 14:30</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Bell className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">システム更新通知</p>
                <p className="text-xs text-gray-500">2025年1月3日 12:00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}