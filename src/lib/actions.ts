'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { createPostSchema, profileSchema, signupSchema, loginSchema } from './schema';
import { createSupabaseServerClient } from './supabase/server';

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type ProfileFormData = z.infer<typeof profileSchema>;

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

  const supabase = await createSupabaseServerClient();

  // 現在のユーザーを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('ユーザーが認証されていません。');
  }

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
  redirect('/');
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

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('ユーザーが認証されていません');
  }

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

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('認証されていません。');
  }

  const { error } = await supabase.from('posts').delete().match({ id: postId });

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
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('認証されていません。');
  }

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
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('認証されていません。');
  }

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
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('認証されていません。');
  }

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
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('認証されていません。');
  }

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
