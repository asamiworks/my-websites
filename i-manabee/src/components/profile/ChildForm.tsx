'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { useChildren } from '@/hooks/useChildren';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';
import { AvatarSelector } from '@/components/profile/AvatarSelector';
import type { Child, AvatarType, CreateChildData, UpdateChildData } from '@/types/children';

// バリデーションスキーマ
const childFormSchema = z.object({
  nickname: z.string()
    .min(1, 'ニックネームを入力してください')
    .max(20, 'ニックネームは20文字以内で入力してください'),
  birthMonth: z.string()
    .min(1, '生年月を選択してください')
    .regex(/^\d{4}-\d{2}$/, '正しい形式で入力してください'),
  avatar: z.enum(['bear', 'rabbit', 'cat', 'dog', 'panda', 'lion', 'penguin', 'fox'], {
    required_error: 'アバターを選択してください'
  }),
  pin: z.string()
    .min(4, 'PINは4桁で入力してください')
    .max(4, 'PINは4桁で入力してください')
    .regex(/^\d{4}$/, 'PINは4桁の数字で入力してください'),
  pinConfirm: z.string()
    .min(4, 'PIN確認を入力してください')
    .max(4, 'PIN確認は4桁で入力してください')
}).refine((data) => data.pin === data.pinConfirm, {
  message: 'PINが一致しません',
  path: ['pinConfirm'],
});

type ChildFormData = z.infer<typeof childFormSchema>;

interface ChildFormProps {
  mode: 'create' | 'edit';
  child?: Child;
  onSuccess?: () => void;
}

export function ChildForm({ mode, child, onSuccess }: ChildFormProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { children, createChild, updateChild, loading } = useChildren();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChildFormData>({
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      nickname: child?.nickname || '',
      birthMonth: child?.birthMonth || '',
      avatar: child?.avatar || 'bear',
      pin: '',
      pinConfirm: '',
    },
  });

  const selectedAvatar = watch('avatar');

  // プラン制限チェック
  const canCreateChild = () => {
    if (!user) return false;

    const maxChildren = getMaxChildren(user.plan);
    return children.length < maxChildren;
  };

  const getMaxChildren = (plan: string): number => {
    switch (plan) {
      case 'free': return 1;
      case 'kids': return 1;
      case 'friends': return 3;
      case 'premium': return 5;
      default: return 1;
    }
  };

  const onSubmit = async (data: ChildFormData) => {
    if (!user) {
      setError('ユーザー情報が見つかりません');
      return;
    }

    if (mode === 'create' && !canCreateChild()) {
      setError('プラン制限により、これ以上プロファイルを作成できません');
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      if (mode === 'create') {
        const childData: CreateChildData = {
          nickname: data.nickname,
          birthMonth: data.birthMonth,
          avatar: data.avatar,
          pin: data.pin,
        };

        await createChild(childData);
        setSuccess('子どもプロファイルを作成しました！');

        // 2秒後に一覧ページに戻る
        setTimeout(() => {
          router.push('/children');
        }, 2000);

      } else if (mode === 'edit' && child) {
        const updateData: UpdateChildData = {
          nickname: data.nickname,
          birthMonth: data.birthMonth,
          avatar: data.avatar,
        };

        // PINが入力されている場合のみ更新
        if (data.pin) {
          updateData.pin = data.pin;
        }

        await updateChild(child.id, updateData);
        setSuccess('子どもプロファイルを更新しました！');

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Form submit error:', error);
      setError(error.message || '処理に失敗しました。再度お試しください。');
    }
  };

  const handleCancel = () => {
    router.push('/children');
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">ユーザー情報を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {success && (
          <Alert className="text-green-800 bg-green-50 border-green-200">
            {success}
          </Alert>
        )}

        {error && (
          <Alert className="text-red-800 bg-red-50 border-red-200">
            {error}
          </Alert>
        )}

        {/* プラン制限警告 */}
        {mode === 'create' && !canCreateChild() && (
          <Alert className="text-orange-800 bg-orange-50 border-orange-200">
            <h4 className="font-medium mb-2">プロファイル上限に達しました</h4>
            <p className="text-sm mb-4">
              現在のプラン（{user.plan}）では{getMaxChildren(user.plan)}人まで作成可能です。
              さらに多くのプロファイルを作成するにはプランのアップグレードが必要です。
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push('/subscription')}
            >
              プラン変更
            </Button>
          </Alert>
        )}

        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">基本情報</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ニックネーム */}
            <Input
              {...register('nickname')}
              label="ニックネーム *"
              placeholder="たろう"
              error={errors.nickname?.message}
              disabled={isSubmitting || loading}
            />

            {/* 生年月 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                生年月 *
              </label>
              <input
                {...register('birthMonth')}
                type="month"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                disabled={isSubmitting || loading}
              />
              {errors.birthMonth && (
                <p className="text-red-500 text-sm mt-1">{errors.birthMonth.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* アバター選択 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">アバター選択 *</h3>

          <AvatarSelector
            selectedAvatar={selectedAvatar}
            onAvatarSelect={(avatar: AvatarType) => setValue('avatar', avatar)}
            disabled={isSubmitting || loading}
          />

          {errors.avatar && (
            <p className="text-red-500 text-sm mt-2">{errors.avatar.message}</p>
          )}
        </div>

        {/* PIN設定 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">PIN設定 *</h3>
          <p className="text-sm text-gray-600 mb-4">
            {mode === 'create'
              ? 'お子様がプロファイルを選択する際に使用する4桁のPINを設定してください。'
              : 'PINを変更する場合のみ入力してください。空欄の場合は現在のPINが維持されます。'
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              {...register('pin')}
              type="password"
              label="PIN（4桁の数字）*"
              placeholder="1234"
              error={errors.pin?.message}
              disabled={isSubmitting || loading}
              maxLength={4}
            />

            <Input
              {...register('pinConfirm')}
              type="password"
              label="PIN確認 *"
              placeholder="1234"
              error={errors.pinConfirm?.message}
              disabled={isSubmitting || loading}
              maxLength={4}
            />
          </div>

          {/* セキュリティ情報 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <h4 className="font-medium text-blue-800 text-sm mb-2">
              セキュリティについて
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• PINは暗号化されて安全に保存されます</li>
              <li>• お子様が覚えやすい4桁の数字を設定してください</li>
              <li>• 定期的にPINを変更することを推奨します</li>
            </ul>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || loading || (mode === 'create' && !canCreateChild())}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800"
          >
            {isSubmitting || loading ? '処理中...' : mode === 'create' ? 'プロファイルを作成' : 'プロファイルを更新'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting || loading}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  );
}