'use client';

import Button from '@/components/ui/Button/Button';
import { useDeleteAccountForm } from '@/hooks/useDeleteAccountForm';

import styles from './DeleteAccountForm.module.scss';

export const DeleteAccountForm = () => {
  const { form, onSubmit } = useDeleteAccountForm();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  /**
   * アカウント削除フォームのコンポーネント
   */
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h3 className={styles.title}>アカウントの削除</h3>
      <p className={styles.notice}>
        <strong>この操作は取り消せません</strong>
      </p>
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          パスワード
        </label>
        <input
          type="password"
          className={styles.input}
          id="password"
          autoComplete="off"
          {...register('password')}
        />
        {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <div className={styles.checkboxGroup}>
          <label htmlFor="confirm" className={styles.checkboxLabel}>
            アカウントの削除に同意する
          </label>
          <input
            type="checkbox"
            className={styles.checkbox}
            id="confirm"
            {...register('confirm')}
          />
        </div>
        {errors.confirm && <p className={styles.errorMessage}>{errors.confirm.message}</p>}
      </div>
      <div className={styles.buttonContainer}>
        <Button type="submit" variant="danger" disabled={isSubmitting}>
          {isSubmitting ? '削除中...' : 'アカウントを削除する'}
        </Button>
      </div>
    </form>
  );
};
