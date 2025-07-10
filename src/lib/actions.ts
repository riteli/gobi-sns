'use server';

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

  // Supabaseの signInWithPassword を使ってログイン
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
