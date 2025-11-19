import { NextResponse } from 'next/server';
import { z } from 'zod';

const createPostSchema = z.object({
  content: z.string().min(1, { message: '本文を入力してください' }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = createPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: z.treeifyError(result.error) },
        { status: 400 },
      );
    }

    const { content } = result.data;

    console.log('投稿データを受信しました:', content);

    return NextResponse.json(
      { message: '投稿が作成されました', post: { content } },
      { status: 201 },
    );
  } catch (error) {
    console.error('API Error', error);
    return NextResponse.json({ error: 'サーバー内部でエラーが発生しました' }, { status: 500 });
  }
}
