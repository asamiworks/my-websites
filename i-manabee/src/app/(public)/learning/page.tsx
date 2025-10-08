'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProfileStore } from '@/stores/profileStore';
import { getAvatarEmoji } from '@/lib/firebase/children';
import { Button } from '@/components/ui/button';
import type { Child } from '@/types';

export default function LearningPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { children } = useProfileStore();
  const [currentChild, setCurrentChild] = useState<Child | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());

  const childId = searchParams?.get('childId');

  useEffect(() => {
    if (childId && children.length > 0) {
      const child = children.find(c => c.id === childId);
      if (child) {
        setCurrentChild(child);
        setSessionStartTime(new Date());
      } else {
        // 無効なIDの場合は選択画面に戻る
        router.push('/child-select');
      }
    } else if (!childId) {
      // IDが無い場合は選択画面に戻る
      router.push('/child-select');
    }
  }, [childId, children, router]);

  const handleLogout = () => {
    // プロファイル選択画面に戻る
    router.push('/child-select');
  };

  const handleParentMode = () => {
    // 保護者ダッシュボードに戻る
    router.push('/dashboard');
  };

  const getSessionDuration = () => {
    const now = new Date();
    const duration = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000 / 60);
    return duration;
  };

  if (!currentChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-600 mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-blue-600">i-manabee</h1>
              <div className="flex items-center space-x-2">
                <div className="text-2xl">{getAvatarEmoji(currentChild.avatar)}</div>
                <span className="text-lg font-medium text-gray-700">
                  {currentChild.nickname}さん
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                がくしゅう時間: {getSessionDuration()}分
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
              >
                おわる
              </Button>
              <Button
                onClick={handleParentMode}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                👨‍👩‍👧‍👦 保護者
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-8xl mb-6">🎓</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            がくしゅうがめん
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            {currentChild.nickname}さん、がんばって べんきょうしよう！
          </p>

          {/* 学習メニュー（仮） */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* 国語 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">こくご</h3>
              <p className="text-gray-600">
                もじの べんきょうを しよう
              </p>
            </div>

            {/* 算数 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
              <div className="text-6xl mb-4">🔢</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">さんすう</h3>
              <p className="text-gray-600">
                すうじの べんきょうを しよう
              </p>
            </div>

            {/* 英語 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">えいご</h3>
              <p className="text-gray-600">
                えいごの べんきょうを しよう
              </p>
            </div>

            {/* 理科 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
              <div className="text-6xl mb-4">🔬</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">りか</h3>
              <p className="text-gray-600">
                しぜんの べんきょうを しよう
              </p>
            </div>

            {/* 社会 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">しゃかい</h3>
              <p className="text-gray-600">
                せかいの べんきょうを しよう
              </p>
            </div>

            {/* その他 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">そのほか</h3>
              <p className="text-gray-600">
                たのしい べんきょうを しよう
              </p>
            </div>
          </div>

          {/* 実装予定メッセージ */}
          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl max-w-2xl mx-auto">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              がくしゅうきのうは じゅんびちゅう！
            </h3>
            <p className="text-yellow-700">
              いまは PIN にんしょうの てすとがめんです。<br />
              がくしゅうきのうは これから つくります！
            </p>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="text-center py-8">
        <p className="text-gray-500 text-sm">
          こまったことがあったら、おとなのひとによんでもらってね
        </p>
      </footer>
    </div>
  );
}