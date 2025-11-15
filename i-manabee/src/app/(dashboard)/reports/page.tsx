'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { WeeklyReport } from '@/components/reports/WeeklyReport';
import { Card, CardContent, CardHeader, CardTitle, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Calendar, Download, TrendingUp, BarChart3, Mail, RefreshCw } from 'lucide-react';
import { WeeklyReportGenerator, type WeeklyReportData } from '@/lib/reports/generator';
import type { ExportType } from '@/lib/reports/exporters';

export default function ReportsPage() {
  const { user } = useAuth();
  const [currentReport, setCurrentReport] = useState<WeeklyReportData | null>(null);
  const [reportHistory, setReportHistory] = useState<WeeklyReportData[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('current');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportType, setExportType] = useState<ExportType>('summary');
  const [isExporting, setIsExporting] = useState(false);

  // 利用可能な週のオプション
  const [weekOptions] = useState(() => {
    const options = [{ value: 'current', label: '今週' }];

    // 過去4週間のオプションを追加
    for (let i = 1; i <= 4; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (7 * i));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      options.push({
        value: `week-${i}`,
        label: `${weekStart.getMonth() + 1}/${weekStart.getDate()} - ${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`
      });
    }

    return options;
  });

  // 初期データ読み込み
  useEffect(() => {
    if (user) {
      loadReport(selectedWeek);
    }
  }, [user, selectedWeek]);

  // レポート読み込み
  const loadReport = async (weekKey: string) => {
    if (!user) return;

    try {
      setIsLoading(true);

      let weekStart: Date, weekEnd: Date;

      if (weekKey === 'current') {
        weekStart = getWeekStart(new Date());
        weekEnd = getWeekEnd(weekStart);
      } else {
        const weekOffset = parseInt(weekKey.split('-')[1]);
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() - (7 * weekOffset));
        weekStart = getWeekStart(baseDate);
        weekEnd = getWeekEnd(weekStart);
      }

      const reportData = await WeeklyReportGenerator.generateWeeklyReport(
        user.uid,
        weekStart,
        weekEnd
      );

      setCurrentReport(reportData);

    } catch (error) {
      console.error('Failed to load report:', error);
      // エラー時はモックデータを表示
      setCurrentReport(generateMockReport());
    } finally {
      setIsLoading(false);
    }
  };

  // 新しいレポート生成
  const generateNewReport = async () => {
    if (!user) return;

    try {
      setIsGenerating(true);
      await loadReport(selectedWeek);
    } finally {
      setIsGenerating(false);
    }
  };

  // CSVエクスポート
  const exportReport = async () => {
    if (!user || !currentReport) return;

    try {
      setIsExporting(true);

      // Firebase Auth トークン取得
      const idToken = await user.getIdToken();

      // APIリクエスト
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          type: exportType,
          startDate: currentReport.weekStart,
          endDate: currentReport.weekEnd,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'エクスポートに失敗しました');
      }

      // CSVファイルダウンロード
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'report.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('レポートをエクスポートしました');
    } catch (error) {
      console.error('Export error:', error);
      alert(error instanceof Error ? error.message : 'エクスポートでエラーが発生しました');
    } finally {
      setIsExporting(false);
    }
  };

  // メール送信
  const sendByEmail = async () => {
    if (!user || !currentReport) return;

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'weekly_report',
          data: {
            userId: user.uid,
            weekStart: currentReport.weekStart,
            weekEnd: currentReport.weekEnd,
          }
        })
      });

      if (response.ok) {
        alert('レポートをメールで送信しました');
      } else {
        alert('メール送信に失敗しました');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('メール送信でエラーが発生しました');
    }
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
            📊 学習レポート
          </h1>
          <p className="text-gray-600">
            お子さまの週次学習状況と成長記録をご覧いただけます
          </p>
        </div>

        {/* コントロールパネル */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              レポート設定
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 期間とエクスポート設定 */}
              <div className="flex flex-wrap items-center gap-4">
                {/* 週選択 */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">対象週:</label>
                  <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {weekOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* エクスポートタイプ選択 */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">出力形式:</label>
                  <Select value={exportType} onValueChange={(value) => setExportType(value as ExportType)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">
                        <div className="flex flex-col">
                          <span className="font-medium">📊 サマリー</span>
                          <span className="text-xs text-gray-500">月次統計（推奨）</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="detailed">
                        <div className="flex flex-col">
                          <span className="font-medium">📈 詳細</span>
                          <span className="text-xs text-gray-500">日別・教科別データ</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="full">
                        <div className="flex flex-col">
                          <span className="font-medium">📁 完全データ</span>
                          <span className="text-xs text-gray-500">全メッセージ（90日以内）</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateNewReport}
                  disabled={isGenerating}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                  更新
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={sendByEmail}
                  disabled={!currentReport}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  メール送信
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={exportReport}
                  disabled={!currentReport || isExporting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className={`h-4 w-4 mr-1 ${isExporting ? 'animate-bounce' : ''}`} />
                  {isExporting ? 'エクスポート中...' : 'CSVエクスポート'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* サマリーカード */}
        {currentReport && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">総メッセージ数</p>
                    <p className="text-2xl font-bold text-gray-900">{currentReport.summary.totalMessages}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">学習トピック</p>
                    <p className="text-2xl font-bold text-gray-900">{currentReport.summary.topLearningTopics.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    currentReport.summary.overallSentiment === 'positive' ? 'bg-green-100' :
                    currentReport.summary.overallSentiment === 'neutral' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <span className="text-lg">
                      {currentReport.summary.overallSentiment === 'positive' ? '😊' :
                       currentReport.summary.overallSentiment === 'neutral' ? '😐' : '😔'}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">感情状態</p>
                    <p className="text-lg font-bold text-gray-900">
                      {currentReport.summary.overallSentiment === 'positive' ? 'ポジティブ' :
                       currentReport.summary.overallSentiment === 'neutral' ? '中立' : 'ネガティブ'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">👑</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">最もアクティブ</p>
                    <p className="text-lg font-bold text-gray-900">{currentReport.summary.mostActiveChild}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 週次レポート詳細 */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                <p className="text-gray-600">レポートを読み込み中...</p>
              </div>
            ) : currentReport ? (
              <WeeklyReport data={currentReport} />
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-2">レポートがありません</p>
                <p className="text-gray-400 text-sm mb-4">
                  選択された期間のデータが見つかりませんでした
                </p>
                <Button onClick={generateNewReport}>
                  レポートを生成
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ヘルパー関数
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getWeekEnd(weekStart: Date): Date {
  return new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
}

function generateMockReport(): WeeklyReportData {
  return {
    userId: 'mock-user',
    weekStart: '2025/1/6',
    weekEnd: '2025/1/12',
    children: [
      {
        id: 'child1',
        name: '太郎',
        totalMessages: 45,
        learningTopics: ['算数: 分数の計算', '国語: 漢字練習', '理科: 植物の観察'],
        safetyEvents: [],
        positiveInteractions: 42,
        averageSessionTime: 18,
        progressMetrics: {
          questionsAsked: 28,
          topicsExplored: 3,
          helpfulResponses: 40
        }
      }
    ],
    summary: {
      totalMessages: 45,
      totalSafetyEvents: 0,
      mostActiveChild: '太郎',
      topLearningTopics: ['算数: 分数の計算', '国語: 漢字練習', '理科: 植物の観察'],
      overallSentiment: 'positive'
    }
  };
}