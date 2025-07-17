'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from './supabase/server';

export const signup = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('メールアドレスとパスワードを入力してください。');
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: '/',
    },
  });

  if (error) {
    console.error(error);
    throw new Error('アカウント登録に失敗しました。');
  }
};

export const login = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    throw new Error('メールアドレスまたはパスワードが間違っています。');
  }

  redirect('/');
};

export const logout = async () => {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  redirect('/login');
};

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

  revalidatePath('/');
  redirect('/');
};

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

  revalidatePath('/account/profile');
};
