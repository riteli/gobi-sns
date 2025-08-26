import PostCard from '@/components/features/posts/PostCard/PostCard';
import { type PostWithProfile } from '@/types';

import styles from './PostList.module.scss';

type PostListProps = {
  posts: PostWithProfile[] | null;
};

/**
 * 投稿一覧を表示するコンポーネント
 * 投稿がない場合は適切なメッセージを表示
 */
const PostList = ({ posts }: PostListProps) => {
  // 投稿データがない場合の表示
  if (!posts || posts.length === 0) {
    return <p>まだ投稿がありません</p>;
  }

  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ul>
  );
};

export default PostList;
