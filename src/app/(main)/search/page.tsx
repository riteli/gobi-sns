import { SearchResultClient } from '@/components/features/search/SearchResultClient/SearchResultClient';
import { searchPosts } from '@/lib/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import styles from './page.module.scss';

type SearchPageProps = {
  searchParams: { q: string };
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const searchResultPosts = await searchPosts(searchParams.q);
  const supabase = await createSupabaseServerClient();

  // ログインユーザーの情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const timelineContextValue = {
    userId: user?.id ?? null,
    likedPostIds,
    followingUserIds,
  };

  return (
    <>
      <h2 className={styles.title}>{searchParams.q}の検索結果</h2>
      <SearchResultClient posts={searchResultPosts} timelineContextValue={timelineContextValue} />
    </>
  );
};

export default SearchPage;
