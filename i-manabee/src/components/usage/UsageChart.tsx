'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { Usage } from '@/types/usage';

interface UsageChartProps {
  usageHistory: Usage[];
  chartType: 'trend' | 'daily' | 'subject';
}

export function UsageChart({ usageHistory, chartType }: UsageChartProps) {
  const chartData = useMemo(() => {
    if (chartType === 'trend') {
      // トレンドチャート用のデータ
      return usageHistory.map((usage) => ({
        date: new Date(usage.date).toLocaleDateString('ja-JP', {
          month: 'short',
          day: 'numeric',
        }),
        fullDate: usage.date,
        messages: usage.dailyTotal.totalMessages,
        tokens: Math.round(usage.dailyTotal.totalTokens / 100), // 100で割って見やすく
        morning: usage.periods.morning.messages,
        evening: usage.periods.evening.messages,
      }));
    } else if (chartType === 'daily') {
      // 日別比較チャート用のデータ
      return usageHistory.map((usage) => ({
        date: new Date(usage.date).toLocaleDateString('ja-JP', {
          month: 'short',
          day: 'numeric',
        }),
        朝: usage.periods.morning.messages,
        夜: usage.periods.evening.messages,
      }));
    } else {
      // 教科別チャート用のデータ
      const subjectTotals = usageHistory.reduce((acc, usage) => {
        Object.entries(usage.dailyTotal.subjectBreakdown).forEach(([subject, count]) => {
          acc[subject] = (acc[subject] || 0) + count;
        });
        return acc;
      }, {} as Record<string, number>);

      const subjectLabels: Record<string, string> = {
        math: '算数・数学',
        japanese: '国語',
        english: '英語',
        science: '理科',
        social: '社会',
        programming: 'プログラミング',
        counseling: '相談・悩み',
        general: 'その他',
      };

      const colors = [
        '#8884d8',
        '#82ca9d',
        '#ffc658',
        '#ff7c7c',
        '#8dd1e1',
        '#d084d0',
        '#ffb347',
        '#87ceeb',
      ];

      return Object.entries(subjectTotals)
        .filter(([, count]) => count > 0)
        .map(([subject, count], index) => ({
          name: subjectLabels[subject] || subject,
          value: count,
          color: colors[index % colors.length],
        }));
    }
  }, [usageHistory, chartType]);

  if (chartType === 'trend') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">使用量トレンド</h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return new Date(payload[0].payload.fullDate).toLocaleDateString('ja-JP');
                  }
                  return label;
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'tokens') {
                    return [`${value * 100}`, 'トークン数'];
                  }
                  return [value, name === 'messages' ? 'メッセージ数' : name];
                }}
              />
              <Area
                type="monotone"
                dataKey="messages"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="tokens"
                stackId="2"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>メッセージ数</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>トークン数 (×100)</span>
          </div>
        </div>
      </div>
    );
  }

  if (chartType === 'daily') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">時間帯別使用状況</h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number, name: string) => {
                  return [value, `${name}の時間帯`];
                }}
              />
              <Bar dataKey="朝" fill="#fbbf24" />
              <Bar dataKey="夜" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
            <span>朝 (6:00-18:00)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>夜 (18:00-6:00)</span>
          </div>
        </div>
      </div>
    );
  }

  if (chartType === 'subject') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">教科別学習状況</h3>

        {chartData.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: number) => [`${value}件`, '学習回数']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {chartData.map((entry, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div
                    className="w-3 h-3 rounded mr-2"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="truncate">
                    {entry.name}: {entry.value}件
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-gray-600">学習データがありません</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}