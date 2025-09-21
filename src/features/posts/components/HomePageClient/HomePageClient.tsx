'use client'

import { useState } from 'react';

import { TimelineContextType } from '@/contexts/TimelineContext';
import { InfiniteScrollTimeline } from '@/features/posts/components/InfiniteScrollTimeline/InfiniteScrollTimeline';
import PostForm from '@/features/posts/components/PostForm/PostForm';
import { PostWithProfile } from '@/types';

import styles from './HomePageClient.module.scss';

type HomePageClientProps = {
  followingPosts: PostWithProfile[] | null;
  allPosts: PostWithProfile[] | null;
  timelineContextValue: TimelineContextType;
};

/**
 * ホームページのUIと状態管理を担当するクライアントコンポーネント
 * 「フォロー中」と「全ユーザー」のタブ切り替え機能を提供する
 */
export const HomePageClient = (props: HomePageClientProps) => {
  const { followingPosts, allPosts, timelineContextValue } = props;
  // 表示するタブ（'followingPosts' or 'allPosts'）の状態
  const [activeTab, setActiveTab] = useState('followingPosts');

  /**
   * タブがアクティブかどうかに基づいて動的なクラス名を生成する
   * @param tabName 'followingPosts' or 'allPosts'
   * @returns {string} CSSクラス名の文字列
   */
  const getTabClassName = (tabName: string) => {
    return `${styles.tab} ${activeTab === tabName ? styles.tabActive : ''}`;
  };

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.title}>タイムライン</h2>
        <PostForm />
      </header>

      <main>
        <div className={styles.tabs}>
          <button
            type="button"
            className={getTabClassName('followingPosts')}
            onClick={() => {
              setActiveTab('followingPosts');
            }}
          >
            フォロー中
          </button>
          <button
            type="button"
            className={getTabClassName('allPosts')}
            onClick={() => {
              setActiveTab('allPosts');
            }}
          >
            全ユーザー
          </button>
        </div>

        <div className={styles.content}>
          {/* PostList内部のコンポーネントがContextを必要とするため、ここで提供する */}
          {activeTab === 'followingPosts' && (
            <InfiniteScrollTimeline
              initialPosts={followingPosts}
              timelineContextValue={timelineContextValue}
            />
          )}
          {activeTab === 'allPosts' && (
            <InfiniteScrollTimeline
              initialPosts={allPosts}
              timelineContextValue={timelineContextValue}
            />
          )}
        </div>
      </main>
    </>
  );
};
