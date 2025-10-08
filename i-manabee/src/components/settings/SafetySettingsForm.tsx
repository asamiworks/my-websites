'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '@/components/ui';
import {
  Shield,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Settings,
  Clock,
  Calendar
} from 'lucide-react';

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
    timeLimit: number;
    allowedHours: {
      start: string;
      end: string;
    };
    blockedTopics: string[];
  };
}

interface SafetySettingsFormProps {
  settings: SafetySettings;
  onChange: (settings: SafetySettings) => void;
  children: Array<{ id: string; name: string }>;
}

export function SafetySettingsForm({ settings, onChange, children }: SafetySettingsFormProps) {
  const [newKeyword, setNewKeyword] = useState('');
  const [newTopic, setNewTopic] = useState('');

  const updateSettings = (updates: Partial<SafetySettings>) => {
    onChange({ ...settings, ...updates });
  };

  const addCustomKeyword = () => {
    if (newKeyword.trim()) {
      updateSettings({
        keywords: {
          ...settings.keywords,
          custom: [...settings.keywords.custom, newKeyword.trim()]
        }
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (category: keyof SafetySettings['keywords'], index: number) => {
    updateSettings({
      keywords: {
        ...settings.keywords,
        [category]: settings.keywords[category].filter((_, i) => i !== index)
      }
    });
  };

  const addBlockedTopic = () => {
    if (newTopic.trim()) {
      updateSettings({
        restrictions: {
          ...settings.restrictions,
          blockedTopics: [...settings.restrictions.blockedTopics, newTopic.trim()]
        }
      });
      setNewTopic('');
    }
  };

  const removeBlockedTopic = (index: number) => {
    updateSettings({
      restrictions: {
        ...settings.restrictions,
        blockedTopics: settings.restrictions.blockedTopics.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 基本設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            基本安全設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 安全監視の有効/無効 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">安全監視システム</h4>
              <p className="text-sm text-gray-600">
                メッセージの安全性を自動監視します
              </p>
            </div>
            <button
              onClick={() => updateSettings({ enabled: !settings.enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 検知感度設定 */}
          <div>
            <h4 className="font-medium mb-3">検知感度</h4>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => updateSettings({ sensitivity: level })}
                  className={`p-3 text-center rounded-lg border-2 transition-colors ${
                    settings.sensitivity === level
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">
                    {level === 'low' ? '低' : level === 'medium' ? '中' : '高'}
                  </div>
                  <div className="text-xs mt-1">
                    {level === 'low' ? '明確な問題のみ' :
                     level === 'medium' ? 'バランス型' : '疑わしい内容も検知'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* キーワード設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            監視キーワード設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 既定のキーワード */}
          <div>
            <h4 className="font-medium mb-3">既定のキーワード</h4>
            <div className="space-y-4">
              {Object.entries(settings.keywords).filter(([key]) => key !== 'custom').map(([category, keywords]) => (
                <div key={category}>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    {category === 'bullying' ? 'いじめ関連' :
                     category === 'violence' ? '暴力関連' : '不適切な内容'}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(category as keyof SafetySettings['keywords'], index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* カスタムキーワード */}
          <div>
            <h4 className="font-medium mb-3">カスタムキーワード</h4>
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                placeholder="追加するキーワードを入力..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomKeyword()}
              />
              <Button onClick={addCustomKeyword} disabled={!newKeyword.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.keywords.custom.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword('custom', index)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 通知設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            通知タイミング
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'immediate', label: '即座に通知', description: '問題を検知したらすぐに通知' },
            { key: 'daily', label: '日次レポート', description: '1日の終わりにまとめて通知' },
            { key: 'weekly', label: '週次レポート', description: '週に1回まとめて通知' }
          ].map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">{option.label}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <button
                onClick={() => updateSettings({
                  notifications: {
                    ...settings.notifications,
                    [option.key]: !settings.notifications[option.key as keyof typeof settings.notifications]
                  }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.notifications[option.key as keyof typeof settings.notifications] ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications[option.key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 利用制限設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            利用制限設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 日次利用時間制限 */}
          <div>
            <h4 className="font-medium mb-3">1日の利用時間制限</h4>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="15"
                max="480"
                step="15"
                value={settings.restrictions.timeLimit}
                onChange={(e) => updateSettings({
                  restrictions: {
                    ...settings.restrictions,
                    timeLimit: parseInt(e.target.value) || 60
                  }
                })}
                className="w-24"
              />
              <span className="text-sm text-gray-600">分</span>
            </div>
          </div>

          {/* 利用可能時間帯 */}
          <div>
            <h4 className="font-medium mb-3">利用可能時間帯</h4>
            <div className="flex items-center gap-4">
              <Input
                type="time"
                value={settings.restrictions.allowedHours.start}
                onChange={(e) => updateSettings({
                  restrictions: {
                    ...settings.restrictions,
                    allowedHours: {
                      ...settings.restrictions.allowedHours,
                      start: e.target.value
                    }
                  }
                })}
              />
              <span className="text-gray-500">〜</span>
              <Input
                type="time"
                value={settings.restrictions.allowedHours.end}
                onChange={(e) => updateSettings({
                  restrictions: {
                    ...settings.restrictions,
                    allowedHours: {
                      ...settings.restrictions.allowedHours,
                      end: e.target.value
                    }
                  }
                })}
              />
            </div>
          </div>

          {/* ブロック対象トピック */}
          <div>
            <h4 className="font-medium mb-3">ブロック対象トピック</h4>
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                placeholder="ブロックするトピックを入力..."
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addBlockedTopic()}
              />
              <Button onClick={addBlockedTopic} disabled={!newTopic.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.restrictions.blockedTopics.map((topic, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-200"
                >
                  {topic}
                  <button
                    onClick={() => removeBlockedTopic(index)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}