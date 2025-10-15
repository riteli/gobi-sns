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
 * 指定されたユーザーがいいねした投稿のIDセットを取得する
 */
export const getLikedPostIds = async (supabase: SupabaseClient, user: User) => {
  let likedPostIds = new Set<number>();

  const { data: likedPosts } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', user.id);

  if (likedPosts) {
    likedPostIds = new Set(
      likedPosts
        .filter((like): like is { post_id: number } => like.post_id !== null)
        .map((like) => like.post_id),
    );
  }

  return likedPostIds;
};

/**
 * 指定されたユーザーがフォローしているユーザーのIDセットを取得する
 */
export const getFollowingUserIds = async (supabase: SupabaseClient, user: User) => {
  let followingUserIds = new Set<string>();

  const { data: followingUsers } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id);

  if (followingUsers) {
    followingUserIds = new Set(
      followingUsers
        .filter(
          (following): following is { following_id: string } => following.following_id !== null,
        )
        .map((following) => following.following_id),
    );
  }

  return followingUserIds;
};

/**
 * タイムライン系のコンポーネントで必要となるContextの値を生成するヘルパー関数
 * @param supabase - Supabaseクライアントのインスタンス
 * @param user - 現在のログインユーザー情報（Userオブジェクトまたはnull）
 */
export const getTimelineContextValue = async (supabase: SupabaseClient, user: User | null) => {
  if (!user) {
    return {
      userId: null,
      likedPostIds: new Set<number>(),
      followingUserIds: new Set<string>(),
    };
  }

  const [likedPostIds, followingUserIds] = await Promise.all([
    getLikedPostIds(supabase, user),
    getFollowingUserIds(supabase, user),
  ]);

  return {
    userId: user.id,
    likedPostIds,
    followingUserIds,
  };
};
