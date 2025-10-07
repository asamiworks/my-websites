'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/Alert';
import { useChildren } from '@/hooks/useChildren';
import { getAvatarEmoji } from '@/lib/firebase/children';

interface PinDialogProps {
  childId: string;
  onVerified: (childId: string) => void;
  onClose: () => void;
}

export function PinDialog({ childId, onVerified, onClose }: PinDialogProps) {
  const { children, verifyPin } = useChildren();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const child = children.find(c => c.id === childId);

  if (!child) return null;

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    // 次の入力欄にフォーカス
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspaceで前の入力欄に戻る
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const pinValue = pin.join('');

    if (pinValue.length !== 4) {
      setError('PINを4桁入力してください');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      const isValid = await verifyPin(childId, pinValue);

      if (isValid) {
        onVerified(childId);
      } else {
        setError('PINが正しくありません');
        setPin(['', '', '', '']);
        // 最初の入力欄にフォーカス
        setTimeout(() => {
          document.getElementById('pin-0')?.focus();
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">{getAvatarEmoji(child.avatar)}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {child.nickname}のPINを入力
          </h2>
          <p className="text-gray-600">
            4桁の数字を入力してください
          </p>
        </div>

        {error && (
          <Alert className="text-red-800 bg-red-50 border-red-200">
            {error}
          </Alert>
        )}

        {/* PIN入力 */}
        <div className="flex justify-center gap-3">
          {pin.map((digit, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              disabled={isLoading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* ボタン */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isLoading}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800"
          >
            {isLoading ? '確認中...' : 'ログイン'}
          </Button>
        </div>
      </div>
    </div>
  );
}