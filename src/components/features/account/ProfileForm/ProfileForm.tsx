'use client';

import Button from '@/components/ui/Button/Button';
import { useProfileForm } from '@/hooks/useProfileForm';
import { type Profile } from '@/types';

import styles from './ProfileForm.module.scss';

type ProfileFormProps = {
  profile: Profile | null;
};

/**
 * プロフィールフォームのUIを担当するクライアントコンポーネント
 */
export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const { form, onSubmit } = useProfileForm({ profile });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="username" className={styles.label}>
          ユーザー名
        </label>
        <input type="text" className={styles.input} id="username" {...register('user_name')} />
        {errors.user_name && <p className={styles.errorMessage}>{errors.user_name.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="gobi" className={styles.label}>
          カスタム語尾
        </label>
        <input type="text" className={styles.input} id="gobi" {...register('gobi')} />
        {errors.gobi && <p className={styles.errorMessage}>{errors.gobi.message}</p>}
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? '更新中...' : '更新する'}
      </Button>
    </form>
  );
};
