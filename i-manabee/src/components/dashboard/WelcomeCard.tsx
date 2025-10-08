'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { User, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function WelcomeCard() {
  const { user } = useAuth();

  const currentTime = new Date();
  const hour = currentTime.getHours();

  const getGreeting = () => {
    if (hour < 12) return 'おはようございます';
    if (hour < 18) return 'こんにちは';
    return 'こんばんは';
  };

  const getDateString = () => {
    return currentTime.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <User className="h-5 w-5" />
          {getGreeting()}！
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h2 className="text-2xl font-bold">
              {user?.displayName || user?.email || 'ユーザー'}さん
            </h2>
          </div>

          <div className="flex items-center gap-4 text-blue-100">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{getDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {currentTime.toLocaleTimeString('ja-JP', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm text-blue-100">
              今日も安全で楽しい学習をサポートします
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}