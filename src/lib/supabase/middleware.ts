import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { type Database } from '@/types/database.types';

/**
 * ミドルウェア用のSupabaseクライアントを作成
 * Cookie操作を含むSSR対応のクライアントとレスポンスオブジェクトを返す
 */
export const createClient = (request: NextRequest) => {
  // レスポンスオブジェクトを準備
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 環境変数の取得と検証
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  // Cookie操作機能を含むSupabaseクライアントを作成
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // リクエストからすべてのCookieを取得
      getAll() {
        return request.cookies.getAll();
      },
      // レスポンスにCookieを設定
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  return { supabase, response };
};
