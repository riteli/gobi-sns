'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { createPostSchema, profileSchema, signupSchema, loginSchema, avatarSchema } from './schema';
import { createSupabaseServerClient } from './supabase/server';

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * 認証済みユーザーのSupabaseクライアントとユーザー情報を取得するヘルパー関数
 * @returns {Promise<{supabase: SupabaseClient, user: User}>}
 * @throws ユーザーが認証されていない場合にエラーをスローする
 */
const getAuthenticatedClient = async () => {
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
 * ユーザー新規登録
 * メール認証後にログイン画面にリダイレクト
 */
export const signup = async (data: SignupFormData) => {
  const result = signupSchema.safeParse(data);
  if (!result.success) {
    throw new Error('入力データが無効です。');
  }

  const supabase = await createSupabaseServerClient();

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: '/login',
    },
  });

  if (error) {
    console.error(error);
    throw new Error('アカウント登録に失敗しました。');
  }

  // 既存アカウントのチェック
  if (signUpData.user && signUpData.user.identities?.length === 0) {
    throw new Error('このメールアドレスは既に使用されています。');
  }
};

/**
 * ユーザーログイン
 * 成功時はホームページにリダイレクト
 */
export const login = async (data: LoginFormData) => {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    throw new Error('入力データが無効です。');
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    console.error(error);
    throw new Error('メールアドレスまたはパスワードが間違っています。');
  }

  redirect('/');
};

/**
 * ユーザーログアウト
 * ログイン画面にリダイレクト
 */
export const logout = async () => {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  redirect('/login');
};

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

/**
 * 入力されたパスワードを確認し、アカウントを削除する
 */
export const deleteAccount = async (password: string) => {
  const { supabase, user } = await getAuthenticatedClient();

  if (!user.email) {
    throw new Error('予期せぬエラーが発生しました。');
  }

  const { error } = await supabase.auth.signInWithPassword({ email: user.email, password });

  if (error) {
    throw new Error('パスワードが間違っています。');
  }

  const { error: deleteError } = await supabase.rpc('delete_user');

  if (deleteError) {
    console.error(deleteError);
    throw new Error('アカウントの削除中にエラーが発生しました。');
  }

  await logout();
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
