'use server';

import { revalidatePath } from 'next/cache';

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
 * フォロー機能
 * フォローの情報をデータベースに追加する
 */
export const followUser = async (userIdToFollow: string) => {
  const { supabase, user } = await getAuthenticatedClient();

  if (user.id === userIdToFollow) {
    throw new Error('自分自身をフォローすることはできません。');
  }

  const { error: insertError } = await supabase
    .from('follows')
    .insert({ follower_id: user.id, following_id: userIdToFollow });

  if (insertError) {
    console.error(insertError);
    throw new Error('フォローに失敗しました。');
  }

  revalidatePath('/');
};

/**
 * フォロー解除機能
 * フォローの情報をデータベースから削除する
 */
export const unfollowUser = async (userIdToUnfollow: string) => {
  const { supabase, user } = await getAuthenticatedClient();

  const { error: deleteError } = await supabase
    .from('follows')
    .delete()
    .match({ follower_id: user.id, following_id: userIdToUnfollow });

  if (deleteError) {
    console.error(deleteError);
    throw new Error('フォローの解除に失敗しました。');
  }
  revalidatePath('/');
};
