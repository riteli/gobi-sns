'use client';

import { useState } from 'react';

import { login } from '@/lib/actions';

import styles from './page.module.scss';

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
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        throw error;
      }

      if (error instanceof Error) {
        alert('エラー：' + error.message);
      } else {
        alert('予期せぬエラーが発生しました。');
      }
    }
  };

  return (
    <main>
      <h1>ログイン</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset>
          <legend className={styles.srOnly}>ログイン情報</legend>
          <div>
            <label htmlFor="email">メールアドレス</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              id="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="password">パスワード</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              id="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div>
            <button className={styles.button} type="submit">
              ログイン
            </button>
          </div>
        </fieldset>
      </form>
    </main>
  );
};

export default LoginPage;
