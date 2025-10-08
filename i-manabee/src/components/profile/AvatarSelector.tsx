import type { AvatarType } from '@/types';

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
  selectedAvatar: AvatarType;
  onAvatarSelect: (avatar: AvatarType) => void;
  disabled?: boolean;
}

export function AvatarSelector({ selectedAvatar, onAvatarSelect, disabled }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {AVATARS.map((avatar) => (
        <button
          key={avatar.type}
          type="button"
          onClick={() => onAvatarSelect(avatar.type)}
          disabled={disabled}
          className={`
            p-4 rounded-lg border-2 transition-all
            hover:scale-105 active:scale-95
            ${selectedAvatar === avatar.type
              ? 'border-yellow-400 bg-yellow-50'
              : 'border-gray-200 hover:border-gray-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="text-4xl mb-1">{avatar.emoji}</div>
          <div className="text-xs text-gray-600">{avatar.label}</div>
        </button>
      ))}
    </div>
  );
}