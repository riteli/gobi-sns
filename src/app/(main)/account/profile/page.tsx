import { AvatarForm } from '@/components/features/account/AvatarForm/AvatarForm';
import { DeleteAccountForm } from '@/components/features/account/DeleteAccountForm/DeleteAccountForm';
import { ProfileForm } from '@/components/features/account/ProfileForm/ProfileForm';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import styles from './page.module.scss';

/**
 * プロフィール設定ページ（サーバーコンポーネント）
 * ページの表示に必要なデータを事前に取得し、クライアントコンポーネントに渡す
 */
const ProfilePage = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // middlewareで保護されているが、念のため
    return null;
  }

  // 現在のプロフィール情報を取得
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>プロフィール設定</h2>
      <AvatarForm avatarUrl={profile?.avatar_url ?? null} />
      <ProfileForm profile={profile} />
      <DeleteAccountForm />
    </div>
  );
};

export default ProfilePage;
