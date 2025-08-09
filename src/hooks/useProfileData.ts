import { useEffect, useState } from 'react';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type ProfileData = {
  isProfileComplete: boolean;
  gobi: string | null;
  isLoading: boolean;
};

/**
 * 現在のユーザーのプロフィール情報（完了状態、語尾）をチェックするカスタムフック
 * @returns {{isProfileComplete: boolean, gobi: string | null, isLoading: boolean}} プロフィールの完了状態とローディング状態
 */
export const useProfileData = (): ProfileData => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [gobi, setGobi] = useState<string | null>(null);
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

        if (profile && typeof profile.current_gobi === 'string') {
          setGobi(profile.current_gobi);
        }

        // プロフィール完了の条件：ユーザー名と語尾の両方が設定されていること
        if (profile?.user_name && profile.current_gobi) {
          setIsProfileComplete(true);
        }
      }
      setIsLoading(false);
    };

    void checkProfile();
  }, []);

  return { gobi, isProfileComplete, isLoading };
};
