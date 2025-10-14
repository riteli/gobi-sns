import Link from 'next/link';

import AppButton from '@/components/ui/AppButton/AppButton';
import { UserAvatar } from '@/components/ui/UserAvatar/UserAvatar';
import { logout } from '@/features/auth/actions';
import { SearchBar } from '@/features/search/components/SearchBar/SearchBar';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import styles from './GlobalHeader.module.scss';

/**
 * アプリケーション全体のヘッダーコンポーネント
 * 認証状態に応じてナビゲーションを表示
 */
const GlobalHeader = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログインユーザーのプロフィール情報を取得
  const { data: profile } = user
    ? await supabase.from('profiles').select('avatar_url').eq('id', user.id).single()
    : { data: null };

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <Link href="/">Gobi SNS</Link>
      </h1>

      {/* ログイン済みユーザー向けナビゲーション */}
      {user && (
        <nav className={styles.nav}>
          <AppButton href="/account/profile" variant="accent">
            プロフィール設定
          </AppButton>

          <form action={logout}>
            <AppButton type="submit" variant="secondary">
              ログアウト
            </AppButton>
          </form>

          <Link href={`/profile/${user.id}`} className={styles.avatarLink}>
            <UserAvatar avatarUrl={profile?.avatar_url ?? null} size={40} />
          </Link>

          <SearchBar />
        </nav>
      )}
    </header>
  );
};

export default GlobalHeader;
