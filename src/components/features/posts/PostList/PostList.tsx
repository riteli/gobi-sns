import PostCard from '@/components/features/posts/PostCard/PostCard';
import { type PostWithProfile } from '@/types';

type PostListProps = {
  posts: PostWithProfile[] | null;
  userId: string | null;
};

/**
 * 投稿一覧を表示するコンポーネント
 * 投稿がない場合は適切なメッセージを表示
 */
const PostList = ({ posts, userId }: PostListProps) => {
  // 投稿データがない場合の表示
  if (!posts || posts.length === 0) {
    return <p>まだ投稿がありません</p>;
  }

  return (
    <ul>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} userId={userId} />
      ))}
    </ul>
  );
};

export default PostList;
