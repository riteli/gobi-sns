'use client';

import { useEffect, useReducer } from 'react';
import { useInView } from 'react-intersection-observer';

import { fetchPosts } from '@/lib/actions';
import { PostWithProfile } from '@/types';

type State = {
  posts: PostWithProfile[];
  page: number;
  isLoading: boolean;
  hasMore: boolean;
};

type Action =
  | { type: 'SET_POSTS'; payload: PostWithProfile[] }
  | { type: 'ADD_POSTS'; payload: PostWithProfile[] }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'INCREMENT_PAGE' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'ADD_POSTS':
      return { ...state, posts: [...state.posts, ...action.payload] };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    case 'INCREMENT_PAGE':
      return { ...state, page: state.page + 1 };
    default:
      return state;
  }
};

/**
 * 投稿の無限スクロール機能を提供するカスタムフック
 * @param initialPosts - サーバーから最初に取得した投稿の配列
 * @returns 投稿リスト、ローディング状態、および監視対象に設定するref
 */
export const useInfiniteScroll = (initialPosts: PostWithProfile[] | null) => {
  const PAGE_SIZE = 10;

  const initialState: State = {
    posts: initialPosts ?? [],
    page: 1,
    isLoading: false,
    hasMore: (initialPosts?.length ?? 0) === PAGE_SIZE,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (initialPosts) {
      dispatch({ type: 'SET_POSTS', payload: initialPosts });
    }
  }, [initialPosts]);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !state.isLoading && state.hasMore) {
      const loadMorePosts = async () => {
        dispatch({ type: 'SET_IS_LOADING', payload: true });
        try {
          const newPosts = await fetchPosts(state.page, PAGE_SIZE);

          if (!newPosts.length) {
            dispatch({ type: 'SET_HAS_MORE', payload: false });
          } else {
            dispatch({ type: 'ADD_POSTS', payload: newPosts });
            dispatch({ type: 'INCREMENT_PAGE' });
          }
        } catch (error) {
          console.error('投稿の読み込みに失敗しました', error);
        } finally {
          dispatch({ type: 'SET_IS_LOADING', payload: false });
        }
      };
      void loadMorePosts();
    }
  }, [inView, state.isLoading, state.hasMore, state.page]);

  return {
    posts: state.posts,
    isLoading: state.isLoading,
    ref,
  };
};
