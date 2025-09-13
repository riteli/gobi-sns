'use server';

import { revalidatePath } from 'next/cache';

import { getAuthenticatedClient } from '@/lib/actions';

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
