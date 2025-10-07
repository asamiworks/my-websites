'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';
import { useAuthStore } from '@/stores/authStore';
import { getFirebaseAuth } from '@/lib/firebase/config';

// バリデーションスキーマ
const passwordSchema = z.object({
  currentPassword: z.string()
    .min(1, '現在のパスワードを入力してください'),
  newPassword: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'パスワードは英数字を含む必要があります'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function PasswordChangeForm() {
  const { user } = useAuthStore();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    if (!user || !user.email) return;

    try {
      setError(null);
      setSuccess(null);
      setIsLoading(true);

      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('ユーザーが見つかりません');
      }

      // 現在のパスワードで再認証
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // パスワードを更新
      await updatePassword(currentUser, data.newPassword);

      setSuccess('パスワードを更新しました');
      reset(); // フォームをリセット
    } catch (err: any) {
      console.error('Password change error:', err);

      if (err.code === 'auth/wrong-password') {
        setError('現在のパスワードが正しくありません');
      } else if (err.code === 'auth/weak-password') {
        setError('パスワードが弱すぎます');
      } else if (err.code === 'auth/requires-recent-login') {
        setError('セキュリティのため、再度ログインしてからお試しください');
      } else {
        setError('パスワードの更新に失敗しました');
      }
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
    <div className="max-w-md">
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

        {/* 現在のパスワード */}
        <Input
          {...register('currentPassword')}
          type="password"
          label="現在のパスワード"
          placeholder="現在のパスワードを入力"
          error={errors.currentPassword?.message}
          disabled={isLoading}
        />

        {/* 新しいパスワード */}
        <Input
          {...register('newPassword')}
          type="password"
          label="新しいパスワード"
          placeholder="新しいパスワードを入力"
          error={errors.newPassword?.message}
          disabled={isLoading}
          hint="8文字以上、英数字を含む"
        />

        {/* パスワード確認 */}
        <Input
          {...register('confirmPassword')}
          type="password"
          label="パスワード確認"
          placeholder="新しいパスワードを再入力"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
        />

        {/* セキュリティ情報 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-800 text-sm mb-2">
            セキュリティのヒント
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 他のサイトで使用していないパスワードを選択</li>
            <li>• 定期的なパスワード変更を推奨</li>
            <li>• 第三者にパスワードを教えないでください</li>
          </ul>
        </div>

        {/* 更新ボタン */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800"
          >
            {isLoading ? '更新中...' : 'パスワード変更'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isLoading}
          >
            クリア
          </Button>
        </div>
      </form>
    </div>
  );
}