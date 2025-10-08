'use client';

import { Card, CardContent, CardHeader, CardTitle, Progress } from '@/components/ui';
import { BookOpen, TrendingUp, Target, Award } from 'lucide-react';

export function LearningProgress() {
  // モックデータ（実際の実装では props から受け取る）
  const progressData = {
    totalLessons: 120,
    completedLessons: 85,
    currentStreak: 7,
    totalPoints: 1250,
    subjects: [
      { name: '算数', progress: 75, total: 30, completed: 22 },
      { name: '国語', progress: 60, total: 25, completed: 15 },
      { name: '理科', progress: 85, total: 20, completed: 17 },
      { name: '社会', progress: 45, total: 15, completed: 7 }
    ]
  };

  const overallProgress = Math.round((progressData.completedLessons / progressData.totalLessons) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          学習進捗
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 全体の進捗 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">全体の進捗</span>
            <span className="text-sm text-gray-600">{progressData.completedLessons}/{progressData.totalLessons} レッスン</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <p className="text-xs text-gray-600 mt-1">{overallProgress}% 完了</p>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-600">{progressData.currentStreak}</div>
            <div className="text-xs text-blue-700">日連続</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-600">{progressData.completedLessons}</div>
            <div className="text-xs text-green-700">完了レッスン</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-600">{progressData.totalPoints}</div>
            <div className="text-xs text-purple-700">獲得ポイント</div>
          </div>
        </div>

        {/* 科目別進捗 */}
        <div>
          <h4 className="font-medium mb-3">科目別進捗</h4>
          <div className="space-y-3">
            {progressData.subjects.map((subject) => (
              <div key={subject.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{subject.name}</span>
                  <span className="text-sm text-gray-600">{subject.completed}/{subject.total}</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}