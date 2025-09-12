import { SearchResultClient } from '@/components/features/search/SearchResultClient/SearchResultClient';
import { searchPosts } from '@/lib/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTimelineContextValue } from '@/lib/utils';

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const PAGE_SIZE = 10;
  const query = searchParams.q

  // 検索結果とContextの値を並行して取得
  const [searchResultPosts, timelineContextValue] = await Promise.all([
    searchPosts(query, 0, PAGE_SIZE),
    getTimelineContextValue(supabase, user),
  ]);

  return (
    <>
      <h2 className={styles.title}>「{searchParams.q}」の検索結果</h2>
      {/* 実際の描画はクライアントコンポーネントに委任 */}
      <SearchResultClient query={query} initialPosts={searchResultPosts} timelineContextValue={timelineContextValue} />
    </>
  );
};

export default SearchPage;
