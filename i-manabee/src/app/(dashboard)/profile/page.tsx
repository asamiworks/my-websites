'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card, Alert } from '@/components/ui';
import { useRequireAuth } from '@/hooks/useAuth';

export default function ProfileManagementPage() {
  const auth = useRequireAuth();

  // TODO: 実際のデータを取得
  const mockChildren = [
    {
      id: '1',
      name: 'たろう',
      birthMonth: '2015-04',
      grade: '小3',
      ageGroup: 'junior' as const,
      interests: ['算数・数学', '理科', '動物'],
      learningGoals: ['基礎学力向上', '論理的思考力'],
      createdAt: new Date('2024-01-15'),
      lastActiveAt: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'はなこ',
      birthMonth: '2012-08',
      grade: '中1',
      ageGroup: 'middle' as const,
      interests: ['英語', '音楽', '歴史'],
      learningGoals: ['英語力向上', '創造力育成'],
      createdAt: new Date('2024-01-16'),
      lastActiveAt: new Date('2024-01-21')
    }
  ];

  const getAgeFromBirthMonth = (birthMonth: string) => {
    const birth = new Date(birthMonth + '-01');
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    return monthDiff < 0 ? age - 1 : age;
  };

  const canAddMoreChildren = () => {
    if (!auth.userData) return false;
    const plan = auth.userData.plan;
    const currentCount = mockChildren.length;

    const limits = {
      free: 1,
      kids: 1,
      friends: 3,
      premium: 5
    };

    return currentCount < limits[plan];
  };

  const handleDeleteChild = async (childId: string) => {
    if (confirm('この子どもプロファイルを削除しますか？この操作は元に戻せません。')) {
      try {
        // TODO: 子どもプロファイル削除API
        console.log('削除対象:', childId);
        // 削除処理の実装
      } catch (error) {
        console.error('削除エラー:', error);
      }
    }
  };

  if (auth.isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">プロファイル管理</h1>
          <p className="text-text-sub mt-1">お子様のプロファイルを管理します</p>
        </div>
        {canAddMoreChildren() && (
          <Link href="/dashboard/profile/create">
            <Button variant="primary" className="bg-gradient-to-r from-honey-yellow to-warning-yellow">
              新しいプロファイルを追加
            </Button>
          </Link>
        )}
      </div>

      {/* プラン制限の表示 */}
      <Alert variant="info" className="bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-text-main">現在のプラン: まなびーフレンズ</p>
            <p className="text-sm text-text-sub">
              最大3つの子どもプロファイルを作成できます（現在: {mockChildren.length}/3）
            </p>
          </div>
          <Link href="/dashboard/subscription">
            <Button variant="outline" size="sm">
              プラン変更
            </Button>
          </Link>
        </div>
      </Alert>

      {/* 子どもプロファイル一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockChildren.map((child) => {
          const age = getAgeFromBirthMonth(child.birthMonth);
          const isUnder13 = age < 13;

          return (
            <Card key={child.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    child.ageGroup === 'junior' ? 'bg-kids-blue' :
                    child.ageGroup === 'middle' ? 'bg-friends-purple' :
                    'bg-premium-gold'
                  }`}>
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main text-lg">{child.name}</h3>
                    <p className="text-sm text-text-sub">{child.grade} · {age}歳</p>
                    {isUnder13 && (
                      <span className="inline-block bg-warning-yellow bg-opacity-20 text-warning-yellow text-xs px-2 py-1 rounded-full mt-1">
                        🛡️ COPPA対象
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/dashboard/profile/${child.id}/edit`}>
                    <Button variant="outline" size="sm">
                      編集
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteChild(child.id)}
                    className="text-error-red border-error-red hover:bg-error-red hover:text-white"
                  >
                    削除
                  </Button>
                </div>
              </div>

              {/* 基本情報 */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-text-sub mb-1">興味分野</p>
                  <div className="flex flex-wrap gap-1">
                    {child.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-block bg-honey-yellow bg-opacity-20 text-honey-yellow text-xs px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-text-sub mb-1">学習目標</p>
                  <div className="flex flex-wrap gap-1">
                    {child.learningGoals.map((goal) => (
                      <span
                        key={goal}
                        className={`inline-block text-xs px-2 py-1 rounded-full ${
                          child.ageGroup === 'junior' ? 'bg-kids-blue bg-opacity-20 text-kids-blue' :
                          child.ageGroup === 'middle' ? 'bg-friends-purple bg-opacity-20 text-friends-purple' :
                          'bg-premium-gold bg-opacity-20 text-premium-gold'
                        }`}
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 活動状況 */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-text-sub">作成日: {child.createdAt.toLocaleDateString('ja-JP')}</p>
                    <p className="text-text-sub">最終利用: {child.lastActiveAt.toLocaleDateString('ja-JP')}</p>
                  </div>
                  <Link href={`/chat?child=${child.id}`}>
                    <Button variant="primary" size="sm" className="bg-gradient-to-r from-honey-yellow to-warning-yellow">
                      チャット開始
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}

        {/* 新規追加カード */}
        {canAddMoreChildren() && (
          <Card className="p-6 border-2 border-dashed border-gray-300 hover:border-honey-yellow transition-colors">
            <Link href="/dashboard/profile/create" className="block h-full">
              <div className="flex flex-col items-center justify-center h-full text-center min-h-[200px]">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-gray-500">+</span>
                </div>
                <h3 className="font-semibold text-text-main mb-2">新しいプロファイルを追加</h3>
                <p className="text-sm text-text-sub">
                  お子様のプロファイルを追加して<br />
                  個別の学習体験を始めましょう
                </p>
              </div>
            </Link>
          </Card>
        )}

        {/* プラン制限に達した場合のメッセージ */}
        {!canAddMoreChildren() && (
          <Card className="p-6 border-2 border-dashed border-gray-300">
            <div className="flex flex-col items-center justify-center h-full text-center min-h-[200px]">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold text-text-main mb-2">プロファイル上限に達しました</h3>
              <p className="text-sm text-text-sub mb-4">
                さらに多くのお子様のプロファイルを<br />
                作成するにはプランのアップグレードが必要です
              </p>
              <Link href="/dashboard/subscription">
                <Button variant="outline" size="sm">
                  プランを見る
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* 設定・セキュリティ情報 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-text-main mb-4">セキュリティ・プライバシー設定</h2>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🔐</span>
            <div>
              <h3 className="font-semibold text-text-main">PIN管理</h3>
              <p className="text-sm text-text-sub mb-2">
                各お子様のPINは個別に管理されており、定期的な変更を推奨します
              </p>
              <Button variant="outline" size="sm">
                PIN設定を確認
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="font-semibold text-text-main">データ保護</h3>
              <p className="text-sm text-text-sub mb-2">
                13歳未満のお子様のデータはCOPPA準拠で厳重に保護されています
              </p>
              <Link href="/legal/coppa">
                <Button variant="outline" size="sm">
                  児童保護方針を確認
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="font-semibold text-text-main">学習データ</h3>
              <p className="text-sm text-text-sub mb-2">
                お子様の学習履歴とチャット内容は暗号化されて安全に保存されます
              </p>
              <Link href="/dashboard/reports">
                <Button variant="outline" size="sm">
                  学習レポートを見る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}