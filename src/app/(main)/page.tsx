import { fetchFollowingPosts, fetchPosts } from '@/features/posts/actions';
import { HomePageClient } from '@/features/posts/components/HomePageClient/HomePageClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTimelineContextValue } from '@/lib/utils';

/**
 * メインページ（ホーム・タイムライン）
 * 全ユーザーの投稿とフォロー中のユーザーの投稿を取得し、クライアントコンポーネントに渡す
 */
const HomePage = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const PAGE_SIZE = 10;

  // 投稿データとContextの値を並行して取得
  const [followingPosts, allPosts, timelineContextValue] = await Promise.all([
    fetchFollowingPosts(0, PAGE_SIZE),
    fetchPosts(0, PAGE_SIZE),
    getTimelineContextValue(supabase, user),
  ]);

  return (
    <HomePageClient
      followingPosts={followingPosts}
      allPosts={allPosts}
      timelineContextValue={timelineContextValue}
    />
  );
};
export default HomePage;
