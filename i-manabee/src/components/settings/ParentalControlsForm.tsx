'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import {
  Users,
  Clock,
  Shield,
  Phone,
  Plus,
  Trash2,
  UserCheck,
  Calendar,
  BarChart3
} from 'lucide-react';

interface ParentalControls {
  childScreenTime: { [childId: string]: number };
  contentFiltering: boolean;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    email: string;
  }>;
}

interface ParentalControlsFormProps {
  settings: ParentalControls;
  onChange: (settings: ParentalControls) => void;
  children: Array<{ id: string; name: string }>;
}

export function ParentalControlsForm({ settings, onChange, children }: ParentalControlsFormProps) {
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const updateSettings = (updates: Partial<ParentalControls>) => {
    onChange({ ...settings, ...updates });
  };

  const updateChildScreenTime = (childId: string, minutes: number) => {
    updateSettings({
      childScreenTime: {
        ...settings.childScreenTime,
        [childId]: minutes
      }
    });
  };

  const addEmergencyContact = () => {
    if (newContact.name && (newContact.phone || newContact.email)) {
      updateSettings({
        emergencyContacts: [...settings.emergencyContacts, newContact]
      });
      setNewContact({ name: '', phone: '', email: '' });
    }
  };

  const removeEmergencyContact = (index: number) => {
    updateSettings({
      emergencyContacts: settings.emergencyContacts.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      {/* 子ども別時間制限 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            子ども別利用時間制限
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {children.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>登録されている子どもがありません</p>
              <p className="text-sm">子どもプロファイルページから追加してください</p>
            </div>
          ) : (
            children.map((child) => (
              <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{child.name}</h4>
                    <p className="text-sm text-gray-600">
                      現在の制限: {settings.childScreenTime[child.id] || 60}分/日
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    value={settings.childScreenTime[child.id] || 60}
                    onChange={(e) => updateChildScreenTime(child.id, parseInt(e.target.value) || 60)}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">分</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* コンテンツフィルタリング */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            コンテンツフィルタリング
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">不適切コンテンツのフィルタリング</h4>
              <p className="text-sm text-gray-600">
                年齢に適さない内容を自動的にブロックします
              </p>
            </div>
            <button
              onClick={() => updateSettings({ contentFiltering: !settings.contentFiltering })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.contentFiltering ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.contentFiltering ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* フィルタリング詳細設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium mb-2">ブロック対象</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 暴力的な内容</li>
                <li>• 不適切な言語</li>
                <li>• 年齢に適さない話題</li>
                <li>• 個人情報の要求</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium mb-2">許可対象</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 教育的な内容</li>
                <li>• 年齢に適した娯楽</li>
                <li>• 創作活動</li>
                <li>• 学習支援</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 緊急連絡先 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            緊急連絡先
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 新しい連絡先追加 */}
          <div className="p-4 border border-dashed border-gray-300 rounded-lg">
            <h4 className="font-medium mb-3">新しい緊急連絡先を追加</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <Input
                type="text"
                placeholder="名前"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
              <Input
                type="tel"
                placeholder="電話番号"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
              <Input
                type="email"
                placeholder="メールアドレス"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              />
            </div>
            <Button
              onClick={addEmergencyContact}
              disabled={!newContact.name || (!newContact.phone && !newContact.email)}
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              追加
            </Button>
          </div>

          {/* 登録済み連絡先一覧 */}
          <div className="space-y-3">
            {settings.emergencyContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>緊急連絡先が登録されていません</p>
              </div>
            ) : (
              settings.emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">{contact.name}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {contact.phone && <p>📞 {contact.phone}</p>}
                        {contact.email && <p>✉️ {contact.email}</p>}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEmergencyContact(index)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* 使用状況統計 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            今週の使用状況
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">2.5h</div>
              <div className="text-sm text-blue-700">平均利用時間</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">6/7</div>
              <div className="text-sm text-green-700">アクティブ日数</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{children.length}</div>
              <div className="text-sm text-purple-700">利用者数</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <Shield className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-orange-700">安全アラート</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}