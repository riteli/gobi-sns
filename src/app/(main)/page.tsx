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
    .select('*, profiles(user_name)')
    .order('created_at', { ascending: false });

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.title}>タイムライン</h2>
        <PostForm />
      </header>

      <PostList posts={posts} userId={user?.id ?? null} />
    </>
  );
};

export default HomePage;
