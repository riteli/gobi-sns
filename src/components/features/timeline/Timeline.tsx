'use client';

import styles from '@/app/(main)/page.module.scss';
import PostForm from '@/components/features/posts/PostForm/PostForm';
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
      <header className={styles.header}>
        <h2 className={styles.title}>タイムライン</h2>
        <PostForm />
      </header>
      <TimelineContext value={timelineContextValue}>
        <PostList posts={posts} />
      </TimelineContext>
    </>
  );
};
