'use client';

import { TimelineContext, type TimelineContextType } from '@/contexts/TimelineContext';
import { useInfiniteScroll } from '@/features/posts/hooks/useInfiniteScroll';
import { type PostWithProfile } from '@/types';

import PostList from '../../../features/posts/components/PostList/PostList';

type InfiniteScrollTimelineProps = {
  initialPosts: PostWithProfile[] | null;
  timelineContextValue: TimelineContextType;
};

/**
 * useInfiniteScrollフックを利用して、無限スクロールが可能なタイムラインを描画するコンポーネント
 */
export const InfiniteScrollTimeline = ({
  initialPosts,
  timelineContextValue,
}: InfiniteScrollTimelineProps) => {
  const { posts, isLoading, ref } = useInfiniteScroll(initialPosts);

  return (
    <TimelineContext.Provider value={timelineContextValue}>
      <PostList posts={posts} />
      {/* 投稿リストの末尾に配置し、画面内に入ると追加の投稿を読み込むトリガーとなる要素 */}
      <div ref={ref} />
      {isLoading && <p style={{ textAlign: 'center' }}>読み込み中...</p>}
    </TimelineContext.Provider>
  );
};
