'use client';

import { useState } from 'react';

import Button from '@/components/ui/Button/Button';
import ConfirmModal from '@/components/ui/ConfirmModal/ConfirmModal';
import { deletePost } from '@/lib/actions';
import { type PostWithProfile } from '@/types';

import styles from './PostCard.module.scss';

type PostCardProps = {
  post: PostWithProfile;
  userId: string | null;
};

/**
 * 個別の投稿を表示するカードコンポーネント
 * 投稿者本人のみ削除ボタンを表示
 */
const PostCard = ({ post, userId }: PostCardProps) => {
  // 現在のユーザーが投稿者かどうかを判定
  const isOwnPost = userId && userId === post.user_id;

  // モーダルの開閉状態の判定
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        {isOwnPost && (
          <div className={styles.actions}>
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
          </div>
        )}
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
