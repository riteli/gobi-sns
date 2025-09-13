'use client';

import { TimelineContext, type TimelineContextType } from '@/contexts/TimelineContext';
import PostList from '@/features/posts/components/PostList/PostList';
import { type PostWithProfile } from '@/types';

type SearchResultClientProps = {
  posts: PostWithProfile[] | null;
  timelineContextValue: TimelineContextType;
};

/**
 * 検索結果の投稿一覧と、それらが依存するContextを提供するクライアントコンポーネント
 */
export const SearchResultClient = ({ posts, timelineContextValue }: SearchResultClientProps) => {
  return (
    <TimelineContext.Provider value={timelineContextValue}>
      <PostList posts={posts} />
    </TimelineContext.Provider>
  );
};
