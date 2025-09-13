'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getAuthenticatedClient } from '@/lib/actions';
import { avatarSchema, profileSchema } from '@/lib/schema';

type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * プロフィール更新
 * ユーザー名とカスタム語尾を更新
 */
export const updateProfile = async (data: ProfileFormData) => {
  const result = profileSchema.safeParse(data);
  if (!result.success) {
    throw new Error('入力データが無効です。');
  }

  const { supabase, user } = await getAuthenticatedClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      user_name: data.user_name,
      current_gobi: data.gobi,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    throw new Error('プロフィールの更新に失敗しました。');
  }

  // プロフィールページのキャッシュを更新
  revalidatePath('/account/profile');
};

/**
 * アバター画像をアップロードし、プロフィール情報を更新する
 */
export const uploadAvatar = async (formData: FormData) => {
  const { supabase, user } = await getAuthenticatedClient();

  // FormDataからファイルを取得し、バリデーション
  const avatarFile = formData.get('avatarFile');
  const result = avatarSchema.safeParse({ avatarFile });

  if (!result.success) {
    throw new Error('JPGまたはPNG形式の5MB以下の画像を選択してください。');
  }

  const file = result.data.avatarFile;
  const filePath = user.id;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error(uploadError);
    throw new Error('アイコンのアップロードに失敗しました。');
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath);

  const cacheBustedUrl = `${publicUrl}?t=${new Date().getTime().toString()}`;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: cacheBustedUrl })
    .eq('id', user.id);

  if (updateError) {
    console.error(updateError);
    throw new Error('プロフィール情報の更新に失敗しました。');
  }

  revalidatePath('/account/profile');
  revalidatePath(`/profile/${user.id}`);
};

/**
 * アバター画像を削除し、プロフィール情報を更新する
 */
export const deleteAvatar = async () => {
  const { supabase, user } = await getAuthenticatedClient();

  // Storageからファイルを削除
  const { error: removeError } = await supabase.storage.from('avatars').remove([user.id]);
  if (removeError) {
    console.error(removeError);
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('id', user.id);

  if (updateError) {
    console.error(updateError);
    throw new Error('プロフィール情報の更新に失敗しました。');
  }

  revalidatePath('/account/profile');
  revalidatePath(`/profile/${user.id}`);
};

export const searchPosts = async (query: string) => {
  if (!query) {
    return [];
  }

  const { supabase } = await getAuthenticatedClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profiles(user_name, avatar_url), likes(count)')
    .ilike('content', `%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    throw new Error('検索に失敗しました。');
  }

  return posts;
};
