'use client';

import React, { useState } from 'react';

import Button from '@/components/ui/Button/Button';
import { signup } from '@/lib/actions';

import styles from './page.module.scss';

/**
 * ユーザー新規登録ページ
 * メールアドレス・パスワードでアカウントを作成し、確認メールを送信
 */
const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // パスワード確認のバリデーション
    if (password !== passwordConfirm) {
      alert('パスワードが一致しません');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      await signup(formData);

      // 成功時はフォームをリセットしてユーザーに通知
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      alert('確認メールを送信しました。メールボックスを確認してください。');
    } catch (error) {
      // エラーハンドリング
      if (error instanceof Error) {
        alert('エラー：' + error.message);
      } else {
        alert('予期せぬエラーが発生しました。');
      }
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>アカウント登録</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
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
              aria-describedby="email-error"
              autoComplete="username"
              value={email}
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
              aria-describedby="password-error"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
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
              aria-describedby="password-confirm-error"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
              }}
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
