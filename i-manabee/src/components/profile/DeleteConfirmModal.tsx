'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';
import { getAvatarEmoji } from '@/lib/firebase/children';
import type { Child } from '@/types/children';

// PIN確認フォームのスキーマ
const pinConfirmSchema = z.object({
  pin: z.string()
    .min(4, 'PINは4桁で入力してください')
    .max(4, 'PINは4桁で入力してください')
    .regex(/^\d{4}$/, 'PINは4桁の数字で入力してください'),
});

type PinConfirmData = z.infer<typeof pinConfirmSchema>;

interface DeleteConfirmModalProps {
  child: Child;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => Promise<void>;
  loading?: boolean;
}

export function DeleteConfirmModal({
  child,
  isOpen,
  onClose,
  onConfirm,
  loading = false
}: DeleteConfirmModalProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PinConfirmData>({
    resolver: zodResolver(pinConfirmSchema),
    defaultValues: { pin: '' }
  });

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: PinConfirmData) => {
    try {
      setError(null);
      await onConfirm(data.pin);
      handleClose();
    } catch (error: any) {
      console.error('[DeleteConfirmModal] Error:', error);
      setError(error.message || '削除に失敗しました。再度お試しください。');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>

      {/* モーダルコンテンツ */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center space-y-4">
            {/* アバター表示 */}
            <div className="text-6xl">{getAvatarEmoji(child.avatar)}</div>

            {/* 警告メッセージ */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-600">
                プロファイルを削除しますか？
              </h3>
              <p className="text-gray-700">
                <span className="font-semibold">{child.nickname}</span>のプロファイルを削除します。
              </p>
              <p className="text-sm text-red-600">
                この操作は取り消せません。学習履歴やデータもすべて削除されます。
              </p>
            </div>

            {/* PIN入力フォーム */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert className="text-red-800 bg-red-50 border-red-200">
                  {error}
                </Alert>
              )}

              <div className="text-left">
                <Input
                  {...register('pin')}
                  type="password"
                  label="削除確認のため、このプロファイルのPINを入力してください"
                  placeholder="1234"
                  error={errors.pin?.message}
                  disabled={isSubmitting || loading}
                  maxLength={4}
                  className="text-center text-lg"
                />
              </div>

              {/* アクションボタン */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting || loading}
                  className="flex-1"
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting || loading}
                  className="flex-1"
                >
                  {isSubmitting || loading ? '削除中...' : '削除する'}
                </Button>
              </div>
            </form>

            {/* セキュリティ情報 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
              <h4 className="font-medium text-yellow-800 text-sm mb-1">
                セキュリティについて
              </h4>
              <p className="text-xs text-yellow-700">
                削除操作には本人確認のためPIN認証が必要です。
                正しいPINを入力してください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}