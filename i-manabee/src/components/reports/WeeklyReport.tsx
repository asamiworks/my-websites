'use client';

import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from '@/components/ui';
import {
  User,
  MessageCircle,
  BookOpen,
  Shield,
  TrendingUp,
  Clock,
  Target,
  Heart,
  Award,
  AlertTriangle
} from 'lucide-react';
import type { WeeklyReportData } from '@/lib/reports/generator';

interface WeeklyReportProps {
  data: WeeklyReportData;
}

export function WeeklyReport({ data }: WeeklyReportProps) {
  return (
    <div className="space-y-6 p-6">
      {/* レポートヘッダー */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📊 週次学習レポート
        </h2>
        <p className="text-gray-600">
          期間: {data.weekStart} ～ {data.weekEnd}
        </p>
      </div>

      {/* 全体サマリー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            今週のハイライト
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{data.summary.totalMessages}</div>
              <div className="text-gray-600">総メッセージ数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{data.summary.topLearningTopics.length}</div>
              <div className="text-gray-600">学習トピック</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{data.children.length}</div>
              <div className="text-gray-600">アクティブな子ども</div>
            </div>
          </div>

          {/* 全体感情状態 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">
                {data.summary.overallSentiment === 'positive' ? '😊' :
                 data.summary.overallSentiment === 'neutral' ? '😐' : '😔'}
              </span>
              <div>
                <div className="font-medium">
                  今週の全体的な気分: {
                    data.summary.overallSentiment === 'positive' ? 'ポジティブ' :
                    data.summary.overallSentiment === 'neutral' ? '中立' : 'ネガティブ'
                  }
                </div>
                <div className="text-sm text-gray-600">
                  お子さまは {data.summary.overallSentiment === 'positive' ? '楽しく' : '真剣に'} 学習に取り組んでいます
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 人気の学習トピック */}
      {data.summary.topLearningTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              今週の人気学習トピック
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.summary.topLearningTopics.map((topic, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{topic}</div>
                  </div>
                  <Award className="h-5 w-5 text-yellow-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 各子どもの詳細レポート */}
      <div className="space-y-6">
        {data.children.map((child, index) => (
          <Card key={child.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-5 w-5" />
                {child.name}さんの学習記録
                {data.summary.mostActiveChild === child.name && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    👑 今週のMVP
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* メッセージ数 */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">メッセージ数</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{child.totalMessages}</div>
                </div>

                {/* 平均セッション時間 */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">平均時間</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{child.averageSessionTime}分</div>
                </div>

                {/* ポジティブ交流 */}
                <div className="p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-pink-600" />
                    <span className="text-sm font-medium text-pink-800">良い交流</span>
                  </div>
                  <div className="text-2xl font-bold text-pink-600">{child.positiveInteractions}</div>
                </div>

                {/* 安全性スコア */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">安全スコア</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {child.safetyEvents.length === 0 ? '100%' : '98%'}
                  </div>
                </div>
              </div>

              {/* 学習の進歩指標 */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  学習の進歩
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>質問回数</span>
                      <span>{child.progressMetrics.questionsAsked}/40</span>
                    </div>
                    <Progress
                      value={(child.progressMetrics.questionsAsked / 40) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>トピック探索</span>
                      <span>{child.progressMetrics.topicsExplored}/5</span>
                    </div>
                    <Progress
                      value={(child.progressMetrics.topicsExplored / 5) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>有用な回答率</span>
                      <span>{Math.round((child.progressMetrics.helpfulResponses / child.totalMessages) * 100)}%</span>
                    </div>
                    <Progress
                      value={(child.progressMetrics.helpfulResponses / child.totalMessages) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              {/* 学習トピック */}
              {child.learningTopics.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    今週学んだこと
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {child.learningTopics.map((topic, topicIndex) => (
                      <Badge
                        key={topicIndex}
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 安全性アラート */}
              {child.safetyEvents.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">
                      安全性に関する気づき ({child.safetyEvents.length}件)
                    </span>
                  </div>
                  <div className="text-sm text-yellow-700">
                    今週は {child.safetyEvents.length} 件の安全性関連イベントが検知されました。
                    詳細はアラート管理画面でご確認ください。
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 保護者向けアドバイス */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            今週のアドバイス
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.summary.overallSentiment === 'positive' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">素晴らしい学習態度です！</h4>
                <p className="text-green-700 text-sm">
                  お子さまは今週も積極的に学習に取り組んでいます。この調子で継続していきましょう。
                  特に {data.summary.topLearningTopics[0] || '様々な分野'} への関心が高いようです。
                </p>
              </div>
            )}

            {data.summary.totalSafetyEvents === 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">安全な学習環境が保たれています</h4>
                <p className="text-blue-700 text-sm">
                  今週は安全性に関するアラートはありませんでした。お子さまは適切な内容で学習を進めています。
                </p>
              </div>
            )}

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">継続的な学習のために</h4>
              <p className="text-purple-700 text-sm">
                定期的な休憩と、お子さまとの学習内容についての会話を心がけてください。
                {data.summary.mostActiveChild && `${data.summary.mostActiveChild}さんは特に活発に学習していますね！`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}