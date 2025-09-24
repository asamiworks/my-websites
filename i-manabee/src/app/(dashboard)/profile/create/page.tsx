'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Alert } from '@/components/ui';
import { useRequireAuth } from '@/hooks/useAuth';

interface ChildFormData {
  name: string;
  birthMonth: string;
  grade: string;
  interests: string[];
  learningGoals: string[];
  pin: string;
  confirmPin: string;
}

export default function CreateChildProfilePage() {
  const [formData, setFormData] = useState<ChildFormData>({
    name: '',
    birthMonth: '',
    grade: '',
    interests: [],
    learningGoals: [],
    pin: '',
    confirmPin: ''
  });
  const [localError, setLocalError] = useState('');
  const [step, setStep] = useState(1);

  const auth = useRequireAuth();
  const router = useRouter();

  // 利用可能な興味分野
  const availableInterests = [
    '算数・数学', '国語', '理科', '社会', '英語',
    '音楽', '図工・美術', '体育', 'プログラミング',
    '動物', '植物', '宇宙', '歴史', 'ゲーム'
  ];

  // 学習目標オプション
  const availableLearningGoals = [
    '基礎学力向上', '応用問題への挑戦', '読解力向上',
    '計算力向上', '創造力育成', '論理的思考力',
    '英語力向上', 'プログラミング思考', '科学的思考力'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal]
    }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setLocalError('お子様のお名前を入力してください');
      return false;
    }
    if (!formData.birthMonth) {
      setLocalError('生年月を選択してください');
      return false;
    }
    if (!formData.grade) {
      setLocalError('学年を選択してください');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.interests.length === 0) {
      setLocalError('少なくとも1つの興味分野を選択してください');
      return false;
    }
    if (formData.learningGoals.length === 0) {
      setLocalError('少なくとも1つの学習目標を選択してください');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.pin || formData.pin.length !== 4) {
      setLocalError('4桁のPINを入力してください');
      return false;
    }
    if (!/^\d{4}$/.test(formData.pin)) {
      setLocalError('PINは4桁の数字で入力してください');
      return false;
    }
    if (formData.pin !== formData.confirmPin) {
      setLocalError('PINが一致しません');
      return false;
    }
    // 簡単すぎるPINのチェック
    const simplePatterns = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321'];
    if (simplePatterns.includes(formData.pin)) {
      setLocalError('より安全なPINを設定してください（連続した数字や同じ数字の繰り返しは避けてください）');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setLocalError('');

    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setLocalError('');
    }
  };

  const handleSubmit = async () => {
    setLocalError('');

    if (!validateStep3()) return;

    try {
      // TODO: 子どもプロファイル作成API呼び出し
      console.log('子どもプロファイル作成:', formData);

      // 仮の処理
      await new Promise(resolve => setTimeout(resolve, 1000));

      // プロファイル管理ページに戻る
      router.push('/dashboard/profile');
    } catch (err: any) {
      setLocalError(err.message || 'プロファイルの作成に失敗しました');
    }
  };

  const getAgeFromBirthMonth = (birthMonth: string) => {
    if (!birthMonth) return null;
    const birth = new Date(birthMonth + '-01');
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    return monthDiff < 0 ? age - 1 : age;
  };

  const age = getAgeFromBirthMonth(formData.birthMonth);
  const isUnder13 = age !== null && age < 13;

  if (auth.isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* プログレスバー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-sub">プロファイル作成</span>
          <span className="text-sm text-text-sub">ステップ {step}/3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-honey-yellow h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">👶</div>
          <h1 className="text-2xl font-bold text-text-main mb-2">
            {step === 1 && 'お子様の基本情報'}
            {step === 2 && '興味・学習目標の設定'}
            {step === 3 && 'PIN設定'}
          </h1>
          <p className="text-text-sub">
            {step === 1 && 'お子様の基本的な情報を入力してください'}
            {step === 2 && 'お子様の興味や学習目標を選択してください'}
            {step === 3 && 'お子様専用のPINを設定してください'}
          </p>
        </div>

        {localError && (
          <Alert variant="error" className="mb-6" dismissible onDismiss={() => setLocalError('')}>
            {localError}
          </Alert>
        )}

        {/* COPPA警告（13歳未満の場合） */}
        {isUnder13 && (
          <Alert variant="warning" className="mb-6">
            <div className="flex items-start space-x-2">
              <span>🛡️</span>
              <div>
                <p className="font-semibold mb-1">13歳未満のお子様</p>
                <p className="text-sm">
                  COPPA準拠により、追加の個人情報保護措置が適用されます。
                  学習データは最小限に制限され、保護者の監視機能が強化されます。
                </p>
              </div>
            </div>
          </Alert>
        )}

        {/* ステップ1: 基本情報 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-main mb-2">
                お子様のお名前 <span className="text-error-red">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="input-base"
                placeholder="例：たろう"
                required
              />
              <p className="text-xs text-text-sub mt-1">
                チャットで使用される名前です（ひらがな・カタカナ・漢字対応）
              </p>
            </div>

            <div>
              <label htmlFor="birthMonth" className="block text-sm font-medium text-text-main mb-2">
                生年月 <span className="text-error-red">*</span>
              </label>
              <input
                id="birthMonth"
                name="birthMonth"
                type="month"
                value={formData.birthMonth}
                onChange={handleInputChange}
                className="input-base"
                min="2005-01"
                max={new Date().toISOString().slice(0, 7)}
                required
              />
              <p className="text-xs text-text-sub mt-1">
                年齢に応じた適切なコンテンツを提供するために使用します
              </p>
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-text-main mb-2">
                学年 <span className="text-error-red">*</span>
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="input-base"
                required
              >
                <option value="">学年を選択してください</option>
                <option value="小1">小学1年生</option>
                <option value="小2">小学2年生</option>
                <option value="小3">小学3年生</option>
                <option value="小4">小学4年生</option>
                <option value="小5">小学5年生</option>
                <option value="小6">小学6年生</option>
                <option value="中1">中学1年生</option>
                <option value="中2">中学2年生</option>
                <option value="中3">中学3年生</option>
                <option value="高1">高校1年生</option>
                <option value="高2">高校2年生</option>
                <option value="高3">高校3年生</option>
              </select>
            </div>
          </div>
        )}

        {/* ステップ2: 興味・学習目標 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-main mb-4">興味のある分野</h3>
              <p className="text-sm text-text-sub mb-4">
                お子様が興味を持っている分野を選択してください（複数選択可）
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableInterests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.interests.includes(interest)
                        ? 'border-honey-yellow bg-honey-yellow bg-opacity-10 text-honey-yellow font-semibold'
                        : 'border-gray-200 hover:border-honey-yellow text-text-sub hover:text-text-main'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-main mb-4">学習目標</h3>
              <p className="text-sm text-text-sub mb-4">
                お子様の学習目標を選択してください（複数選択可）
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableLearningGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleGoalToggle(goal)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.learningGoals.includes(goal)
                        ? 'border-honey-yellow bg-honey-yellow bg-opacity-10 text-honey-yellow font-semibold'
                        : 'border-gray-200 hover:border-honey-yellow text-text-sub hover:text-text-main'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ステップ3: PIN設定 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-kids-blue rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-text-main mb-2 flex items-center">
                <span className="mr-2">🔐</span>
                PINについて
              </h3>
              <ul className="text-sm text-text-sub space-y-1">
                <li>• お子様がアプリにログインする際に使用する4桁の数字です</li>
                <li>• 簡単すぎる数字（1234、0000など）は避けてください</li>
                <li>• お子様が覚えやすく、他の人に推測されにくい数字にしてください</li>
                <li>• PINは後から変更することも可能です</li>
              </ul>
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-text-main mb-2">
                PIN（4桁の数字） <span className="text-error-red">*</span>
              </label>
              <input
                id="pin"
                name="pin"
                type="password"
                value={formData.pin}
                onChange={handleInputChange}
                className="input-base text-center text-2xl tracking-widest"
                placeholder="••••"
                maxLength={4}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPin" className="block text-sm font-medium text-text-main mb-2">
                PIN確認 <span className="text-error-red">*</span>
              </label>
              <input
                id="confirmPin"
                name="confirmPin"
                type="password"
                value={formData.confirmPin}
                onChange={handleInputChange}
                className="input-base text-center text-2xl tracking-widest"
                placeholder="••••"
                maxLength={4}
                required
              />
            </div>
          </div>
        )}

        {/* ボタン */}
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={step === 1 ? () => router.push('/dashboard/profile') : handlePrevStep}
          >
            {step === 1 ? 'キャンセル' : '戻る'}
          </Button>

          {step < 3 ? (
            <Button
              variant="primary"
              onClick={handleNextStep}
              className="bg-gradient-to-r from-honey-yellow to-warning-yellow"
            >
              次へ
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={auth.isLoading}
              className="bg-gradient-to-r from-honey-yellow to-warning-yellow"
            >
              プロファイル作成
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}