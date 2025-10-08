'use client';

import { useState } from 'react';
import { AlertCard } from './AlertCard';
import { Button } from '@/components/ui';
import { AlertTriangle, Shield, Calendar, Clock } from 'lucide-react';
import type { SafetyLog } from '@/types';

interface AlertListProps {
  alerts: SafetyLog[];
  isLoading?: boolean;
  emptyMessage?: string;
  children: Array<{ id: string; name: string }>;
  onAlertUpdate?: (alertId: string, updates: Partial<SafetyLog>) => void;
  maxHeight?: string;
}

export function AlertList({
  alerts,
  isLoading = false,
  emptyMessage = 'アラートがありません',
  children,
  onAlertUpdate,
  maxHeight = 'max-h-96'
}: AlertListProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'severity' | 'status'>('recent');

  // アラートソート
  const sortedAlerts = [...alerts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
      case 'severity':
        return getSeverityWeight(b.severity) - getSeverityWeight(a.severity);
      case 'status':
        return Number(a.resolved) - Number(b.resolved);
      default:
        return 0;
    }
  });

  // 日付別グループ化
  const groupedAlerts = sortedAlerts.reduce((groups, alert) => {
    const date = new Date(alert.detectedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    let groupKey: string;
    if (date.toDateString() === today.toDateString()) {
      groupKey = '今日';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = '昨日';
    } else if (date > weekAgo) {
      groupKey = '今週';
    } else {
      groupKey = date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(alert);
    return groups;
  }, {} as Record<string, SafetyLog[]>);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ソートコントロール */}
      {alerts.length > 0 && (
        <div className="flex gap-2 mb-6">
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('recent')}
          >
            <Clock className="h-4 w-4 mr-1" />
            最新順
          </Button>
          <Button
            variant={sortBy === 'severity' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('severity')}
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            重要度順
          </Button>
          <Button
            variant={sortBy === 'status' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('status')}
          >
            <Shield className="h-4 w-4 mr-1" />
            状態順
          </Button>
        </div>
      )}

      {/* アラートリスト */}
      {sortedAlerts.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">{emptyMessage}</p>
          <p className="text-gray-400 text-sm">
            お子さまが安全に学習できている証拠です
          </p>
        </div>
      ) : (
        <div className={`space-y-6 overflow-y-auto ${maxHeight}`}>
          {Object.entries(groupedAlerts).map(([dateGroup, alertsInGroup]) => (
            <div key={dateGroup}>
              <div className="flex items-center mb-3">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {dateGroup}
                </h3>
                <div className="flex-1 border-t border-gray-200 ml-3"></div>
                <span className="text-xs text-gray-400 ml-3">
                  {alertsInGroup.length}件
                </span>
              </div>

              <div className="space-y-3">
                {alertsInGroup.map((alert) => {
                  const child = children.find(c => c.id === alert.childId);
                  return (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      childName={child?.name || '不明'}
                      onUpdate={onAlertUpdate ? (updates) => onAlertUpdate(alert.id, updates) : undefined}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* フッター統計 */}
      {sortedAlerts.length > 0 && (
        <div className="border-t pt-4 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-red-600 font-bold text-lg">
                {alerts.filter(a => a.severity === 'critical').length}
              </div>
              <div className="text-red-600 text-xs">緊急</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-orange-600 font-bold text-lg">
                {alerts.filter(a => a.severity === 'high').length}
              </div>
              <div className="text-orange-600 text-xs">重要</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-yellow-600 font-bold text-lg">
                {alerts.filter(a => a.severity === 'medium').length}
              </div>
              <div className="text-yellow-600 text-xs">中程度</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-bold text-lg">
                {alerts.filter(a => a.severity === 'low').length}
              </div>
              <div className="text-blue-600 text-xs">軽微</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getSeverityWeight(severity: string): number {
  switch (severity) {
    case 'critical': return 4;
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
}