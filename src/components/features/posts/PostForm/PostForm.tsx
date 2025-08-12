'use client';

import { useState } from 'react';

import Button from '@/components/ui/Button/Button';
import { usePostForm } from '@/hooks/usePostForm';

import styles from './PostForm.module.scss';

/**
 * 新しい投稿を作成するフォームコンポーネント
 * 展開・折りたたみ機能でUI領域を節約
 */
const PostForm = () => {
  // フォームの展開状態を管理するstate
  const [isExpanded, setIsExpanded] = useState(false);

  const { form, onSubmit, isProfileComplete, isLoading } = usePostForm();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

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
        <Button href="/account/profile" variant="primary">
          設定ページへ
        </Button>
      </div>
    );
  }

  // 展開時は投稿フォームを表示
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div>
        <label htmlFor="content">投稿内容</label>
        <textarea
          className={styles.textarea}
          id="content"
          placeholder="今日は何があった？"
          {...register('content')}
        />
      </div>

      <div className={styles.messageWrapper}>
        {errors.content && <p className={styles.error}>{errors.content.message}</p>}
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
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? '投稿中...' : '投稿する'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
