'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import { useTimeline } from '@/contexts/TimelineContext';
import { likePost, unlikePost } from '@/features/posts/actions';
import { type PostWithProfile } from '@/types';

import styles from './LikeButton.module.scss';

type LikeButtonProps = {
  post: PostWithProfile;
};

/**
 * 投稿に対するいいね機能を提供するコンポーネント
 * ユーザー体験向上のため、いいねの状態とカウントを即時反映する楽観的更新を実装
 */
export const LikeButton = ({ post }: LikeButtonProps) => {
  const { likedPostIds } = useTimeline();
  const likeCount = post.likes[0]?.count ?? 0;

  // 楽観的更新用のUI状態
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(likedPostIds.has(post.id));
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(likeCount);

  /**
   * いいねボタンクリック時の処理
   * サーバーへのリクエスト前にUIを即時更新し、エラー発生時は元の状態に戻す
   */
  const handleLike = async () => {
    // 1. 現在のUI状態をリクエスト前に保存
    const originalIsLiked = optimisticIsLiked;
    const originalLikeCount = optimisticLikeCount;

    // 2. UIを即座に更新（楽観的更新）
    if (originalIsLiked) {
      setOptimisticIsLiked(false);
      setOptimisticLikeCount((prev) => prev - 1);
    } else {
      setOptimisticIsLiked(true);
      setOptimisticLikeCount((prev) => prev + 1);
    }

    try {
      // 3. サーバーへリクエストを送信
      if (originalIsLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      // 4. エラーが発生した場合、UIを元の状態にロールバック
      setOptimisticIsLiked(originalIsLiked);
      setOptimisticLikeCount(originalLikeCount);

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
        {optimisticIsLiked ? <FaHeart color="red" /> : <FaRegHeart />}
      </button>
      <span>{optimisticLikeCount}</span>
    </div>
  );
};
