'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import Button from '@/components/ui/Button/Button';
import { createPost } from '@/lib/actions';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

import styles from './PostForm.module.scss';

/**
 * 新しい投稿を作成するフォームコンポーネント
 * 展開・折りたたみ機能でUI領域を節約
 */
const PostForm = () => {
  // フォームの展開状態を管理するstate
  const [isExpanded, setIsExpanded] = useState(false);
  // プロフィール設定完了状態を管理するstate
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // マウント時にプロフィール設定状況をチェック
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

        // ユーザー名とカスタム語尾の両方が設定されているかチェック
        if (profile?.user_name && profile.current_gobi) {
          setIsProfileComplete(true);
        }
      }
    };

    void checkProfile();
  }, []);

  // 折りたたみ時は展開ボタンのみ表示
  if (!isExpanded) {
    return (
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          setIsExpanded(true);
        }}
      >
        投稿フォームを表示する
      </Button>
    );
  }

  // プロフィール未完了時は設定案内を表示
  if (!isProfileComplete) {
    return (
      <div className={styles.notice}>
        <p>投稿するには、プロフィール設定でユーザー名とカスタム語尾を設定する必要があります。</p>
        <Link href="/account/profile">
          <Button variant="primary">設定ページへ</Button>
        </Link>
      </div>
    );
  }

  // 展開時は投稿フォームを表示
  return (
    <form action={createPost} className={styles.form}>
      <div>
        <label htmlFor="content">投稿内容</label>
        <textarea
          className={styles.textarea}
          name="content"
          id="content"
          placeholder="今日は何があった？"
          required
        />
      </div>
      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setIsExpanded(false);
          }}
        >
          投稿フォームを閉じる
        </Button>
        <Button type="submit" variant="primary">
          投稿する
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
