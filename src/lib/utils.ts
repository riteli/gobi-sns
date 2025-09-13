'use server';

import { type SupabaseClient, type User } from '@supabase/supabase-js';

import { createSupabaseServerClient } from './supabase/server';

/**
 * 認証済みユーザーのSupabaseクライアントとユーザー情報を取得するヘルパー関数
 * @returns {Promise<{supabase: SupabaseClient, user: User}>}
 * @throws ユーザーが認証されていない場合にエラーをスローする
 */
export const getAuthenticatedClient = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('認証されていません。');
  }

  return { supabase, user };
};

/**
 * タイムライン系のコンポーネントで必要となるContextの値を生成するヘルパー関数
 * @param supabase - Supabaseクライアントのインスタンス
 * @param user - 現在のログインユーザー情報（Userオブジェクトまたはnull）
 */
export const getTimelineContextValue = async (supabase: SupabaseClient, user: User | null) => {
  let likedPostIds = new Set<number>();
  let followingUserIds = new Set<string>();

  if (user) {
    const [{ data: likedPosts }, { data: followingUsers }] = await Promise.all([
      supabase.from('likes').select('post_id').eq('user_id', user.id),
      supabase.from('follows').select('following_id').eq('follower_id', user.id),
    ]);

    if (likedPosts) {
      likedPostIds = new Set(
        likedPosts
          .filter((like): like is { post_id: number } => like.post_id !== null)
          .map((like) => like.post_id),
      );
    }
    if (followingUsers) {
      followingUserIds = new Set(
        followingUsers
          .filter(
            (following): following is { following_id: string } => following.following_id !== null,
          )
          .map((following) => following.following_id),
      );
    }
  }

  return {
    userId: user?.id ?? null,
    likedPostIds,
    followingUserIds,
  };
};
