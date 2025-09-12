'use client';

import Link from 'next/link';

import Button from '@/components/ui/Button/Button';
import { useSignUpForm } from '@/hooks/useSignUpForm';

import styles from '../authForm.module.scss';

/**
 * ユーザー新規登録ページ
 * メールアドレス・パスワードでアカウントを作成し、確認メールを送信
 */
const SignUpPage = () => {
  const { form, onSubmit } = useSignUpForm();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>アカウント登録</h1>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.srOnly}>アカウント情報</legend>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              メールアドレス
            </label>
            <input
              type="email"
              className={styles.input}
              id="email"
              autoComplete="username"
              {...register('email')}
            />
            {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              パスワード
            </label>
            <input
              type="password"
              className={styles.input}
              id="password"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password_confirm" className={styles.label}>
              パスワード（確認）
            </label>
            <input
              type="password"
              className={styles.input}
              id="password_confirm"
              autoComplete="new-password"
              {...register('password_confirm')}
            />
            {errors.password_confirm && (
              <p className={styles.errorMessage}>{errors.password_confirm.message}</p>
            )}
          </div>

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? '登録中...' : '登録する'}
          </Button>
        </fieldset>
      </form>

      <div className={styles.linkContainer}>
        <p>
          すでにアカウントをお持ちですか？{' '}
          <Link href="/login" className={styles.link}>
            ログイン
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignUpPage;
