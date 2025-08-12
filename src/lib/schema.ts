import { z } from 'zod';

/**
 * 投稿フォームのバリデーションスキーマを生成する関数
 * @param gobi - 検証に使用するユーザーの現在の語尾
 * @returns {z.ZodObject} Zodのスキーマオブジェクト
 */
export const createPostSchema = (gobi: string) => {
  return z.object({
    content: z
      .string()
      .min(1, '投稿内容を入力してください。')
      .max(200, '投稿は200文字以内で入力してください。')
      .refine((value) => value.includes(gobi), `投稿に語尾「${gobi}」を含めてください。`),
  });
};

/**
 * プロフィール更新フォーム用のバリデーションスキーマ
 */

export const profileSchema = z.object({
  user_name: z
    .string()
    .min(1, 'ユーザー名は必須です。')
    .max(20, 'ユーザー名は20文字以内で入力してください。'),
  gobi: z.string().min(1, '語尾は必須です。').max(10, '語尾は10文字以内で入力してください。'),
});

/**
 * ログインフォーム用のバリデーションスキーマ
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください。')
    .pipe(z.email('正しいメールアドレスを入力してください。')),
  password: z.string().min(1, 'パスワードを入力してください。'),
});

/**
 * 新規登録フォーム用のバリデーションスキーマ
 */
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, 'メールアドレスを入力してください。')
      .pipe(z.email('正しいメールアドレスを入力してください。')),
    password: z.string().min(8, 'パスワードは8文字以上で入力してください。'),
    password_confirm: z.string().min(1, '確認用パスワードを入力してください。'),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'パスワードが一致しません。',
    path: ['password_confirm'],
  });
