'use server';

import { revalidatePath } from 'next/cache';

import { createPostSchema } from '@/lib/schema';
import { getAuthenticatedClient } from '@/lib/utils';

/**
 * 新規投稿作成
 * ユーザーのカスタム語尾が投稿内容に含まれているかチェック
 */
export const createPost = async (formData: FormData) => {
  const data = { content: formData.get('content') as string };

  const { supabase, user } = await getAuthenticatedClient();

  // ユーザーのプロフィールから現在の語尾を取得
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('current_gobi')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw new Error('プロフィールの取得に失敗しました。');
  }

  const gobi = profile.current_gobi;

  // 語尾のバリデーション
  if (!gobi) {
    throw new Error('語尾が設定されていません');
  }

  const result = createPostSchema(gobi).safeParse(data);
  if (!result.success) {
    throw new Error('入力データが無効です。');
  }

  const { error: insertError } = await supabase
    .from('posts')
    .insert({ content: data.content, gobi: gobi, user_id: user.id });

  if (insertError) {
    console.error(insertError);
    throw new Error('投稿の保存に失敗しました。');
  }

  // キャッシュを更新してホームページにリダイレクト
  revalidatePath('/');
};

/**
 * 投稿削除
 * 認証済みユーザーのみ実行可能
 */
export const deletePost = async (postId: number) => {
  if (!postId) {
    throw new Error('ポストIDがありません。');
  }

  const { supabase, user } = await getAuthenticatedClient();

  const { error } = await supabase.from('posts').delete().match({ id: postId, user_id: user.id });

  if (error) {
    console.error(error);
    throw new Error('投稿の削除に失敗しました。');
  }

  // ホームページのキャッシュを更新
  revalidatePath('/');
};

/**
 * 投稿いいね
 * いいねの情報をデータベースに追加する
 */
export const likePost = async (postId: number) => {
  const { supabase, user } = await getAuthenticatedClient();

  const { error: insertError } = await supabase
    .from('likes')
    .insert({ user_id: user.id, post_id: postId });

  if (insertError) {
    console.error(insertError);
    throw new Error('いいねに失敗しました。');
  }

  revalidatePath('/');
};

/**
 * 投稿いいね取り消し
 * いいねの情報をデータベースから削除する
 */
export const unlikePost = async (postId: number) => {
  const { supabase, user } = await getAuthenticatedClient();

  const { error: deleteError } = await supabase
    .from('likes')
    .delete()
    .match({ user_id: user.id, post_id: postId });

  if (deleteError) {
    console.error(deleteError);
    throw new Error('いいねの取り消しに失敗しました。');
  }

  revalidatePath('/');
};

/**
 * 投稿をページネーションで取得する
 * @param page - 取得するページ番号 (0から始まる)
 * @param pageSize - 1ページあたりの投稿数
 */
export const fetchPosts = async (page: number, pageSize: number) => {
  const { supabase } = await getAuthenticatedClient();

  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(user_name, avatar_url), likes(count)')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error('投稿の取得に失敗しました。');
  }

  return data;
};
