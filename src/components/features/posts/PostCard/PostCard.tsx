'use client';

import { useEffect, useState } from 'react';

import { type PostWithProfile } from '@/types';

type PostCardProps = {
  post: PostWithProfile;
};

/**
 * 個別の投稿を表示するカードコンポーネント
 * ハイドレーションエラーを防ぐためクライアントサイドでのみ日時を表示
 */
const PostCard = ({ post }: PostCardProps) => {
  const [isClient, setIsClient] = useState(false);

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
    </li>
  );
};

export default PostCard;
