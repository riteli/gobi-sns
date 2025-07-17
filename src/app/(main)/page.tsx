import PostForm from '@/components/features/posts/PostForm/PostForm';
import PostList from '@/components/features/posts/PostList/PostList';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * メインページ（ホーム・タイムライン）
 * 投稿フォームと投稿一覧を表示
 */
const HomePage = async () => {
  const supabase = await createSupabaseServerClient();

  // 投稿データをプロフィール情報と一緒に取得（新しい順）
  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(user_name)')
    .order('created_at', { ascending: false });

  return (
    <>
      <h2>タイムライン</h2>
      <PostForm />
      <PostList posts={posts} />
    </>
  );
};

export default HomePage;
