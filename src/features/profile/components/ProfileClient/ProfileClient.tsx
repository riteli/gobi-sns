'use client';

import { useState } from 'react';

import { Avatar } from '@/components/ui/Avatar/Avatar';
import { TimelineContext, type TimelineContextType } from '@/contexts/TimelineContext';
import PostList from '@/features/posts/components/PostList/PostList';
import { PostWithProfile } from '@/types';

import styles from './ProfileClient.module.scss';

type ProfileClientProps = {
  userName: string | null;
  currentGobi: string | null;
  avatarUrl: string | null;
  followingCount: number;
  followerCount: number;
  userPosts: PostWithProfile[] | null;
  likedPosts: PostWithProfile[] | null;
  timelineContextValue: TimelineContextType;
};

/**
 * プロフィールページのUIを描画するクライアントコンポーネント
 * サーバーから受け取ったデータを基に、タブの状態管理などを行う
 */
export const ProfileClient = (props: ProfileClientProps) => {
  const {
    userName,
    currentGobi,
    avatarUrl,
    followingCount,
    followerCount,
    userPosts,
    likedPosts,
    timelineContextValue,
  } = props;

  // 表示するタブ（'posts' or 'likes'）の状態
  const [activeTab, setActiveTab] = useState('posts');

  /**
   * タブがアクティブかどうかに基づいて動的なクラス名を生成する
   * @param tabName 'posts' or 'likes'
   * @returns {string} CSSクラス名の文字列
   */
  const getTabClassName = (tabName: string) => {
    return `${styles.tab} ${activeTab === tabName ? styles.tabActive : ''}`;
  };

  return (
    <section className={styles.profile}>
      <header className={styles.profileHeader}>
        <Avatar avatarUrl={avatarUrl} size={80} />{' '}
        <div className={styles.mainInfo}>
          <h2 className={styles.userName}>{userName}</h2>
          <p className={styles.gobi}>語尾：{currentGobi}</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{followingCount}</span>
            <span className={styles.statLabel}>フォロー</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{followerCount}</span>
            <span className={styles.statLabel}>フォロワー</span>
          </div>
        </div>
      </header>

      <div className={styles.tabs}>
        <button
          type="button"
          className={getTabClassName('posts')}
          onClick={() => {
            setActiveTab('posts');
          }}
        >
          投稿
        </button>
        <button
          type="button"
          className={getTabClassName('likes')}
          onClick={() => {
            setActiveTab('likes');
          }}
        >
          いいね
        </button>
      </div>

      <div className={styles.content}>
        {/* PostList内部のコンポーネントがContextを必要とするため、ここで提供する */}
        <TimelineContext value={timelineContextValue}>
          {activeTab === 'posts' && <PostList posts={userPosts} />}
          {activeTab === 'likes' && <PostList posts={likedPosts} />}
        </TimelineContext>
      </div>
    </section>
  );
};
