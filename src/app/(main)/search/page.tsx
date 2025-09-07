import { SearchResultClient } from '@/components/features/search/SearchResultClient/SearchResultClient';
import { searchPosts } from '@/lib/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import styles from './page.module.scss';

type SearchPageProps = {
  searchParams: { q: string };
};

/**
 * 検索結果表示ページ（サーバーコンポーネント）
 * URLのクエリパラメータから検索キーワードを受け取り、結果を表示する
 * データ取得とContextの値の作成に専念し、描画はクライアントコンポーネントに委任する
 */
const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const supabase = await createSupabaseServerClient();

  // 検索結果とログインユーザー情報を並行して取得し、パフォーマンスを向上
  const [
    searchResultPosts,
    {
      data: { user },
    },
  ] = await Promise.all([searchPosts(searchParams.q), supabase.auth.getUser()]);

  // ログインユーザーのいいね・フォロー情報を取得（ユーザーがいる場合のみ実行）
  let likedPostIds = new Set<number>();
  let followingUserIds = new Set<string>();

  if (user) {
    const [{ data: likedPosts }, { data: followingUsers }] = await Promise.all([
      supabase.from('likes').select('post_id').eq('user_id', user.id),
      supabase.from('follows').select('following_id').eq('follower_id', user.id),
    ]);

    if (likedPosts) {
      likedPostIds = new Set(
        likedPosts
          .filter((like): like is { post_id: number } => like.post_id !== null)
          .map((like) => like.post_id),
      );
    }
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

  // 子コンポーネント（PostCardなど）で必要なContextの値を作成
  const timelineContextValue = {
    userId: user?.id ?? null,
    likedPostIds,
    followingUserIds,
  };

  return (
    <>
      <h2 className={styles.title}>「{searchParams.q}」の検索結果</h2>
      {/* 実際の描画はクライアントコンポーネントに委任 */}
      <SearchResultClient posts={searchResultPosts} timelineContextValue={timelineContextValue} />
    </>
  );
};

export default SearchPage;
