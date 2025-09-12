import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createClient } from '@/lib/supabase/middleware';

/**
 * 認証状態に基づくルート保護ミドルウェア
 * 未認証ユーザーは認証ページへ、認証済みユーザーは保護されたページへリダイレクト
 */
export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // 現在のユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 未認証でもアクセス可能なルート
  const publicRoutes = ['/login', '/signup'];

  // 未認証ユーザーの処理
  if (!user) {
    if (!publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    // 認証済みユーザーが認証ページにアクセスした場合はホームへリダイレクト
    if (publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

// ミドルウェアの適用範囲（API routes、静的ファイルを除外）
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
