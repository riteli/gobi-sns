import PostForm from '@/components/features/posts/PostForm/PostForm';
import PostList from '@/components/features/posts/PostList/PostList';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import styles from './page.module.scss';

/**
 * メインページ（ホーム・タイムライン）
 * 投稿フォームと投稿一覧を表示
 */
const HomePage = async () => {
  const supabase = await createSupabaseServerClient();

  // ログインユーザーの情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 投稿データをプロフィール情報と一緒に取得（新しい順）
  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(user_name), likes(count)')
    .order('created_at', { ascending: false });

  // ログインユーザーがいいねした投稿IDを格納するSet
  let likedPostIds = new Set<number>();

  // ログインしている場合のみ、いいねリストを取得
  if (user) {
    const { data: likedPosts } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', user.id);

    if (likedPosts) {
      likedPostIds = new Set(
        likedPosts
          .filter((like): like is { post_id: number } => like.post_id !== null)
          .map((like) => like.post_id),
      );
    }
  }

  // ログインユーザーがフォローしたユーザーIDを格納するSet
  let followingUserIds = new Set<string>();

  // ログインしている場合のみ、フォローリストを取得
  if (user) {
    const { data: followingUsers } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

    if (followingUsers) {
      followingUserIds = new Set(
        followingUsers
          .filter(
            (following): following is { following_id: string } => following.following_id !== null,
          )
          .map((following) => following.following_id),
      );
    }
  }

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.title}>タイムライン</h2>
        <PostForm />
      </header>

      <PostList
        posts={posts}
        userId={user?.id ?? null}
        likedPostIds={likedPostIds}
        followingUserIds={followingUserIds}
      />
    </>
  );
};
export default HomePage;
