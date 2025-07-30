import Button from '@/components/ui/Button/Button';
import { updateProfile } from '@/lib/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import styles from './page.module.scss';

/**
 * プロフィール設定ページ
 * 認証が必要で、ユーザー名とカスタム語尾を編集可能
 */
const ProfilePage = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未認証の場合は何も表示しない（middlewareでリダイレクト処理済み）
  if (!user) {
    return null;
  }

  // 現在のプロフィール情報を取得
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>プロフィール設定</h2>
      <form action={updateProfile} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            ユーザー名
          </label>
          <input
            type="text"
            className={styles.input}
            name="username"
            id="username"
            defaultValue={profile?.user_name ?? ''}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="gobi" className={styles.label}>
            カスタム語尾
          </label>
          <input
            type="text"
            className={styles.input}
            name="gobi"
            id="gobi"
            defaultValue={profile?.current_gobi ?? ''}
          />
        </div>
        <Button type="submit" variant="primary">
          更新する
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
