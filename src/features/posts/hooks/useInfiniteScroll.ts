'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { PostWithProfile } from '@/types';

type Fetcher = (page: number, pageSize: number) => Promise<PostWithProfile[]>;

/**
 * 投稿の無限スクロール機能を提供するカスタムフック
 * @param initialPosts - サーバーから最初に取得した投稿の配列
 *  @param fetcher - 追加の投稿を読み込むための非同期関数
 * @returns 投稿リスト、ローディング状態、および監視対象に設定するref
 */
export const useInfiniteScroll = (initialPosts: PostWithProfile[] | null, fetcher: Fetcher) => {
  const PAGE_SIZE = 10;

  const [posts, setPosts] = useState(() => initialPosts ?? []);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasmore] = useState((initialPosts?.length ?? 0) === PAGE_SIZE);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      const loadMorePosts = async () => {
        setIsLoading(true);
        try {
          const newPosts = await fetcher(page, PAGE_SIZE);

          if (!newPosts.length) {
            setHasmore(false);
          } else {
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            setPage((prevPage) => prevPage + 1);
          }
        } catch (error) {
          console.error('投稿の読み込みに失敗しました', error);
        } finally {
          setIsLoading(false);
        }
      };
      void loadMorePosts();
    }
  }, [inView, isLoading, hasMore, page, fetcher]);

  return {
    posts,
    isLoading,
    ref,
  };
};
