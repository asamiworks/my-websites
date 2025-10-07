'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useChildren } from '@/hooks/useChildren';
import { useProfileStore } from '@/stores/profileStore';
import { ChildCard } from '@/components/profile/ChildCard';
import { DeleteConfirmModal } from '@/components/profile/DeleteConfirmModal';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/Alert';
import type { Child } from '@/types/children';

export function ChildrenList() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { children, loading, error } = useChildren();
  const { verifyPin, removeChild } = useProfileStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Child | null>(null);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">ユーザー情報を読み込み中...</p>
      </div>
    );
  }

  // プラン別制限チェック
  const getMaxChildren = (plan: string): number => {
    switch (plan) {
      case 'free': return 1;
      case 'kids': return 1;
      case 'friends': return 3;
      case 'premium': return 5;
      default: return 1;
    }
  };

  const getPlanDisplayName = (plan: string): string => {
    switch (plan) {
      case 'free': return '無料プラン';
      case 'kids': return 'まなびーキッズ';
      case 'friends': return 'まなびーフレンズ';
      case 'premium': return 'まなびープレミアム';
      default: return '無料プラン';
    }
  };

  const maxChildren = getMaxChildren(user.plan);
  const canAddMore = children.length < maxChildren;

  const handleDeleteClick = (child: Child) => {
    setDeleteTarget(child);
  };

  const handleDeleteConfirm = async (pin: string) => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget.id);

      // PIN認証
      const isValidPin = await verifyPin(deleteTarget.id, pin);
      if (!isValidPin) {
        throw new Error('PINが正しくありません。');
      }

      // 削除実行
      await removeChild(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error: any) {
      console.error('[ChildrenList] Delete error:', error);
      throw error; // DeleteConfirmModalでエラーハンドリング
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (childId: string) => {
    router.push(`/children/${childId}/edit`);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー情報 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            現在のプラン: <span className="font-medium">{getPlanDisplayName(user.plan)}</span>
          </p>
          <p className="text-sm text-gray-600">
            プロファイル: <span className="font-medium">{children.length} / {maxChildren}人</span>
          </p>
        </div>

        {canAddMore && (
          <Link href="/children/new">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800">
              ➕ 新しいプロファイルを追加
            </Button>
          </Link>
        )}
      </div>

      {/* プラン制限警告 */}
      {!canAddMore && (
        <Alert className="text-orange-800 bg-orange-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium mb-1">プロファイル上限に達しました</h4>
              <p className="text-sm">
                さらに多くのお子様のプロファイルを作成するには、プランのアップグレードが必要です。
              </p>
            </div>
            <Link href="/subscription">
              <Button variant="outline" size="sm">
                プラン変更
              </Button>
            </Link>
          </div>
        </Alert>
      )}

      {/* エラー表示 */}
      {error && (
        <Alert className="text-red-800 bg-red-50 border-red-200">
          {error}
        </Alert>
      )}

      {/* コンテンツ */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          <p className="text-gray-600 mt-4">読み込み中...</p>
        </div>
      ) : children.length === 0 ? (
        <EmptyState canAddMore={canAddMore} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onSelect={() => {}}
              onEdit={() => handleEdit(child.id)}
              onDelete={() => handleDeleteClick(child)}
              showActions={true}
            />
          ))}

          {/* 新規追加カード */}
          {canAddMore && (
            <div className="bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300 hover:border-yellow-400 transition-colors">
              <Link href="/children/new" className="block p-6">
                <div className="text-center min-h-[200px] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl text-gray-500">+</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">新しいプロファイルを追加</h3>
                  <p className="text-sm text-gray-600">
                    お子様のプロファイルを追加して<br />
                    個別の学習体験を始めましょう
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 削除確認モーダル */}
      {deleteTarget && (
        <DeleteConfirmModal
          child={deleteTarget}
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          loading={deletingId === deleteTarget.id}
        />
      )}
    </div>
  );
}

// EmptyState コンポーネント
function EmptyState({ canAddMore }: { canAddMore: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        プロファイルがありません
      </h2>
      <p className="text-gray-600 mb-6">
        お子様の最初のプロファイルを作成して、<br />
        個別の学習体験を始めましょう。
      </p>

      {canAddMore ? (
        <Link href="/children/new">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800">
            最初のプロファイルを作成
          </Button>
        </Link>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            プロファイル作成にはプランのアップグレードが必要です
          </p>
          <Link href="/subscription">
            <Button variant="outline">
              プランを見る
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}