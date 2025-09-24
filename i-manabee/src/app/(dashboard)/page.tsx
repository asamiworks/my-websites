'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Button, ManabeeButton, Alert } from '@/components/ui';

export default function DashboardPage() {
  // TODO: 実際のデータを取得
  const userData = {
    name: '田中花子さん',
    plan: 'friends' as const,
    children: [
      { id: '1', name: 'たろう', age: 8, ageGroup: 'junior' as const },
      { id: '2', name: 'はなこ', age: 12, ageGroup: 'middle' as const }
    ]
  };

  const usageStats = {
    todayMessages: 12,
    todayLimit: 20,
    monthlyTokens: 3250,
    monthlyLimit: 8000
  };

  const recentActivities = [
    { id: '1', childName: 'たろう', subject: '算数', time: '2時間前', message: '足し算の問題を練習しました' },
    { id: '2', childName: 'はなこ', subject: '理科', time: '4時間前', message: '植物の光合成について学習しました' },
    { id: '3', childName: 'たろう', subject: '国語', time: '昨日', message: 'ひらがなの練習をしました' }
  ];

  const getPlanColor = (plan: string) => {
    const colors = {
      free: 'text-free-gray border-free-gray',
      kids: 'text-kids-blue border-kids-blue',
      friends: 'text-friends-purple border-friends-purple',
      premium: 'text-premium-gold border-premium-gold'
    };
    return colors[plan as keyof typeof colors] || colors.free;
  };

  return (
    <div className="space-y-8">
      {/* ウェルカムメッセージ */}
      <div className="bg-gradient-to-r from-honey-yellow to-warning-yellow rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              おかえりなさい、{userData.name} 🐝
            </h1>
            <p className="text-white text-opacity-90">
              今日も子どもたちと一緒に楽しく学習しましょう！
            </p>
          </div>
          <div className="text-6xl animate-bee-flying">
            🐝
          </div>
        </div>
      </div>

      {/* 重要な通知 */}
      <Alert variant="info" title="📢 お知らせ">
        新しい機能「音声入力」が追加されました！チャット画面で音声でも質問できるようになりました。
      </Alert>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-sub text-sm">今日の利用状況</p>
              <p className="text-2xl font-bold text-text-main">
                {usageStats.todayMessages}/{usageStats.todayLimit}
              </p>
              <p className="text-text-sub text-xs">メッセージ</p>
            </div>
            <div className="text-3xl">💬</div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-honey-yellow h-2 rounded-full"
              style={{ width: `${(usageStats.todayMessages / usageStats.todayLimit) * 100}%` }}
            ></div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-sub text-sm">月間トークン</p>
              <p className="text-2xl font-bold text-text-main">
                {usageStats.monthlyTokens.toLocaleString()}
              </p>
              <p className="text-text-sub text-xs">/{usageStats.monthlyLimit.toLocaleString()}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-friends-purple h-2 rounded-full"
              style={{ width: `${(usageStats.monthlyTokens / usageStats.monthlyLimit) * 100}%` }}
            ></div>
          </div>
        </Card>

        <Card className={`p-6 border-2 ${getPlanColor(userData.plan)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-sub text-sm">現在のプラン</p>
              <p className="text-xl font-bold">まなびーフレンズ</p>
              <p className="text-text-sub text-xs">月額 ¥880</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/subscription">
              <Button variant="outline" size="sm" fullWidth>
                プラン変更
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 子どもプロファイル */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-main">お子様のプロファイル</h2>
          <Link href="/dashboard/profile">
            <Button variant="outline" size="sm">
              管理
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userData.children.map(child => (
            <Card key={child.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-honey-yellow rounded-full flex items-center justify-center text-white font-bold">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-text-main">{child.name}</p>
                  <p className="text-sm text-text-sub">{child.age}歳</p>
                  <p className="text-xs text-text-sub">
                    {child.ageGroup === 'junior' ? '小学生' :
                     child.ageGroup === 'middle' ? '中学生' : '高校生'}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <Link href={`/chat?child=${child.id}`}>
                  <ManabeeButton size="sm" fullWidth>
                    チャット開始
                  </ManabeeButton>
                </Link>
              </div>
            </Card>
          ))}

          {/* 新しいプロファイル追加 */}
          {userData.children.length < 3 && (
            <Card className="p-4 border-2 border-dashed border-gray-300 hover:border-honey-yellow transition-colors cursor-pointer">
              <Link href="/dashboard/profile/create" className="block h-full">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl text-gray-500">+</span>
                  </div>
                  <p className="text-sm text-text-sub">
                    新しいプロファイルを追加
                  </p>
                </div>
              </Link>
            </Card>
          )}
        </div>
      </Card>

      {/* 最近のアクティビティ */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-main">最近のアクティビティ</h2>
          <Link href="/dashboard/activity">
            <Button variant="outline" size="sm">
              すべて見る
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-honey-yellow rounded-full flex items-center justify-center text-white font-bold">
                {activity.childName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-semibold text-text-main">{activity.childName}</p>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {activity.subject}
                  </span>
                  <p className="text-xs text-text-sub">{activity.time}</p>
                </div>
                <p className="text-sm text-text-sub">{activity.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* クイックアクション */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/chat">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-text-main mb-2">チャットを始める</h3>
            <p className="text-sm text-text-sub">まなびー先生と学習開始</p>
          </Card>
        </Link>

        <Link href="/dashboard/reports">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-text-main mb-2">学習レポート</h3>
            <p className="text-sm text-text-sub">週間・月間の学習状況</p>
          </Card>
        </Link>

        <Link href="/dashboard/settings">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer text-center">
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="font-semibold text-text-main mb-2">設定</h3>
            <p className="text-sm text-text-sub">アカウント・通知設定</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}