'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useChildren } from '@/hooks/useChildren';
import { ChildCard } from '@/components/profile/ChildCard';
import { PinInputModal } from '@/components/profile/PinInputModal';
import { Alert } from '@/components/ui';
import type { Child } from '@/types';

export default function ChildSelectPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { children, loading, error } = useChildren();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    // 認証されていない場合はログインページへ
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child);
    setShowPinModal(true);
  };

  const handlePinSuccess = (child: Child) => {
    // 子どもプロファイルが認証されたら学習画面へ遷移
    // 実際の実装では、子どもセッションを開始する
    console.log('PIN認証成功:', child);
    router.push(`/learning?childId=${child.id}`);
  };

  const handlePinCancel = () => {
    setSelectedChild(null);
    setShowPinModal(false);
  };

  const handleParentMode = () => {
    // 保護者モード（ダッシュボード）へ
    router.push('/dashboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-gray-600 mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-yellow-600">i-manabee</h1>
              <span className="text-lg text-gray-600">｜ まなびの時間</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleParentMode}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                👨‍👩‍👧‍👦 保護者モード
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            だれが べんきょうするの？
          </h2>
          <p className="text-lg text-gray-600">
            じぶんの プロフィールを えらんでね
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-8">
            <Alert className="text-red-800 bg-red-50 border-red-200">
              {error}
            </Alert>
          </div>
        )}

        {/* プロファイル一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="text-gray-600 mt-4">プロファイルを読み込み中...</p>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              プロファイルがありません
            </h3>
            <p className="text-gray-600 mb-6">
              保護者の方にプロファイルを作ってもらってください
            </p>
            <button
              onClick={handleParentMode}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              保護者モードへ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {children.map((child) => (
              <div key={child.id} className="transform hover:scale-105 transition-transform">
                <ChildCard
                  child={child}
                  onSelect={() => handleChildSelect(child)}
                  showActions={false}
                />
              </div>
            ))}
          </div>
        )}

        {/* 保護者モードへのリンク */}
        {children.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm mb-4">
              おとなの ひと は こちら
            </p>
            <button
              onClick={handleParentMode}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-white/50 transition-colors"
            >
              👨‍👩‍👧‍👦 保護者モード
            </button>
          </div>
        )}
      </main>

      {/* PIN入力モーダル */}
      {selectedChild && (
        <PinInputModal
          child={selectedChild}
          isOpen={showPinModal}
          onSuccess={handlePinSuccess}
          onCancel={handlePinCancel}
        />
      )}
    </div>
  );
}