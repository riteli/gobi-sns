import Link from 'next/link';

import Button from '@/components/ui/Button/Button';
import { logout } from '@/lib/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import styles from './Header.module.scss';

/**
 * アプリケーション全体のヘッダーコンポーネント
 * 認証状態に応じてナビゲーションを表示
 */
const Header = async () => {
  // Supabaseクライアントを作成してセッション情報を取得
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <Link href="/">Gobi SNS</Link>
      </h1>

      {/* ログイン済みユーザー向けナビゲーション */}
      {session && (
        <nav className={styles.nav}>
          <Link href="/account/profile" className={styles.navLink}>
            プロフィール設定
          </Link>
          <form action={logout}>
            <Button type="submit" variant="secondary">
              ログアウト
            </Button>
          </form>
        </nav>
      )}
    </header>
  );
};

export default Header;
