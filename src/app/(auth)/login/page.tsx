'use client';

import { useState } from 'react';

import Button from '@/components/ui/Button/Button';
import { login } from '@/lib/actions';

import styles from './page.module.scss';

/**
 * ユーザーログインページ
 * メールアドレスとパスワードでの認証を行う
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      await login(formData);
    } catch (error) {
      // Next.jsのリダイレクトエラーは再スローして正常な動作を継続
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        throw error;
      }

      // ユーザー向けエラーメッセージを表示
      if (error instanceof Error) {
        alert('エラー：' + error.message);
      } else {
        alert('予期せぬエラーが発生しました。');
      }
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>ログイン</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
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
              value={email}
              autoComplete="username"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
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
              value={password}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
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
