'use client';

import { useTimeline } from '@/contexts/TimelineContext';
import { type PostWithProfile } from '@/types';

import { DeletePostButton } from './DeletePostButton/DeletePostButton';
import { FollowButton } from './FollowButton/FollowButton';
import { LikeButton } from './LikeButton/LikeButton';
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
  const { userId } = useTimeline();

  // 現在のユーザーが投稿者かどうかを判定
  const isOwnPost = userId && userId === post.user_id;

  return (
    <li>
      <article className={styles.card}>
        <header className={styles.header}>
          <span className={styles.userName}>{post.profiles?.user_name ?? '名無しさん'}</span>
          {/* 投稿者本人以外のみフォローボタンを表示 */}
          {!isOwnPost && <FollowButton targetUserId={post.user_id} />}
        </header>

        <main>
          <p className={styles.content}>{post.content}</p>
        </main>

        <footer>
          <div className={styles.actions}>
            <LikeButton post={post} />
            {/* 投稿者本人のみ削除ボタンを表示 */}
            {isOwnPost && <DeletePostButton postId={post.id} />}
          </div>
          <time dateTime={post.created_at} className={styles.time}>
            {new Date(post.created_at).toLocaleString()}
          </time>
        </footer>
      </article>
    </li>
  );
};

export default PostCard;
