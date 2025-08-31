// src/hooks/useErrorHandler.ts

import { useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { FirebaseError } from 'firebase/app';

interface ErrorHandlerOptions {
  showToast?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const { showToast } = useToast();

  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const { showToast: shouldShowToast = true, fallbackMessage } = options;

      // FirebaseErrorの処理
      if (error instanceof FirebaseError) {
        const message = getFirebaseErrorMessage(error);
        if (shouldShowToast) {
          showToast('error', 'エラー', message);
        }
        return message;
      }

      // 通常のErrorの処理
      if (error instanceof Error) {
        const message = error.message || fallbackMessage || '予期しないエラーが発生しました';
        if (shouldShowToast) {
          showToast('error', 'エラー', message);
        }
        return message;
      }

      // その他のエラー
      const message = fallbackMessage || '予期しないエラーが発生しました';
      if (shouldShowToast) {
        showToast('error', 'エラー', message);
      }
      return message;
    },
    [showToast]
  );

  const handleAsyncOperation = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      options: {
        loadingMessage?: string;
        successMessage?: string;
        errorOptions?: ErrorHandlerOptions;
      } = {}
    ): Promise<T | null> => {
      const { loadingMessage, successMessage, errorOptions } = options;

      try {
        if (loadingMessage) {
          showToast('info', loadingMessage);
        }

        const result = await operation();

        if (successMessage) {
          showToast('success', successMessage);
        }

        return result;
      } catch (error) {
        handleError(error, errorOptions);
        return null;
      }
    },
    [showToast, handleError]
  );

  return {
    handleError,
    handleAsyncOperation,
  };
};

// Firebaseエラーメッセージのマッピング
const getFirebaseErrorMessage = (error: FirebaseError): string => {
  const errorMessages: Record<string, string> = {
    // 認証関連
    'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
    'auth/invalid-email': '無効なメールアドレスです',
    'auth/operation-not-allowed': 'この操作は許可されていません',
    'auth/weak-password': 'パスワードが弱すぎます',
    'auth/user-disabled': 'このアカウントは無効化されています',
    'auth/user-not-found': 'ユーザーが見つかりません',
    'auth/wrong-password': 'パスワードが間違っています',
    'auth/invalid-credential': 'メールアドレスまたはパスワードが間違っています',
    'auth/too-many-requests': 'リクエストが多すぎます。しばらく待ってから再試行してください',
    'auth/network-request-failed': 'ネットワークエラーが発生しました',
    'auth/popup-closed-by-user': '認証がキャンセルされました',
    'auth/popup-blocked': 'ポップアップがブロックされました',
    
    // Firestore関連
    'permission-denied': 'アクセスが拒否されました',
    'unavailable': 'サービスが一時的に利用できません',
    'cancelled': '操作がキャンセルされました',
    'unknown': '不明なエラーが発生しました',
    'invalid-argument': '無効な引数です',
    'deadline-exceeded': 'タイムアウトしました',
    'not-found': 'データが見つかりません',
    'already-exists': 'データが既に存在します',
    'resource-exhausted': 'リソースが不足しています',
    'failed-precondition': '前提条件が満たされていません',
    'aborted': '操作が中断されました',
    'out-of-range': '範囲外の値です',
    'unimplemented': '未実装の機能です',
    'internal': '内部エラーが発生しました',
    'data-loss': 'データが失われました',
    'unauthenticated': '認証が必要です',
  };

  return errorMessages[error.code] || error.message || '予期しないエラーが発生しました';
};