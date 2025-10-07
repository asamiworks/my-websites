'use client';

import { useState, useEffect } from 'react';
import { useProfileStore } from '@/stores/profileStore';
import { getAvatarEmoji } from '@/lib/firebase/children';
import { Button } from '@/components/ui/button';
import type { Child } from '@/types/children';

interface PinInputModalProps {
  child: Child;
  isOpen: boolean;
  onSuccess: (child: Child) => void;
  onCancel: () => void;
}

export function PinInputModal({
  child,
  isOpen,
  onSuccess,
  onCancel
}: PinInputModalProps) {
  const { verifyPin } = useProfileStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      setAttempts(0);
    }
  }, [isOpen]);

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);

      // 4桁入力完了時に自動で認証
      if (newPin.length === 4) {
        handleVerifyPin(newPin);
      }
    }
  };

  const handleDeletePin = () => {
    setPin(pin.slice(0, -1));
    setError(null);
  };

  const handleVerifyPin = async (pinToVerify: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const isValid = await verifyPin(child.id, pinToVerify);

      if (isValid) {
        onSuccess(child);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          setError('3回間違えました。保護者の方にお聞きください。');
          // 3回失敗で5秒間無効化
          setTimeout(() => {
            setAttempts(0);
            setError(null);
          }, 5000);
        } else {
          setError(`PINが違います。あと${3 - newAttempts}回チャレンジできます。`);
        }
        setPin('');
      }
    } catch (error: any) {
      console.error('[PinInputModal] Verification error:', error);
      setError('エラーが発生しました。もう一度お試しください。');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isDisabled = attempts >= 3 || isLoading;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel}></div>

      {/* モーダルコンテンツ */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          {/* アバターとメッセージ */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">{getAvatarEmoji(child.avatar)}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              こんにちは、{child.nickname}さん！
            </h2>
            <p className="text-lg text-gray-600">
              PINをいれてね
            </p>
          </div>

          {/* PIN表示部分 */}
          <div className="flex justify-center mb-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-16 h-16 mx-2 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                  pin.length > index
                    ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                {pin.length > index ? '●' : ''}
              </div>
            ))}
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="text-center mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-2xl mb-2">😅</div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* PIN入力ボタン */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                onClick={() => handlePinInput(digit.toString())}
                disabled={isDisabled}
                className={`h-16 rounded-xl text-2xl font-bold transition-all transform active:scale-95 ${
                  isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-100 hover:bg-yellow-200 text-gray-800 shadow-lg hover:shadow-xl'
                }`}
              >
                {digit}
              </button>
            ))}

            {/* 空のスペース */}
            <div></div>

            {/* 0ボタン */}
            <button
              onClick={() => handlePinInput('0')}
              disabled={isDisabled}
              className={`h-16 rounded-xl text-2xl font-bold transition-all transform active:scale-95 ${
                isDisabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-100 hover:bg-yellow-200 text-gray-800 shadow-lg hover:shadow-xl'
              }`}
            >
              0
            </button>

            {/* 削除ボタン */}
            <button
              onClick={handleDeletePin}
              disabled={isDisabled || pin.length === 0}
              className={`h-16 rounded-xl text-xl font-bold transition-all transform active:scale-95 ${
                isDisabled || pin.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-100 hover:bg-orange-200 text-orange-800 shadow-lg hover:shadow-xl'
              }`}
            >
              ←
            </button>
          </div>

          {/* アクションボタン */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 h-12 text-lg"
            >
              やめる
            </Button>

            {/* ローディング状態 */}
            {isLoading && (
              <div className="flex-1 h-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                <span className="ml-2 text-gray-600">確認中...</span>
              </div>
            )}
          </div>

          {/* ヘルプメッセージ */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              PINがわからないときは、おとなのひとにきいてね
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}