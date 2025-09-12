'use client';

import PostList from '@/components/features/posts/PostList/PostList';
import { TimelineContext, type TimelineContextType } from '@/contexts/TimelineContext';
import { type PostWithProfile } from '@/types';

// HomePageから受け取る全てのpropsの型を定義
type TimelineProps = {
  posts: PostWithProfile[] | null;
  timelineContextValue: TimelineContextType;
};

export const Timeline = ({ posts, timelineContextValue }: TimelineProps) => {
  return (
    <>

      <TimelineContext value={timelineContextValue}>
        <PostList posts={posts} />
      </TimelineContext>
    </>
  );
};
