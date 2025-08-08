import { useEffect, useState } from 'react';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';

/**
 * 現在のユーザーのプロフィール設定状況をチェックするカスタムフック
 * @returns {{isProfileComplete: boolean, isLoading: boolean}} プロフィールの完了状態とローディング状態
 */
export const useProfileStatus = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // コンポーネントのマウント時に一度だけ実行
  useEffect(() => {
    const checkProfile = async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_name, current_gobi')
          .eq('id', user.id)
          .single();

        // プロフィール完了の条件：ユーザー名と語尾の両方が設定されていること
        if (profile?.user_name && profile.current_gobi) {
          setIsProfileComplete(true);
        }
      }
      setIsLoading(false);
    };

    void checkProfile();
  }, []);

  return { isProfileComplete, isLoading };
};
