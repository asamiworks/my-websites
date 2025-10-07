'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';
import { useAuthStore } from '@/stores/authStore';
import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase/config';

// バリデーションスキーマ
const profileSchema = z.object({
  displayName: z.string()
    .min(1, '表示名を入力してください')
    .max(50, '表示名は50文字以内で入力してください'),
  email: z.string()
    .email('有効なメールアドレスを入力してください'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user, setUser } = useAuthStore();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      setError(null);
      setSuccess(null);
      setIsLoading(true);

      const auth = getFirebaseAuth();
      const db = getFirebaseFirestore();

      // Firebase Authの表示名を更新
      if (auth.currentUser && data.displayName !== user.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: data.displayName,
        });
      }

      // Firestoreのユーザードキュメントを更新
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        displayName: data.displayName,
        // メール変更は別途実装が必要（Firebase Auth要求）
      });

      // ローカル状態を更新
      setUser(auth.currentUser, {
        ...user,
        displayName: data.displayName,
      });

      setSuccess('プロフィールを更新しました');
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError('プロフィールの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">ユーザー情報を読み込み中...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 表示名 */}
        <Input
          {...register('displayName')}
          label="表示名"
          placeholder="田中太郎"
          error={errors.displayName?.message}
          disabled={isLoading}
          hint="ダッシュボードやプロフィールで表示される名前です"
        />

        {/* メールアドレス */}
        <Input
          {...register('email')}
          type="email"
          label="メールアドレス"
          placeholder="example@example.com"
          error={errors.email?.message}
          disabled={true} // メール変更は別途実装
          hint="メールアドレスの変更は別途お問い合わせください"
        />
      </div>

      {/* アカウント情報 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-gray-800">アカウント情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">プラン:</span>
            <span className="ml-2 font-medium">
              {getPlanDisplayName(user.plan)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">登録日:</span>
            <span className="ml-2">
              {user.createdAt ? formatDate(user.createdAt) : '不明'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">最終ログイン:</span>
            <span className="ml-2">
              {user.lastLogin ? formatDate(user.lastLogin) : '不明'}
            </span>
          </div>
        </div>
      </div>

      {/* 保存ボタン */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={!isDirty || isLoading}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-800"
        >
          {isLoading ? '更新中...' : '変更を保存'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.reload()}
          disabled={isLoading}
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}

// ヘルパー関数
function getPlanDisplayName(plan: string): string {
  switch (plan) {
    case 'free': return '無料プラン';
    case 'kids': return 'まなびーキッズ';
    case 'friends': return 'まなびーフレンズ';
    case 'premium': return 'まなびープレミアム';
    default: return '無料プラン';
  }
}

function formatDate(timestamp: any): string {
  if (!timestamp) return '不明';

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '不明';
  }
}