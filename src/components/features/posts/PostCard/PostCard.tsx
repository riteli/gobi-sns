'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import Button from '@/components/ui/Button/Button';
import ConfirmModal from '@/components/ui/ConfirmModal/ConfirmModal';
import { deletePost, likePost, unlikePost } from '@/lib/actions';
import { type PostWithProfile } from '@/types';

import styles from './PostCard.module.scss';

type PostCardProps = {
  post: PostWithProfile;
  userId: string | null;
  likedPostIds: Set<number>;
};

/**
 * 個別の投稿を表示するカードコンポーネント
 * 投稿者本人のみ削除ボタンを表示
 */
const PostCard = ({ post, userId, likedPostIds }: PostCardProps) => {
  // 現在のユーザーが投稿者かどうかを判定
  const isOwnPost = userId && userId === post.user_id;

  // モーダルの開閉状態の判定
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error('エラーが発生しました。時間をおいて再度お試しください。');
      }
    }
  };

  // 投稿の削除処理
  const handleDeleteConfirm = async () => {
    await deletePost(post.id);
    setIsModalOpen(false);
  };

  return (
    <li>
      <article className={styles.card}>
        <div className={styles.header}>
          <span className={styles.userName}>{post.profiles?.user_name ?? '名無しさん'}</span>
          <time dateTime={post.created_at} className={styles.time}>
            {new Date(post.created_at).toLocaleString()}
          </time>
        </div>
        <p className={styles.content}>{post.content}</p>
        {/* 投稿者本人のみ削除ボタンを表示 */}

        <div className={styles.actions}>
          <div className={styles.likeSection}>
            <button className={styles.likeButton} type="button" onClick={handleLike}>
              {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
            </button>
            <span>{likeCount}</span>
          </div>
          {isOwnPost && (
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              削除
            </Button>
          )}
        </div>
      </article>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onConfirm={handleDeleteConfirm}
        title="投稿を削除"
      >
        <p>この操作は取り消せません。本当にこの投稿を削除しますか？</p>
      </ConfirmModal>
    </li>
  );
};

export default PostCard;
