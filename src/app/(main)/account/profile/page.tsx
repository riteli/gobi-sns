import { redirect } from 'next/navigation';

import { updateProfile } from '@/lib/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * プロフィール設定ページ
 * 認証が必要で、ユーザー名とカスタム語尾を編集可能
 */
const ProfilePage = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未認証の場合はログインページにリダイレクト
  if (!user) {
    redirect('/login');
  }

  // 現在のプロフィール情報を取得
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div>
      <h2>プロフィール設定</h2>
      <form action={updateProfile}>
        <div>
          <label htmlFor="username">ユーザー名</label>
          <input
            type="text"
            name="username"
            id="username"
            defaultValue={profile?.user_name ?? ''}
            required
          />
        </div>
        <div>
          <label htmlFor="gobi">カスタム語尾</label>
          <input type="text" name="gobi" id="gobi" defaultValue={profile?.current_gobi ?? ''} />
        </div>
        <button type="submit">更新する</button>
      </form>
    </div>
  );
};

export default ProfilePage;
