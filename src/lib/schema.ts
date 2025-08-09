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
      .min(1, { message: '投稿内容を入力してください。' })
      .refine((value) => value.includes(gobi), {
        message: `投稿に語尾「${gobi}」を含めてください。`,
      }),
  });
};
