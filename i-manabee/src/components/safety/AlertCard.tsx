'use client';

import { useState } from 'react';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import {
  AlertTriangle,
  Shield,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Phone,
  ExternalLink,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import type { SafetyLog } from '@/types';

interface AlertCardProps {
  alert: SafetyLog;
  childName: string;
  onUpdate?: (updates: Partial<SafetyLog>) => void;
  showActions?: boolean;
}

export function AlertCard({
  alert,
  childName,
  onUpdate,
  showActions = true
}: AlertCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  // 重要度スタイリング
  const severityConfig = {
    critical: {
      icon: '🚨',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800'
    },
    high: {
      icon: '⚠️',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800'
    },
    medium: {
      icon: '⚡',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    low: {
      icon: 'ℹ️',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800'
    }
  };

  const config = severityConfig[alert.severity] || severityConfig.low;

  // 日時フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) {
      const diffMinutes = diffMs / (1000 * 60);
      return `${Math.floor(diffMinutes)}分前`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}時間前`;
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // アラート解決
  const handleResolve = async () => {
    if (!onUpdate) return;

    try {
      setIsUpdating(true);
      await onUpdate({ resolved: true });
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // アラート再開
  const handleReopen = async () => {
    if (!onUpdate) return;

    try {
      setIsUpdating(true);
      await onUpdate({ resolved: false });
    } catch (error) {
      console.error('Failed to reopen alert:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 緊急連絡先
  const emergencyContacts = alert.severity === 'critical' ? [
    {
      name: 'いのちの電話',
      phone: '0570-783-556',
      website: 'https://www.inochinodenwa.org',
      hours: '24時間'
    },
    {
      name: 'チャイルドライン',
      phone: '0120-99-7777',
      website: 'https://childline.or.jp',
      hours: '16:00-21:00'
    }
  ] : [];

  return (
    <Card className={`${config.border} ${alert.resolved ? 'opacity-75' : ''} transition-all`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* メイン情報 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{config.icon}</span>
              <Badge className={config.badge}>
                {alert.severity === 'critical' ? '緊急' :
                 alert.severity === 'high' ? '重要' :
                 alert.severity === 'medium' ? '中程度' : '軽微'}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-3 w-3 mr-1" />
                {childName}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(alert.detectedAt)}
              </div>
              {alert.resolved && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✓ 解決済み
                </Badge>
              )}
            </div>

            {/* 検知キーワード */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">検知キーワード:</p>
              <p className={`font-medium ${config.color}`}>{alert.keyword}</p>
            </div>

            {/* メッセージ内容 */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">メッセージ内容:</p>
              <p className="text-gray-900 leading-relaxed">{alert.message}</p>
            </div>

            {/* コンテキスト */}
            {alert.context && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">前後の文脈:</p>
                <p className="text-sm text-gray-700 italic">{alert.context}</p>
              </div>
            )}

            {/* 通知状態 */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                {alert.parentNotified ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                )}
                <span className={alert.parentNotified ? 'text-green-600' : 'text-gray-500'}>
                  {alert.parentNotified ? '通知済み' : '未通知'}
                </span>
                {alert.notifiedAt && (
                  <span className="text-gray-400 ml-1">
                    ({formatDate(alert.notifiedAt)})
                  </span>
                )}
              </div>
            </div>

            {/* 緊急連絡先（緊急レベルのみ） */}
            {emergencyContacts.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-red-800 font-medium mb-2 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  緊急連絡先
                </h4>
                <div className="space-y-2">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-red-700">{contact.name}</span>
                        <span className="text-red-600 ml-2">{contact.phone}</span>
                        <span className="text-gray-600 ml-2">({contact.hours})</span>
                      </div>
                      {contact.website && (
                        <a
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* アクション */}
          {showActions && (
            <div className="flex items-center gap-2 ml-4">
              {!alert.resolved ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResolve}
                  disabled={isUpdating}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  解決
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReopen}
                  disabled={isUpdating}
                  className="text-gray-600 border-gray-300"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  再開
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Shield className="h-4 w-4 mr-2" />
                    詳細を表示
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="h-4 w-4 mr-2" />
                    緊急連絡
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}