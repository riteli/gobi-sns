'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';

import Button from '@/components/ui/Button/Button';
import { useProfileStatus } from '@/hooks/useProfileStatus';
import { createPost } from '@/lib/actions';

import styles from './PostForm.module.scss';

/**
 * 新しい投稿を作成するフォームコンポーネント
 * 展開・折りたたみ機能でUI領域を節約
 */
const PostForm = () => {
  const initialState = {
    message: '',
    isError: false,
    content: '',
  };
  const [state, formAction] = useActionState(createPost, initialState);

  // フォームの展開状態を管理するstate
  const [isExpanded, setIsExpanded] = useState(false);

  // マウント時にプロフィール設定状況をチェック
  const { isProfileComplete, isLoading } = useProfileStatus();

  if (isLoading) {
    return null;
  }

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
    <form action={formAction} className={styles.form}>
      <div>
        <label htmlFor="content">投稿内容</label>
        <textarea
          className={styles.textarea}
          name="content"
          id="content"
          placeholder="今日は何があった？"
          key={state.message}
          defaultValue={state.content}
          required
        />
      </div>

      <div className={styles.messageWrapper}>
        {state.message && (
          <p className={state.isError ? styles.error : styles.success}>{state.message}</p>
        )}
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
