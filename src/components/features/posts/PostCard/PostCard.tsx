'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import Button from '@/components/ui/Button/Button';
import ConfirmModal from '@/components/ui/ConfirmModal/ConfirmModal';
import { useTimeline } from '@/contexts/TimelineContext';
import { deletePost, followUser, likePost, unfollowUser, unlikePost } from '@/lib/actions';
import { type PostWithProfile } from '@/types';

import styles from './PostCard.module.scss';

type PostCardProps = {
  post: PostWithProfile;
};

/**
 * 個別の投稿を表示するカードコンポーネント
 * 投稿者本人のみ削除ボタンを表示
 */
const PostCard = ({ post }: PostCardProps) => {
  // Contextからデータを取得
  const { userId, likedPostIds, followingUserIds } = useTimeline();

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

  // 現在の投稿の投稿者が、ログインユーザーのフォローリストに含まれているかを判定
  const isFollowing = post.user_id ? followingUserIds.has(post.user_id) : false;

  const handleFollow = async () => {
    if (!post.user_id) return;
    try {
      if (isFollowing) {
        await unfollowUser(post.user_id);
      } else {
        await followUser(post.user_id);
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
        <header className={styles.header}>
          <span className={styles.userName}>{post.profiles?.user_name ?? '名無しさん'}</span>
          {/* 投稿者本人以外のみフォローボタンを表示 */}
          {!isOwnPost && (
            <Button
              type="button"
              variant={isFollowing ? 'primary' : 'secondary'}
              size="small"
              onClick={handleFollow}
            >
              {isFollowing ? 'フォロー中' : 'フォローする'}
            </Button>
          )}
        </header>

        <main>
          <p className={styles.content}>{post.content}</p>
        </main>

        <footer>
          <div className={styles.actions}>
            <div className={styles.likeSection}>
              <button className={styles.likeButton} type="button" onClick={handleLike}>
                {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
              </button>
              <span>{likeCount}</span>
            </div>
            {/* 投稿者本人のみ削除ボタンを表示 */}
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
          <time dateTime={post.created_at} className={styles.time}>
            {new Date(post.created_at).toLocaleString()}
          </time>
        </footer>
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
