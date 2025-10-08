'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/useChildren';
import { SafetySettingsForm } from '@/components/settings/SafetySettingsForm';
import { NotificationSettingsForm } from '@/components/settings/NotificationSettingsForm';
import { ParentalControlsForm } from '@/components/settings/ParentalControlsForm';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  Shield,
  Bell,
  Users,
  Settings,
  AlertTriangle,
  Clock,
  Mail,
  Smartphone,
  UserCheck,
  Save
} from 'lucide-react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface SafetySettings {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  keywords: {
    bullying: string[];
    violence: string[];
    inappropriate: string[];
    custom: string[];
  };
  notifications: {
    immediate: boolean;
    daily: boolean;
    weekly: boolean;
  };
  restrictions: {
    timeLimit: number; // minutes per day
    allowedHours: {
      start: string;
      end: string;
    };
    blockedTopics: string[];
  };
}

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

interface ParentalControls {
  childScreenTime: { [childId: string]: number };
  contentFiltering: boolean;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    email: string;
  }>;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { children } = useChildren();
  const [activeTab, setActiveTab] = useState<'safety' | 'notifications' | 'parental'>('safety');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [safetySettings, setSafetySettings] = useState<SafetySettings>({
    enabled: true,
    sensitivity: 'medium',
    keywords: {
      bullying: ['いじめ', 'からかわれ', '仲間外れ', '無視される'],
      violence: ['暴力', '殴られ', '叩かれ', '怖い'],
      inappropriate: ['嫌なこと', '困ること', '心配'],
      custom: []
    },
    notifications: {
      immediate: true,
      daily: false,
      weekly: true
    },
    restrictions: {
      timeLimit: 60,
      allowedHours: {
        start: '09:00',
        end: '21:00'
      },
      blockedTopics: []
    }
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: {
      safety: true,
      weekly: true,
      updates: false
    },
    push: {
      safety: true,
      messages: false
    }
  });

  const [parentalControls, setParentalControls] = useState<ParentalControls>({
    childScreenTime: {},
    contentFiltering: true,
    emergencyContacts: []
  });

  // 設定読み込み
  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // 安全設定の読み込み
      const safetyDoc = await getDoc(doc(db, 'userSettings', user.uid, 'safety', 'config'));
      if (safetyDoc.exists()) {
        setSafetySettings(prev => ({ ...prev, ...safetyDoc.data() }));
      }

      // 通知設定の読み込み
      const notificationDoc = await getDoc(doc(db, 'userSettings', user.uid, 'notifications', 'config'));
      if (notificationDoc.exists()) {
        setNotificationSettings(prev => ({ ...prev, ...notificationDoc.data() }));
      }

      // ペアレンタルコントロール設定の読み込み
      const parentalDoc = await getDoc(doc(db, 'userSettings', user.uid, 'parental', 'config'));
      if (parentalDoc.exists()) {
        setParentalControls(prev => ({ ...prev, ...parentalDoc.data() }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      // 設定をFirestoreに保存
      await Promise.all([
        setDoc(doc(db, 'userSettings', user.uid, 'safety', 'config'), safetySettings),
        setDoc(doc(db, 'userSettings', user.uid, 'notifications', 'config'), notificationSettings),
        setDoc(doc(db, 'userSettings', user.uid, 'parental', 'config'), parentalControls)
      ]);

      alert('設定を保存しました');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('設定の保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    {
      id: 'safety',
      label: '安全設定',
      icon: Shield,
      description: 'キーワード検知と安全性設定'
    },
    {
      id: 'notifications',
      label: '通知設定',
      icon: Bell,
      description: 'アラートと通知の設定'
    },
    {
      id: 'parental',
      label: 'ペアレンタルコントロール',
      icon: Users,
      description: '利用時間制限と保護者管理'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">ログインしてください</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ⚙️ 安全設定
          </h1>
          <p className="text-gray-600">
            お子さまの安全な学習環境を構築するための詳細設定
          </p>
        </div>

        {/* 設定概要カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className={`h-8 w-8 ${safetySettings.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">安全監視</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {safetySettings.enabled ? 'ON' : 'OFF'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">検知感度</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {safetySettings.sensitivity === 'high' ? '高' :
                     safetySettings.sensitivity === 'medium' ? '中' : '低'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">日次利用制限</p>
                  <p className="text-2xl font-bold text-gray-900">{safetySettings.restrictions.timeLimit}分</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* サイドバータブ */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">設定メニュー</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{tab.label}</div>
                          <div className="text-xs text-gray-500">{tab.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {tabs.find(t => t.id === activeTab)?.label}
                  </CardTitle>
                  <Button
                    onClick={saveSettings}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? '保存中...' : '設定を保存'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === 'safety' && (
                  <SafetySettingsForm
                    settings={safetySettings}
                    onChange={setSafetySettings}
                    children={children}
                  />
                )}

                {activeTab === 'notifications' && (
                  <NotificationSettingsForm
                    settings={notificationSettings}
                    onChange={setNotificationSettings}
                  />
                )}

                {activeTab === 'parental' && (
                  <ParentalControlsForm
                    settings={parentalControls}
                    onChange={setParentalControls}
                    children={children}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}