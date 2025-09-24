'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { signupSchema, loginSchema } from '@/lib/schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAuthenticatedClient } from '@/lib/utils';

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

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
