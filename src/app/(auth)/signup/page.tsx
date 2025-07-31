'use client';

import { useActionState } from 'react';

import Button from '@/components/ui/Button/Button';
import { signup } from '@/lib/actions';

import styles from './page.module.scss';

// Server Actionと連携するための初期状態
const initialState = {
  message: '',
  isError: false,
  email: '',
};

/**
 * ユーザー新規登録ページ
 * メールアドレス・パスワードでアカウントを作成し、確認メールを送信
 */
const SignUpPage = () => {
  // useActionStateフックでフォームの状態(state)とアクション(formAction)を管理
  const [state, formAction] = useActionState(signup, initialState);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>アカウント登録</h1>

      <p
        className={`${styles.message} ${state.message ? (state.isError ? styles.error : styles.success) : ''}`}
        aria-live="polite"
      >
        {state.message || <>&nbsp;</>}
      </p>

      <form className={styles.form} action={formAction}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.srOnly}>アカウント情報</legend>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              メールアドレス
            </label>
            <input
              type="email"
              className={styles.input}
              name="email"
              id="email"
              required
              autoComplete="username"
              key={state.message}
              defaultValue={state.email}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              パスワード
            </label>
            <input
              type="password"
              className={styles.input}
              name="password"
              id="password"
              required
              autoComplete="new-password"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password_confirm" className={styles.label}>
              パスワード（確認）
            </label>
            <input
              type="password"
              className={styles.input}
              name="password_confirm"
              id="password_confirm"
              required
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" variant="primary">
            登録する
          </Button>
        </fieldset>
      </form>
    </main>
  );
};

export default SignUpPage;
