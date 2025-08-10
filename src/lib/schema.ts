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
      .refine((value) => value.includes(gobi), `投稿に語尾「${gobi}」を含めてください。`),
  });
};

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
