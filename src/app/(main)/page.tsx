import { logout } from '@/lib/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const HomePage = async () => {
  // サーバーサイドでユーザーのセッション情報を取得
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main>
      <h1>語尾SNS タイムライン</h1>

      {/* セッションが存在する場合（ログインしている場合）のみログアウトボタンを表示 */}
      {session && (
        <form action={logout}>
          <button type="submit">ログアウト</button>
        </form>
      )}

      <p>（ここに投稿が表示されます）</p>
    </main>
  );
};

export default HomePage;
