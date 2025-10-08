# 👤 Phase 2.2: マイページ実装仕様

最終更新: 2025-10-07  
Version: 1.0.0  
実装期間: Week 3（2025-10-21 〜 2025-10-27）

---

## 📚 前提ドキュメント

**必読（Claude CODEはこれらを先に読むこと）**:
1. [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - UIコンポーネント
2. [TYPE_REFERENCE.md](../TYPE_REFERENCE.md) - Child, User型
3. [DIRECTORY_STRUCTURE.md](../DIRECTORY_STRUCTURE.md) - ファイル配置
4. [PHASE2-1_AUTH.md](./PHASE2-1_AUTH.md) - 認証システム（前提）

---

## 🎯 このフェーズの目的

保護者が子どもプロファイルを管理し、各プロファイルでPIN認証してチャットできるようにする。

### 達成目標
- [ ] 子どもプロファイルを追加/編集/削除できる
- [ ] アバターを8種類から選択できる
- [ ] 4桁のPINを設定できる
- [ ] PINでログインして子ども視点のチャットができる
- [ ] ダッシュボードで全体の使用状況が見える

---

## ✅ 実装チェックリスト

### Day 15-17: ダッシュボード強化とプロフィール管理

#### Day 15: ダッシュボード強化
- [ ] 使用状況サマリーカード
- [ ] 現在のプラン表示
- [ ] 子どもプロファイル一覧カード
- [ ] クイックアクション拡張

#### Day 16: プロフィール管理
- [ ] `app/(dashboard)/profile/page.tsx` 作成
- [ ] 保護者情報編集フォーム
- [ ] メールアドレス変更
- [ ] パスワード変更
- [ ] 設定（通知等）

#### Day 17: 設定画面
- [ ] `app/(dashboard)/settings/page.tsx` 作成
- [ ] メール通知設定
- [ ] 週次レポート設定
- [ ] 安全性アラート設定

### Day 18-21: 子どもプロファイル管理

#### Day 18: プロファイル一覧
- [ ] `app/(dashboard)/children/page.tsx` 作成
- [ ] `components/profile/ChildCard.tsx` 作成
- [ ] `components/profile/ChildList.tsx` 作成
- [ ] プロファイル一覧表示

#### Day 19: プロファイル追加
- [ ] `app/(dashboard)/children/new/page.tsx` 作成
- [ ] `components/profile/ChildForm.tsx` 作成
- [ ] `components/profile/AvatarSelector.tsx` 作成
- [ ] ニックネーム、生年月、アバター、PIN設定

#### Day 20: プロファイル編集・削除
- [ ] `app/(dashboard)/children/[id]/page.tsx` 作成
- [ ] 編集フォーム
- [ ] 削除確認ダイアログ
- [ ] Firestore CRUD操作

#### Day 21: PIN認証
- [ ] `components/profile/PinDialog.tsx` 作成
- [ ] PINによる子どもログイン
- [ ] チャット画面との連携
- [ ] セッション管理

---

## 🏗️ アーキテクチャ

### データフロー
保護者ログイン
↓
ダッシュボード
↓
子どもプロファイル管理
↓
プロファイル選択 → PIN入力
↓
PIN検証（Firestore）
↓
子どもセッション開始
↓
チャット画面（子ども視点）

### ディレクトリ構成（新規作成分）
src/
├── app/
│   └── (dashboard)/
│       ├── dashboard/
│       │   └── page.tsx              # 強化
│       ├── profile/
│       │   └── page.tsx              ✨ 新規
│       ├── children/
│       │   ├── page.tsx              ✨ 新規（一覧）
│       │   ├── new/
│       │   │   └── page.tsx          ✨ 新規（追加）
│       │   └── [id]/
│       │       └── page.tsx          ✨ 新規（編集）
│       └── settings/
│           └── page.tsx              ✨ 新規
│
├── components/
│   ├── dashboard/
│   │   ├── StatsCard.tsx             # 既存
│   │   ├── RecentActivity.tsx        ✨ 新規
│   │   └── QuickActions.tsx          ✨ 新規
│   │
│   └── profile/
│       ├── ChildCard.tsx             ✨ 新規
│       ├── ChildList.tsx             ✨ 新規
│       ├── ChildForm.tsx             ✨ 新規
│       ├── AvatarSelector.tsx        ✨ 新規
│       └── PinDialog.tsx             ✨ 新規
│
├── lib/
│   └── firebase/
│       └── children.ts               ✨ 新規
│
├── stores/
│   └── profileStore.ts               ✨ 新規
│
└── hooks/
├── useChildren.ts                ✨ 新規
└── useProfile.ts                 ✨ 新規

---

## 📱 画面仕様

### 1. ダッシュボード強化 (`/dashboard`)

#### UI要件（更新版）
┌─────────────────────────────────────┐
│  Header                    [ログアウト]│
├─────────────────────────────────────┤
│                                     │
│  こんにちは、〇〇さん！              │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌───────┐│
│  │使用状況  │ │プラン    │ │子ども ││
│  │ 20/100  │ │無料      │ │ 2人   ││
│  └─────────┘ └─────────┘ └───────┘│
│                                     │
│  子どもプロファイル                  │
│  ┌─────────┐ ┌─────────┐          │
│  │🐻 たろう│ │🐰 はなこ│ [+追加]  │
│  │9歳      │ │7歳      │          │
│  └─────────┘ └─────────┘          │
│                                     │
│  クイックアクション                  │
│  [チャット] [プロファイル管理]       │
│                                     │
└─────────────────────────────────────┘

#### コード例

**`app/(dashboard)/dashboard/page.tsx`（更新版）**
```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/useChildren';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChildCard } from '@/components/profile/ChildCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { PinDialog } from '@/components/profile/PinDialog';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { children, loading } = useChildren();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  
  if (!user) return null;
  
  const handleChildSelect = (childId: string) => {
    setSelectedChild(childId);
  };
  
  const handlePinVerified = (childId: string) => {
    // PINが正しければチャット画面へ
    router.push(`/chat?childId=${childId}`);
  };
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          こんにちは、{user.displayName || 'まなびーユーザー'}さん！
        </h1>
        <p className="text-gray-600">
          今日も楽しく学習しましょう 🐝
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="使用状況"
          value="0 / ∞"
          description="今期のトークン使用量"
          icon="📊"
        />
        <StatsCard
          title="現在のプラン"
          value={getPlanName(user.plan)}
          description="アップグレードで更に便利に"
          icon="⭐"
        />
        <StatsCard
          title="子どもプロファイル"
          value={`${children.length}人`}
          description={`最大${getMaxChildren(user.plan)}人まで`}
          icon="👨‍👩‍👧‍👦"
        />
      </div>
      
      {/* Children Profiles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            子どもプロファイル
          </h2>
          {children.length < getMaxChildren(user.plan) && (
            <Link href="/children/new">
              <Button variant="outline">
                ➕ プロファイルを追加
              </Button>
            </Link>
          )}
        </div>
        
        {loading ? (
          <p className="text-gray-600">読み込み中...</p>
        ) : children.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              まだ子どもプロファイルがありません
            </p>
            <Link href="/children/new">
              <Button>
                最初のプロファイルを作成
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onSelect={() => handleChildSelect(child.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          クイックアクション
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/children">
            <Button variant="outline" className="w-full h-20 text-lg">
              👨‍👩‍👧‍👦 プロファイル管理
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full h-20 text-lg">
              ⚙️ アカウント設定
            </Button>
          </Link>
        </div>
      </div>
      
      {/* PIN Dialog */}
      {selectedChild && (
        <PinDialog
          childId={selectedChild}
          onVerified={handlePinVerified}
          onClose={() => setSelectedChild(null)}
        />
      )}
    </div>
  );
}

function getPlanName(plan: string): string {
  switch (plan) {
    case 'free': return '無料プラン';
    case 'kids': return 'まなびーキッズ';
    case 'friends': return 'まなびーフレンズ';
    case 'premium': return 'まなびープレミアム';
    default: return '無料プラン';
  }
}

function getMaxChildren(plan: string): number {
  switch (plan) {
    case 'free': return 1;
    case 'kids': return 1;
    case 'friends': return 3;
    case 'premium': return 5;
    default: return 1;
  }
}

2. 子どもプロファイル一覧 (/children)
UI要件
┌─────────────────────────────────────┐
│  子どもプロファイル管理              │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🐻 たろう        [編集] [削除]│   │
│  │ 9歳・小学3年生               │   │
│  │ 最終利用: 2時間前            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🐰 はなこ        [編集] [削除]│   │
│  │ 7歳・小学1年生               │   │
│  │ 最終利用: 昨日               │   │
│  └─────────────────────────────┘   │
│                                     │
│  [➕ 新しいプロファイルを追加]     │
│                                     │
└─────────────────────────────────────┘
コード例
app/(dashboard)/children/page.tsx
tsx'use client';

import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/useChildren';
import { ChildCard } from '@/components/profile/ChildCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ChildrenPage() {
  const { user } = useAuth();
  const { children, loading, deleteChild } = useChildren();
  
  if (!user) return null;
  
  const maxChildren = getMaxChildren(user.plan);
  const canAddMore = children.length < maxChildren;
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            子どもプロファイル管理
          </h1>
          <p className="text-gray-600 mt-1">
            {children.length} / {maxChildren}人
          </p>
        </div>
        
        {canAddMore && (
          <Link href="/children/new">
            <Button>
              ➕ 新規作成
            </Button>
          </Link>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      ) : children.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            プロファイルがありません
          </h2>
          <p className="text-gray-600 mb-6">
            お子様のプロファイルを作成して、<br />
            AIとの学習を始めましょう
          </p>
          <Link href="/children/new">
            <Button>
              最初のプロファイルを作成
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {children.map((child) => (
            <div key={child.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{getAvatarEmoji(child.avatar)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {child.nickname}
                    </h3>
                    <p className="text-gray-600">
                      {getAgeDisplay(child.birthMonth)} · {getAgeGroupLabel(child.ageGroup)}
                    </p>
                    <p className="text-sm text-gray-500">
                      最終利用: {getLastActiveDisplay(child.lastActive)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/children/${child.id}`}>
                    <Button variant="outline" size="sm">
                      編集
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(child.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!canAddMore && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            💡 プラン上限に達しています。<br />
            より多くのプロファイルを作成するには、
            <Link href="/pricing" className="underline font-medium">
              プランをアップグレード
            </Link>
            してください。
          </p>
        </div>
      )}
    </div>
  );
}

// ヘルパー関数は省略（実装時に追加）

3. 子どもプロファイル作成 (/children/new)
UI要件
┌─────────────────────────────────────┐
│  新しいプロファイルを作成            │
├─────────────────────────────────────┤
│                                     │
│  ニックネーム                        │
│  [たろう                          ] │
│                                     │
│  生まれた月                          │
│  [2016年4月 ▼]                     │
│                                     │
│  アバターを選んでね                  │
│  [🐻] [🐰] [🐱] [🐶]              │
│  [🐼] [🦁] [🐧] [🦊]              │
│                                     │
│  PIN（4桁の数字）                   │
│  [1] [2] [3] [4]                   │
│                                     │
│  PINの確認                          │
│  [1] [2] [3] [4]                   │
│                                     │
│  [キャンセル]        [作成する]     │
│                                     │
└─────────────────────────────────────┘
コード例
components/profile/ChildForm.tsx
tsx'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { AvatarSelector } from '@/components/profile/AvatarSelector';
import { useChildren } from '@/hooks/useChildren';
import type { AvatarType } from '@/types';

const childSchema = z.object({
  nickname: z.string()
    .min(1, 'ニックネームを入力してください')
    .max(20, 'ニックネームは20文字以内です'),
  birthMonth: z.string().regex(/^\d{4}-\d{2}$/, '生まれた月を選択してください'),
  avatar: z.string(),
  pin: z.string().regex(/^\d{4}$/, 'PINは4桁の数字で入力してください'),
  pinConfirm: z.string(),
}).refine((data) => data.pin === data.pinConfirm, {
  message: 'PINが一致しません',
  path: ['pinConfirm'],
});

type ChildFormData = z.infer<typeof childSchema>;

interface ChildFormProps {
  initialData?: Partial<ChildFormData>;
  onSubmit: (data: ChildFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function ChildForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = '作成する'
}: ChildFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>(
    (initialData?.avatar as AvatarType) || 'bear'
  );
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ChildFormData>({
    resolver: zodResolver(childSchema),
    defaultValues: initialData,
  });
  
  const handleFormSubmit = async (data: ChildFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAvatarChange = (avatar: AvatarType) => {
    setSelectedAvatar(avatar);
    setValue('avatar', avatar);
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}
      
      {/* ニックネーム */}
      <Input
        {...register('nickname')}
        label="ニックネーム"
        placeholder="たろう"
        error={errors.nickname?.message}
        disabled={isLoading}
      />
      
      {/* 生まれた月 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          生まれた月
        </label>
        <input
          {...register('birthMonth')}
          type="month"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-yellow"
          disabled={isLoading}
        />
        {errors.birthMonth && (
          <p className="mt-1 text-sm text-error-red">
            {errors.birthMonth.message}
          </p>
        )}
      </div>
      
      {/* アバター選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          アバターを選んでね
        </label>
        <AvatarSelector
          selected={selectedAvatar}
          onChange={handleAvatarChange}
        />
        <input
          type="hidden"
          {...register('avatar')}
          value={selectedAvatar}
        />
      </div>
      
      {/* PIN */}
      <Input
        {...register('pin')}
        type="password"
        inputMode="numeric"
        maxLength={4}
        label="PIN（4桁の数字）"
        placeholder="1234"
        error={errors.pin?.message}
        disabled={isLoading}
        hint="チャット開始時に使用します"
      />
      
      {/* PIN確認 */}
      <Input
        {...register('pinConfirm')}
        type="password"
        inputMode="numeric"
        maxLength={4}
        label="PINの確認"
        placeholder="1234"
        error={errors.pinConfirm?.message}
        disabled={isLoading}
      />
      
      {/* ボタン */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? '処理中...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
components/profile/AvatarSelector.tsx
tsximport type { AvatarType } from '@/types';

const AVATARS: { type: AvatarType; emoji: string; label: string }[] = [
  { type: 'bear', emoji: '🐻', label: 'くま' },
  { type: 'rabbit', emoji: '🐰', label: 'うさぎ' },
  { type: 'cat', emoji: '🐱', label: 'ねこ' },
  { type: 'dog', emoji: '🐶', label: 'いぬ' },
  { type: 'panda', emoji: '🐼', label: 'パンダ' },
  { type: 'lion', emoji: '🦁', label: 'ライオン' },
  { type: 'penguin', emoji: '🐧', label: 'ペンギン' },
  { type: 'fox', emoji: '🦊', label: 'きつね' },
];

interface AvatarSelectorProps {
  selected: AvatarType;
  onChange: (avatar: AvatarType) => void;
}

export function AvatarSelector({ selected, onChange }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {AVATARS.map((avatar) => (
        <button
          key={avatar.type}
          type="button"
          onClick={() => onChange(avatar.type)}
          className={`
            p-4 rounded-lg border-2 transition-all
            hover:scale-105 active:scale-95
            ${selected === avatar.type
              ? 'border-honey-yellow bg-honey-yellow bg-opacity-10'
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className="text-4xl mb-1">{avatar.emoji}</div>
          <div className="text-xs text-gray-600">{avatar.label}</div>
        </button>
      ))}
    </div>
  );
}

4. PIN認証ダイアログ
components/profile/PinDialog.tsx
tsx'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useChildren } from '@/hooks/useChildren';

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
        document.getElementById('pin-0')?.focus();
      }
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Modal onClose={onClose}>
      <div className="p-6 space-y-6">
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
          <Alert variant="error">
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
              className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-yellow focus:border-transparent"
              disabled={isLoading}
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
            className="flex-1"
          >
            {isLoading ? '確認中...' : 'ログイン'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function getAvatarEmoji(avatar: string): string {
  const emojiMap: Record<string, string> = {
    bear: '🐻',
    rabbit: '🐰',
    cat: '🐱',
    dog: '🐶',
    panda: '🐼',
    lion: '🦁',
    penguin: '🐧',
    fox: '🦊',
  };
  return emojiMap[avatar] || '🐻';
}

🔧 Firebase CRUD操作
lib/firebase/children.ts
typescriptimport {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import bcrypt from 'bcryptjs';
import type { Child, AvatarType } from '@/types';

/**
 * 子どもプロファイル作成
 */
export async function createChild(
  parentId: string,
  data: {
    nickname: string;
    birthMonth: string;
    avatar: AvatarType;
    pin: string;
  }
): Promise<Child> {
  // PINをハッシュ化
  const hashedPin = await bcrypt.hash(data.pin, 10);
  
  // 年齢グループを計算
  const ageGroup = calculateAgeGroup(data.birthMonth);
  
  const childData: Omit<Child, 'id'> = {
    parentId,
    nickname: data.nickname,
    birthMonth: data.birthMonth,
    avatar: data.avatar,
    pin: hashedPin,
    ageGroup,
    createdAt: serverTimestamp() as any,
    lastActive: serverTimestamp() as any,
    isActive: true,
  };
  
  const docRef = doc(collection(db, 'children'));
  await setDoc(docRef, childData);
  
  return {
    id: docRef.id,
    ...childData,
  } as Child;
}

/**
 * 子どもプロファイル一覧取得
 */
export async function getChildren(parentId: string): Promise<Child[]> {
  const q = query(
    collection(db, 'children'),
    where('parentId', '==', parentId),
    where('isActive', '==', true)
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Child[];
}

/**
 * 子どもプロファイル取得
 */
export async function getChild(childId: string): Promise<Child | null> {
  const docRef = doc(db, 'children', childId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Child;
}

/**
 * 子どもプロファイル更新
 */
export async function updateChild(
  childId: string,
  data: Partial<{
    nickname: string;
    birthMonth: string;
    avatar: AvatarType;
    pin: string;
  }>
): Promise<void> {
  const updateData: any = { ...data };
  
  // PINが含まれている場合はハッシュ化
  if (data.pin) {
    updateData.pin = await bcrypt.hash(data.pin, 10);
  }
  
  // 生年月が変更された場合は年齢グループを再計算
  if (data.birthMonth) {
    updateData.ageGroup = calculateAgeGroup(data.birthMonth);
  }
  
  const docRef = doc(db, 'children', childId);
  await updateDoc(docRef, updateData);
}

/**
 * 子どもプロファイル削除（論理削除）
 */
export async function deleteChild(childId: string): Promise<void> {
  const docRef = doc(db, 'children', childId);
  await updateDoc(docRef, {
    isActive: false,
  });
}

/**
 * PIN検証
 */
export async function verifyChildPin(
  childId: string,
  pin: string
): Promise<boolean> {
  const child = await getChild(childId);
  
  if (!child) {
    return false;
  }
  
  return await bcrypt.compare(pin, child.pin);
}

/**
 * 最終アクティブ時刻更新
 */
export async function updateLastActive(childId: string): Promise<void> {
  const docRef = doc(db, 'children', childId);
  await updateDoc(docRef, {
    lastActive: serverTimestamp(),
  });
}

/**
 * 年齢グループ計算
 */
function calculateAgeGroup(birthMonth: string): 'junior' | 'middle' | 'senior' {
  const [year, month] = birthMonth.split('-').map(Number);
  const birthDate = new Date(year, month - 1);
  const now = new Date();
  
  const age = now.getFullYear() - birthDate.getFullYear();
  
  if (age <= 9) return 'junior';      // 小学3年生まで
  if (age <= 15) return 'middle';     // 小学4年〜中学生
  return 'senior';                    // 高校生
}

🗄️ 状態管理
stores/profileStore.ts
typescriptimport { create } from 'zustand';
import {
  createChild,
  getChildren,
  getChild,
  updateChild,
  deleteChild,
  verifyChildPin,
  updateLastActive,
} from '@/lib/firebase/children';
import type { Child, AvatarType } from '@/types';

interface ChildFormData {
  nickname: string;
  birthMonth: string;
  avatar: AvatarType;
  pin: string;
}

interface ProfileState {
  children: Child[];
  currentChild: Child | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchChildren: (parentId: string) => Promise<void>;
  addChild: (parentId: string, data: ChildFormData) => Promise<void>;
  editChild: (childId: string, data: Partial<ChildFormData>) => Promise<void>;
  removeChild: (childId: string) => Promise<void>;
  verifyPin: (childId: string, pin: string) => Promise<boolean>;
  setCurrentChild: (childId: string) => Promise<void>;
  clearCurrentChild: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  children: [],
  currentChild: null,
  loading: false,
  error: null,
  
  fetchChildren: async (parentId) => {
    try {
      set({ loading: true, error: null });
      const children = await getChildren(parentId);
      set({ children, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  addChild: async (parentId, data) => {
    try {
      set({ loading: true, error: null });
      const child = await createChild(parentId, data);
      set((state) => ({
        children: [...state.children, child],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  editChild: async (childId, data) => {
    try {
      set({ loading: true, error: null });
      await updateChild(childId, data);
      
      // ローカル状態を更新
      const updatedChild = await getChild(childId);
      if (updatedChild) {
        set((state) => ({
          children: state.children.map((c) =>
            c.id === childId ? updatedChild : c
          ),
          loading: false,
        }));
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  removeChild: async (childId) => {
    try {
      set({ loading: true, error: null });
      await deleteChild(childId);
      set((state) => ({
        children: state.children.filter((c) => c.id !== childId),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  verifyPin: async (childId, pin) => {
    try {
      const isValid = await verifyChildPin(childId, pin);
      return isValid;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },
  
  setCurrentChild: async (childId) => {
    const child = await getChild(childId);
    if (child) {
      await updateLastActive(childId);
      set({ currentChild: child });
    }
  },
  
  clearCurrentChild: () => {
    set({ currentChild: null });
  },
}));
hooks/useChildren.ts
typescript'use client';

import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfileStore } from '@/stores/profileStore';

export function useChildren() {
  const { user } = useAuth();
  const store = useProfileStore();
  
  useEffect(() => {
    if (user) {
      store.fetchChildren(user.id);
    }
  }, [user]);
  
  return store;
}

🧪 テスト
手動テストチェックリスト
子どもプロファイル作成

 プロファイルを作成できる
 ニックネームが必須
 生まれた月を選択できる
 8種類のアバターから選択できる
 PINは4桁の数字のみ
 PIN確認が一致しないとエラー
 Firestoreにドキュメントが作成される
 PINがハッシュ化されて保存される

子どもプロファイル編集

 プロファイル情報を編集できる
 PINを変更できる
 編集内容が保存される

子どもプロファイル削除

 削除確認ダイアログが表示される
 削除後、一覧から消える
 論理削除される（isActive = false）

PIN認証

 PINダイアログが表示される
 正しいPINでログインできる
 間違ったPINでエラーが表示される
 ログイン後、チャット画面に遷移

プラン制限

 無料プランは1人まで
 まなびーキッズは1人まで
 まなびーフレンズは3人まで
 まなびープレミアムは5人まで
 上限に達すると追加ボタンが非表示


📝 Claude CODEへの指示
実装手順
Day 15: ダッシュボード強化

StatsCard追加（子ども数表示）
ChildCard コンポーネント作成
ダッシュボードにプロファイル一覧表示

Day 16-17: プロフィール・設定画面

/profile ページ作成
/settings ページ作成

Day 18: プロファイル一覧

/children ページ作成
ChildList コンポーネント作成

Day 19: プロファイル追加

/children/new ページ作成
ChildForm コンポーネント作成
AvatarSelector コンポーネント作成
Firebase CRUD実装

Day 20: 編集・削除

/children/[id] ページ作成
削除確認ダイアログ

Day 21: PIN認証

PinDialog コンポーネント作成
PIN検証実装
チャット画面との連携


🎯 完了基準

 子どもプロファイルのCRUDが動作
 PIN認証が機能
 プラン別の人数制限が機能
 すべての手動テストが成功
 PROGRESS.md更新


最終更新: 2025-10-07
次のフェーズ: PHASE2-3_PAYMENT.md