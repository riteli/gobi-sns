import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { createPostSchema } from '@/lib/schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * 新規投稿を作成するAPIエンドポイント
 * 認証、語尾設定の取得、バリデーション、DB保存を行う
 */
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    // ユーザー認証の確認
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    // ユーザーの現在の語尾設定を取得
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('current_gobi')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'ユーザー情報が見つかりません' }, { status: 500 });
    }

    const currentGobi = profileData.current_gobi ?? '';

    // リクエストデータの取得
    const body = await request.json();

    const result = createPostSchema(currentGobi).safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { content } = result.data;

    // データベースへの保存
    const { error: insertError } = await supabase
      .from('posts')
      .insert({ content: content, user_id: user.id, gobi: currentGobi });

    if (insertError) {
      console.error('Insert Error:', insertError);
      return NextResponse.json({ error: '投稿の保存に失敗しました' }, { status: 500 });
    }

    revalidatePath('/');

    return NextResponse.json(
      { message: '投稿が作成されました', post: { content } },
      { status: 201 },
    );
  } catch (error) {
    console.error('API Error', error);
    return NextResponse.json({ error: 'サーバー内部でエラーが発生しました' }, { status: 500 });
  }
}
