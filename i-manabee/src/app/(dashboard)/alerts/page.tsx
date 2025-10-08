'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/useChildren';
import { AlertList } from '@/components/safety/AlertList';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Search, Filter, Shield, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { SafetyLog } from '@/types';

export default function AlertsPage() {
  const { user } = useAuth();
  const { children } = useChildren();
  const [alerts, setAlerts] = useState<SafetyLog[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<SafetyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChild, setSelectedChild] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30days');

  // アラート一覧を取得
  useEffect(() => {
    async function loadAlerts() {
      if (!user) return;

      try {
        setIsLoading(true);

        // 期間フィルター設定
        const timeFrames = {
          '7days': 7,
          '30days': 30,
          '90days': 90,
          'all': 365
        };

        const daysBack = timeFrames[selectedTimeframe as keyof typeof timeFrames] || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysBack);

        const alertsQuery = query(
          collection(db, 'safetyLogs'),
          where('parentId', '==', user.uid),
          where('detectedAt', '>=', startDate.toISOString()),
          orderBy('detectedAt', 'desc'),
          limit(100)
        );

        const alertsSnapshot = await getDocs(alertsQuery);
        const alertsData = alertsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as SafetyLog[];

        setAlerts(alertsData);
      } catch (error) {
        console.error('Failed to load alerts:', error);
        // モックデータを使用
        setAlerts(generateMockAlerts());
      } finally {
        setIsLoading(false);
      }
    }

    loadAlerts();
  }, [user, selectedTimeframe]);

  // フィルタリング処理
  useEffect(() => {
    let filtered = alerts;

    // 子どもでフィルタ
    if (selectedChild !== 'all') {
      filtered = filtered.filter(alert => alert.childId === selectedChild);
    }

    // 重要度でフィルタ
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }

    // 検索クエリでフィルタ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(alert =>
        alert.keyword.toLowerCase().includes(query) ||
        alert.message.toLowerCase().includes(query)
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, selectedChild, selectedSeverity, searchQuery]);

  // 統計情報計算
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length,
    resolved: alerts.filter(a => a.resolved).length,
    pending: alerts.filter(a => !a.resolved).length,
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">ログインしてください</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛡️ 安全性アラート
          </h1>
          <p className="text-gray-600">
            お子さまの学習における安全性に関するアラートを管理できます
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">総アラート数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">緊急・重要</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical + stats.high}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Info className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">未対応</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">解決済み</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* フィルター・検索エリア */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              フィルター・検索
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 検索 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="キーワードや内容で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* 子どもでフィルター */}
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger>
                  <SelectValue placeholder="子どもを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての子ども</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 重要度でフィルター */}
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="重要度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての重要度</SelectItem>
                  <SelectItem value="critical">🚨 緊急</SelectItem>
                  <SelectItem value="high">⚠️ 重要</SelectItem>
                  <SelectItem value="medium">⚡ 中程度</SelectItem>
                  <SelectItem value="low">ℹ️ 軽微</SelectItem>
                </SelectContent>
              </Select>

              {/* 期間でフィルター */}
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="期間を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">過去7日間</SelectItem>
                  <SelectItem value="30days">過去30日間</SelectItem>
                  <SelectItem value="90days">過去90日間</SelectItem>
                  <SelectItem value="all">すべて</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* アラート一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>
              アラート一覧 ({filteredAlerts.length}件)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertList
              alerts={filteredAlerts}
              isLoading={isLoading}
              children={children}
              emptyMessage={
                alerts.length === 0
                  ? "安全性アラートはありません。お子さまが安全に学習できています。"
                  : "検索条件に一致するアラートが見つかりませんでした。"
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// モックデータ生成関数
function generateMockAlerts(): SafetyLog[] {
  const mockData: SafetyLog[] = [
    {
      id: '1',
      childId: 'child1',
      parentId: 'parent1',
      severity: 'medium',
      detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      keyword: 'いじめられ',
      message: '学校でいじめられているような気がします',
      context: '最近学校に行くのが嫌だと言っていました',
      parentNotified: true,
      notifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      resolved: false,
    },
    {
      id: '2',
      childId: 'child1',
      parentId: 'parent1',
      severity: 'low',
      detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      keyword: '悲しい',
      message: '今日のテストができなくて悲しいです',
      context: '算数のテストについて相談していました',
      parentNotified: false,
      resolved: true,
    },
    {
      id: '3',
      childId: 'child2',
      parentId: 'parent1',
      severity: 'high',
      detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      keyword: '学校行きたくない',
      message: 'もう学校行きたくない、みんな嫌い',
      context: '友達関係について話していました',
      parentNotified: true,
      notifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      resolved: true,
    },
  ];

  return mockData;
}