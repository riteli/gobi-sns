import PostForm from '@/features/posts/components/PostForm/PostForm';
import { InfiniteScrollTimeline } from '@/components/features/timeline/InfiniteScrollTimeline';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTimelineContextValue } from '@/lib/utils';

import styles from './page.module.scss';

/**
 * メインページ（ホーム・タイムライン）
 * 投稿フォームと投稿一覧を表示
 */
const HomePage = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const PAGE_SIZE = 10;

  // 投稿データとContextの値を並行して取得
  const [{ data: posts }, timelineContextValue] = await Promise.all([
    supabase
      .from('posts')
      .select('*, profiles(user_name, avatar_url), likes(count)')
      .order('created_at', { ascending: false })
      .range(0, PAGE_SIZE - 1),
    getTimelineContextValue(supabase, user),
  ]);

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.title}>タイムライン</h2>
        <PostForm />
      </header>
      <InfiniteScrollTimeline initialPosts={posts} timelineContextValue={timelineContextValue} />
    </>
  );
};
export default HomePage;
