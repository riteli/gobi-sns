'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { loginSchema } from './schema';
import { createSupabaseServerClient } from './supabase/server';

type FormState = {
  message: string;
  isError: boolean;
  email?: string;
};

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * ユーザー新規登録
 * メール認証後にログイン画面にリダイレクト
 */
export const signup = async (prevstate: FormState, formData: FormData): Promise<FormState> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('password_confirm') as string;

  // パスワード確認のバリデーション
  if (password !== passwordConfirm) {
    return { message: 'パスワードが一致しません。', isError: true, email: email };
  }

  // 必須項目のバリデーション
  if (!email || !password) {
    return {
      message: 'メールアドレスとパスワードを入力してください。',
      isError: true,
      email: email,
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: '/login',
    },
  });

  if (error) {
    console.error(error);
    return {
      message: 'アカウント登録に失敗しました。',
      isError: true,
      email: email,
    };
  }

  // 既存アカウントのチェック
  if (data.user && data.user.identities?.length === 0) {
    return {
      message: 'このメールアドレスは既に使用されています。',
      isError: true,
      email: email,
    };
  }

  return {
    message: '確認メールを送信しました。メールボックスを確認してください。',
    isError: false,
  };
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
  const content = formData.get('content') as string;
  if (!content) {
    throw new Error('投稿内容がありません。');
  }

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
  if (!content.includes(gobi)) {
    throw new Error(`投稿に語尾「${gobi}」が含まれていません。`);
  }

  const { error: insertError } = await supabase
    .from('posts')
    .insert({ content: content, gobi: gobi, user_id: user.id });

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
export const updateProfile = async (formData: FormData) => {
  const username = formData.get('username') as string;
  const gobi = formData.get('gobi') as string;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('ユーザーが認証されていません');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ user_name: username, current_gobi: gobi, updated_at: new Date().toISOString() })
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
