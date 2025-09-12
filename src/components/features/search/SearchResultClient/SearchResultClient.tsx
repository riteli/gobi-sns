'use client';

import { useCallback } from 'react';

import PostList from '@/components/features/posts/PostList/PostList';
import { TimelineContext, type TimelineContextType } from '@/contexts/TimelineContext';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { searchPosts } from '@/lib/actions';
import { type PostWithProfile } from '@/types';

type SearchResultClientProps = {
  query: string;
  initialPosts: PostWithProfile[] | null;
  timelineContextValue: TimelineContextType;
};

/**
 * 検索結果の投稿一覧と、それらが依存するContextを提供するクライアントコンポーネント
 */
export const SearchResultClient = ({
  query,
  initialPosts,
  timelineContextValue,
}: SearchResultClientProps) => {
  const fetcher = useCallback(
    (page: number, pageSize: number) => {
      return searchPosts(query, page, pageSize);
    },
    [query],
  );

  const { posts, isLoading, ref } = useInfiniteScroll(initialPosts, fetcher);

  return (
    <TimelineContext.Provider value={timelineContextValue}>
      <PostList posts={posts} />

      <div ref={ref} />
      {isLoading && <p style={{ textAlign: 'center' }}>読み込み中...</p>}
    </TimelineContext.Provider>
  );
};
