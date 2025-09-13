import toast from 'react-hot-toast';

import Button from '@/components/ui/Button/Button';
import { useTimeline } from '@/contexts/TimelineContext';
import { followUser, unfollowUser } from '@/features/follow/actions';

type FollowButtonProps = {
  targetUserId: string | null;
};

export const FollowButton = ({ targetUserId }: FollowButtonProps) => {
  const { followingUserIds } = useTimeline();

  // 現在の投稿の投稿者が、ログインユーザーのフォローリストに含まれているかを判定
  const isFollowing = targetUserId ? followingUserIds.has(targetUserId) : false;

  const handleFollow = async () => {
    if (!targetUserId) return;
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId);
      } else {
        await followUser(targetUserId);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error('エラーが発生しました。時間をおいて再度お試しください。');
      }
    }
  };

  return (
    <Button
      type="button"
      variant={isFollowing ? 'primary' : 'secondary'}
      size="small"
      onClick={handleFollow}
    >
      {isFollowing ? 'フォロー中' : 'フォローする'}
    </Button>
  );
};
