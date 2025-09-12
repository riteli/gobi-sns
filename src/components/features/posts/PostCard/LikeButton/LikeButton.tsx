'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import { useTimeline } from '@/contexts/TimelineContext';
import { likePost, unlikePost } from '@/lib/actions';
import { type PostWithProfile } from '@/types';

import styles from './LikeButton.module.scss';

type likeButtonProps = {
  post: PostWithProfile;
};

export const LikeButton = ({ post }: likeButtonProps) => {
  const router = useRouter();
  const { likedPostIds } = useTimeline();

  // いいねの数
  const likeCount = post.likes[0]?.count ?? 0;
  // いいねをした投稿か判定
  const isLiked = likedPostIds.has(post.id);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
      router.refresh();
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
    <div className={styles.likeSection}>
      <button className={styles.likeButton} type="button" onClick={handleLike}>
        {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
      </button>
      <span>{likeCount}</span>
    </div>
  );
};
