import Link from 'next/link';

import { Avatar } from '@/components/ui/Avatar/Avatar';
import Button from '@/components/ui/Button/Button';
import { logout } from '@/lib/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import styles from './Header.module.scss';

/**
 * アプリケーション全体のヘッダーコンポーネント
 * 認証状態に応じてナビゲーションを表示
 */
const Header = async () => {
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
          <Button href="/account/profile" variant="secondary">
            プロフィール設定
          </Button>

          <form action={logout}>
            <Button type="submit" variant="secondary">
              ログアウト
            </Button>
          </form>

          <Link href={`/profile/${user.id}`} className={styles.avatarLink}>
            <Avatar avatarUrl={profile?.avatar_url ?? null} size={40} />
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
