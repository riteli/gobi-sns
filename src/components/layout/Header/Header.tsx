import Link from 'next/link';

import { logout } from '@/lib/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

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
    <header>
      <h1>
        <Link href="/">Gobi SNS</Link>
      </h1>

      {/* ログイン済みユーザー向けナビゲーション */}
      {session && (
        <nav>
          <Link href="/account/profile">プロフィール設定</Link>
          <form action={logout}>
            <button type="submit">ログアウト</button>
          </form>
        </nav>
      )}
    </header>
  );
};

export default Header;
