'use client';

import { useState } from 'react';

import Button from '@/components/ui/Button/Button';
import { createPost } from '@/lib/actions';

import styles from './PostForm.module.scss';

/**
 * 新しい投稿を作成するフォームコンポーネント
 * 展開・折りたたみ機能でUI領域を節約
 */
const PostForm = () => {
  // フォームの展開状態を管理するstate
  const [isExpanded, setIsExpanded] = useState(false);

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
