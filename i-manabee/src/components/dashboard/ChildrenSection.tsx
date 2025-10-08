'use client';

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { Users, Plus, User, Clock, Shield, MessageCircle } from 'lucide-react';
import { useChildren } from '@/hooks/useChildren';

export function ChildrenSection() {
  const { children, isLoading } = useChildren();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            お子さま一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            お子さま一覧
          </CardTitle>
          <Button size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            追加
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {children.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">まだお子さまが登録されていません</p>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              お子さまを追加
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {children.map((child) => {
              // モックデータ（実際の実装では子どもの統計データを取得）
              const mockStats = {
                lastActive: '30分前',
                todayMessages: Math.floor(Math.random() * 20) + 5,
                safetyScore: 98,
                currentActivity: '算数の学習中'
              };

              return (
                <div key={child.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {child.name.charAt(0)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{child.name}</h3>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        オンライン
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{mockStats.currentActivity}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{mockStats.lastActive}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>今日 {mockStats.todayMessages} メッセージ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-green-500" />
                        <span>{mockStats.safetyScore}% 安全</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Button variant="outline" size="sm">
                      詳細
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}