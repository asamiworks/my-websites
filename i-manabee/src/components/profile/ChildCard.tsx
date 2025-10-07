import { Button } from '@/components/ui/button';
import { getAvatarEmoji } from '@/lib/firebase/children';
import type { Child } from '@/types/children';

interface ChildCardProps {
  child: Child;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function ChildCard({
  child,
  onSelect,
  onEdit,
  onDelete,
  showActions = false
}: ChildCardProps) {
  const getAgeDisplay = (birthMonth: string) => {
    const [year, month] = birthMonth.split('-').map(Number);
    const now = new Date();
    const age = now.getFullYear() - year;
    return `${age}歳`;
  };

  const getAgeGroupLabel = (ageGroup: string) => {
    switch (ageGroup) {
      case 'junior': return '小学生（低学年）';
      case 'middle': return '小学生（高学年）・中学生';
      case 'senior': return '高校生';
      default: return '';
    }
  };

  const getLastActiveDisplay = (lastActive: any) => {
    if (!lastActive) return '未使用';

    const now = new Date();
    const lastActiveDate = lastActive.toDate ? lastActive.toDate() : new Date(lastActive);
    const diff = now.getTime() - lastActiveDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'たった今';
    if (hours < 24) return `${hours}時間前`;
    if (days === 1) return '昨日';
    if (days < 7) return `${days}日前`;
    return '1週間以上前';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {showActions ? (
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
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                編集
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={onDelete}>
                削除
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="text-center cursor-pointer"
          onClick={onSelect}
        >
          <div className="text-6xl mb-4">{getAvatarEmoji(child.avatar)}</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {child.nickname}
          </h3>
          <p className="text-gray-600 text-sm">
            {getAgeDisplay(child.birthMonth)}
          </p>
        </div>
      )}
    </div>
  );
}