import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { CreatePostRequest } from '@/types';

const createPostSchema = z.object({
  content: z.string().min(1, { message: '本文を入力してください' }),
});

type CreatePostInput = z.infer<typeof createPostSchema>;

export const usePostForm = () => {
  const router = useRouter();

  const [isProfileComplete] = useState(true);
  const [isLoading] = useState(false);

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit: SubmitHandler<CreatePostInput> = async (data) => {
    try {
      const requestBody: CreatePostRequest = {
        content: data.content,
      };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        throw new Error(errorData.error ?? '投稿に失敗しました');
      }

      toast.success('投稿しました！');
      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('エラーが発生しました');
    }
  };

  return {
    form,
    onSubmit,
    isProfileComplete,
    isLoading,
  };
};
