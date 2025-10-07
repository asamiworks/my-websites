'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle, BookOpen, BarChart3, Users, User, Settings } from 'lucide-react';

const quickActions = [
  {
    title: 'AIチャットを始める',
    description: 'まなびー先生と質問や学習について話そう',
    href: '/chat',
    icon: MessageCircle,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: '学習コンテンツ',
    description: '年齢に合わせた学習教材を見つけよう',
    href: '/learning',
    icon: BookOpen,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    title: '学習レポート',
    description: '今までの学習成果を確認しよう',
    href: '/reports',
    icon: BarChart3,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    title: '子ども管理',
    description: 'お子様のアカウントや設定を管理',
    href: '/children',
    icon: Users,
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    title: 'プロフィール',
    description: 'アカウント情報の確認・編集',
    href: '/profile',
    icon: User,
    color: 'bg-indigo-500 hover:bg-indigo-600',
  },
  {
    title: '設定',
    description: '通知設定やセキュリティ設定',
    href: '/settings',
    icon: Settings,
    color: 'bg-gray-500 hover:bg-gray-600',
  },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        クイックアクション
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link key={action.title} href={action.href}>
              <Button
                variant="ghost"
                className="h-auto p-4 w-full text-left hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
              >
                <div className="flex flex-col items-start space-y-3">
                  <div className={`p-3 rounded-lg text-white ${action.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 text-sm">
                      {action.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}