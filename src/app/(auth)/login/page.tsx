'use client';

import { useActionState } from 'react';

import Button from '@/components/ui/Button/Button';
import { login } from '@/lib/actions';

import styles from './page.module.scss';

const initialState = {
  message: '',
  isError: false,
  email: '',
};

/**
 * ユーザーログインページ
 * メールアドレスとパスワードでの認証を行う
 */
const LoginPage = () => {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>ログイン</h1>

      <p
        className={`${styles.message} ${state.message ? (state.isError ? styles.error : styles.success) : ''}`}
        aria-live="polite"
      >
        {state.message || <>&nbsp;</>}
      </p>

      <form className={styles.form} action={formAction}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.srOnly}>ログイン情報</legend>
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
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" variant="primary">
            ログイン
          </Button>
        </fieldset>
      </form>
    </main>
  );
};

export default LoginPage;
