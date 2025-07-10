'use client';

import React, { useState } from 'react';

import { signup } from '@/lib/actions';

import styles from './page.module.scss';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert('パスワードが一致しません');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      await signup(formData);

      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      alert('確認メールを送信しました。メールボックスを確認してください。');
    } catch (error) {
      if (error instanceof Error) {
        alert('エラー：' + error.message);
      } else {
        alert('予期せぬエラーが発生しました。');
      }
    }
  };
  return (
    <main>
      <h1>アカウント登録</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset>
          <legend className={styles.srOnly}>アカウント情報</legend>
          <div>
            <label htmlFor="email">メールアドレス</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              id="email"
              required
              aria-describedby="email-error"
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
              aria-describedby="password-error"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="password_confirm">パスワード（確認）</label>
            <input
              className={styles.input}
              type="password"
              name="password_confirm"
              id="password_confirm"
              required
              aria-describedby="password-confirm-error"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
              }}
            />
          </div>
          <div>
            <button className={styles.button} type="submit">
              登録する
            </button>
          </div>
        </fieldset>
      </form>
    </main>
  );
};

export default SignUpPage;
