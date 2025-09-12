'use client';

import Link from 'next/link';

import Button from '@/components/ui/Button/Button';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';

import styles from '../authForm.module.scss';

/**
 * ユーザーログインページ
 * メールアドレスとパスワードでの認証を行う
 */
const LoginPage = () => {
  const { form, onSubmit } = useLoginForm();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>ログイン</h1>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.srOnly}>ログイン情報</legend>
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
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
          </div>

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'ログイン中...' : 'ログイン'}
          </Button>
        </fieldset>
      </form>

      <div className={styles.linkContainer}>
        <p>
          アカウントをお持ちでないですか？{' '}
          <Link href="/signup" className={styles.link}>
            新規登録
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
