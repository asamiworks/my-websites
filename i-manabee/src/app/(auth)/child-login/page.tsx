'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, Alert, PinInput } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';

export default function ChildLoginPage() {
  const [pin, setPin] = useState('');
  const [localError, setLocalError] = useState('');
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('child');

  // TODO: 実際のデータを取得
  const mockChildren = [
    {
      id: '1',
      name: 'たろう',
      ageGroup: 'junior' as const,
      birthMonth: '2015-04',
      grade: '小3'
    },
    {
      id: '2',
      name: 'はなこ',
      ageGroup: 'middle' as const,
      birthMonth: '2012-08',
      grade: '中1'
    }
  ];

  useEffect(() => {
    // 認証されていない場合はログインページに戻る
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/login');
      return;
    }

    // 子どもIDが指定されている場合、その子どもを選択
    if (childId) {
      const child = mockChildren.find(c => c.id === childId);
      if (child) {
        setSelectedChild(child);
      } else {
        setLocalError('指定された子どもプロファイルが見つかりません');
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, childId, router]);

  const getAgeFromBirthMonth = (birthMonth: string) => {
    const birth = new Date(birthMonth + '-01');
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    return monthDiff < 0 ? age - 1 : age;
  };

  const handleChildSelect = (child: any) => {
    setSelectedChild(child);
    setPin('');
    setLocalError('');
  };

  const handlePinSubmit = async () => {
    setLocalError('');

    if (!selectedChild) {
      setLocalError('子どもプロファイルを選択してください');
      return;
    }

    if (!pin || pin.length !== 4) {
      setLocalError('4桁のPINを入力してください');
      return;
    }

    setIsLoading(true);

    try {
      // セッション管理を使用したPIN認証
      const success = await session.startChildSession(selectedChild.id, pin);

      if (success) {
        // 認証成功：チャット画面に遷移
        router.push(`/chat?child=${selectedChild.id}`);
      } else {
        setLocalError('PINが正しくありません');
        setPin('');
      }
    } catch (error: any) {
      console.error('PIN認証エラー:', error);
      setLocalError('認証に失敗しました。もう一度お試しください。');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToParent = () => {
    router.push('/dashboard');
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bee-flying">🐝</div>
          <p className="text-text-sub">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null; // useEffectでリダイレクトされるまで何も表示しない
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-honey-yellow to-warning-yellow flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        {!selectedChild ? (
          // 子ども選択画面
          <>
            <div className="text-center mb-8">
              <div className="text-4xl mb-4 animate-bee-flying">🐝</div>
              <h1 className="text-2xl font-bold text-text-main mb-2">
                だれが まなぶかな？
              </h1>
              <p className="text-text-sub">学習したい人を選んでください</p>
            </div>

            {localError && (
              <Alert variant="error" className="mb-6" dismissible onDismiss={() => setLocalError('')}>
                {localError}
              </Alert>
            )}

            <div className="space-y-4">
              {mockChildren.map((child) => {
                const age = getAgeFromBirthMonth(child.birthMonth);
                return (
                  <button
                    key={child.id}
                    onClick={() => handleChildSelect(child)}
                    className={`
                      w-full p-4 rounded-xl border-2 transition-all text-left
                      hover:border-honey-yellow hover:bg-honey-yellow hover:bg-opacity-10
                      ${child.ageGroup === 'junior'
                        ? 'border-kids-blue bg-kids-blue bg-opacity-5'
                        : child.ageGroup === 'middle'
                          ? 'border-friends-purple bg-friends-purple bg-opacity-5'
                          : 'border-premium-gold bg-premium-gold bg-opacity-5'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                        ${child.ageGroup === 'junior'
                          ? 'bg-kids-blue'
                          : child.ageGroup === 'middle'
                            ? 'bg-friends-purple'
                            : 'bg-premium-gold'
                        }
                      `}>
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-text-main">{child.name}</p>
                        <p className="text-sm text-text-sub">{child.grade} · {age}歳</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" onClick={handleBackToParent} className="w-full">
                おとなの画面に戻る
              </Button>
            </div>
          </>
        ) : (
          // PIN入力画面
          <>
            <div className="text-center mb-8">
              <div className={`
                w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl mb-4
                ${selectedChild.ageGroup === 'junior'
                  ? 'bg-kids-blue'
                  : selectedChild.ageGroup === 'middle'
                    ? 'bg-friends-purple'
                    : 'bg-premium-gold'
                }
              `}>
                {selectedChild.name.charAt(0)}
              </div>
              <h1 className="text-2xl font-bold text-text-main mb-2">
                こんにちは、{selectedChild.name}さん！
              </h1>
              <p className="text-text-sub">PINを入力してください</p>
            </div>

            {localError && (
              <Alert variant="error" className="mb-6" dismissible onDismiss={() => setLocalError('')}>
                {localError}
              </Alert>
            )}

            <div className="text-center mb-8">
              <div className="mb-4">
                <PinInput
                  value={pin}
                  onChange={setPin}
                  length={4}
                  disabled={isLoading}
                  error={!!localError}
                  autoFocus
                  className="justify-center"
                />
              </div>

              <p className="text-xs text-text-sub">
                PINを忘れた場合は、おうちの人に聞いてください
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handlePinSubmit}
                loading={isLoading}
                disabled={pin.length !== 4}
                className={`
                  ${selectedChild.ageGroup === 'junior'
                    ? 'bg-gradient-to-r from-kids-blue to-blue-500'
                    : selectedChild.ageGroup === 'middle'
                      ? 'bg-gradient-to-r from-friends-purple to-purple-500'
                      : 'bg-gradient-to-r from-premium-gold to-yellow-500'
                  }
                `}
              >
                {isLoading ? '確認中...' : 'まなびーと話す'}
              </Button>

              <Button variant="outline" fullWidth onClick={() => setSelectedChild(null)}>
                人を変える
              </Button>

              <Button variant="outline" fullWidth onClick={handleBackToParent} className="text-text-sub">
                おとなの画面に戻る
              </Button>
            </div>

            {/* 数字キーパッド（タッチデバイス用） */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    if (!isLoading && pin.length < 4) {
                      setPin(pin + num.toString());
                    }
                  }}
                  disabled={isLoading || pin.length >= 4}
                  className="
                    aspect-square rounded-lg border-2 border-gray-300
                    hover:border-honey-yellow hover:bg-honey-yellow hover:bg-opacity-10
                    disabled:opacity-50 disabled:cursor-not-allowed
                    text-xl font-bold text-text-main
                    transition-all
                  "
                >
                  {num}
                </button>
              ))}

              <div></div> {/* 空のセル */}

              <button
                onClick={() => {
                  if (!isLoading && pin.length < 4) {
                    setPin(pin + '0');
                  }
                }}
                disabled={isLoading || pin.length >= 4}
                className="
                  aspect-square rounded-lg border-2 border-gray-300
                  hover:border-honey-yellow hover:bg-honey-yellow hover:bg-opacity-10
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-xl font-bold text-text-main
                  transition-all
                "
              >
                0
              </button>

              <button
                onClick={() => {
                  if (!isLoading && pin.length > 0) {
                    setPin(pin.slice(0, -1));
                  }
                }}
                disabled={isLoading || pin.length === 0}
                className="
                  aspect-square rounded-lg border-2 border-gray-300
                  hover:border-error-red hover:bg-error-red hover:bg-opacity-10
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-xl font-bold text-error-red
                  transition-all
                "
              >
                ⌫
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}