import { Timeline } from '@/components/features/timeline/Timeline';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTimelineContextValue } from '@/lib/utils';

/**
 * メインページ（ホーム・タイムライン）
 * 投稿フォームと投稿一覧を表示
 */
const HomePage = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 投稿データとContextの値を並行して取得
  const [{ data: posts }, timelineContextValue] = await Promise.all([
    supabase
      .from('posts')
      .select('*, profiles(user_name, avatar_url), likes(count)')
      .order('created_at', { ascending: false }),
    getTimelineContextValue(supabase, user), // 👈 共通関数を呼び出す
  ]);

  return <Timeline posts={posts} timelineContextValue={timelineContextValue} />;
};
export default HomePage;
