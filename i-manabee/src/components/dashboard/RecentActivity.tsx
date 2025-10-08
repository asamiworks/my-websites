'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import {
  MessageCircle,
  Shield,
  Clock,
  User,
  Calendar,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/useChildren';

interface ActivityItem {
  id: string;
  type: 'message' | 'safety' | 'login' | 'report';
  title: string;
  description: string;
  timestamp: Date;
  childName?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export function RecentActivity() {
  const { user } = useAuth();
  const { children } = useChildren();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // モックデータを生成（実際の実装では Firestore から取得）
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'message',
        title: '新しい質問',
        description: '算数の分数について質問がありました',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30分前
        childName: '太郎'
      },
      {
        id: '2',
        type: 'safety',
        title: '安全チェック完了',
        description: '今日の学習セッションで問題は検知されませんでした',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2時間前
        severity: 'low'
      },
      {
        id: '3',
        type: 'report',
        title: '週次レポート生成',
        description: '今週の学習レポートが生成されました',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1日前
      },
      {
        id: '4',
        type: 'login',
        title: 'ログイン',
        description: 'お子さまがシステムにログインしました',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3日前
        childName: '花子'
      }
    ];

    setActivities(mockActivities);
    setIsLoading(false);
  }, []);

  const getActivityIcon = (type: string, severity?: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-600" />;
      case 'safety':
        return <Shield className={`h-5 w-5 ${
          severity === 'critical' ? 'text-red-600' :
          severity === 'high' ? 'text-orange-600' :
          severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
        }`} />;
      case 'login':
        return <User className="h-5 w-5 text-purple-600" />;
      case 'report':
        return <TrendingUp className="h-5 w-5 text-indigo-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}分前`;
    } else if (diffHours < 24) {
      return `${diffHours}時間前`;
    } else if (diffDays < 7) {
      return `${diffDays}日前`;
    } else {
      return timestamp.toLocaleDateString('ja-JP');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          最近のアクティビティ
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>最近のアクティビティはありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type, activity.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  {activity.childName && (
                    <div className="flex items-center gap-1 mt-2">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {activity.childName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* もっと見るリンク */}
        {activities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
              すべてのアクティビティを表示
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}