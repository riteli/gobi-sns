import { getAuthenticatedClient } from '@/lib/actions';

/**
 * 投稿をキーワードで検索する
 * @param query 検索キーワード
 */
export const searchPosts = async (query: string) => {
  if (!query) {
    return [];
  }

  const { supabase } = await getAuthenticatedClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profiles(user_name, avatar_url), likes(count)')
    .ilike('content', `%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    throw new Error('検索に失敗しました。');
  }

  return posts;
};
