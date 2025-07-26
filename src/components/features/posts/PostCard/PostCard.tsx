'use client';

import Button from '@/components/ui/Button/Button';
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
            <form action={deletePost.bind(null, post.id)}>
              <Button type="submit" variant="secondary" size="small">
                削除
              </Button>
            </form>
          </div>
        )}
      </article>
    </li>
  );
};

export default PostCard;
