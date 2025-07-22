'use client';

import { useEffect, useState } from 'react';

import { deletePost } from '@/lib/actions';
import { type PostWithProfile } from '@/types';

type PostCardProps = {
  post: PostWithProfile;
  userId: string | null;
};

/**
 * 個別の投稿を表示するカードコンポーネント
 * ハイドレーションエラーを防ぐためクライアントサイドでのみ日時を表示
 */
const PostCard = ({ post, userId }: PostCardProps) => {
  const [isClient, setIsClient] = useState(false);

  const isOwnPost = userId && userId === post.user_id;

  // クライアントサイドでのマウント後にフラグを立てる
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <li>
      <p>
        <strong>{post.profiles?.user_name ?? '名無しさん'}</strong>
      </p>
      <p>{post.content}</p>
      {/* サーバーとクライアントの日時表示差異を防ぐため条件分岐 */}
      {isClient && (
        <p>
          <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleString()}</time>
        </p>
      )}
      {isOwnPost && (
        <form action={deletePost.bind(null, post.id)}>
          <button type="submit">削除</button>
        </form>
      )}
    </li>
  );
};

export default PostCard;
