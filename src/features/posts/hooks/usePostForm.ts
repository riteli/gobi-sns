import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useProfileData } from '@/hooks/useProfileData';
import { createPostSchema } from '@/lib/schema';

import { createPost } from '../actions';

type PostFormData = {
  content: string;
};

/**
 * 投稿フォームに関するロジックをすべてカプセル化したカスタムフック
 */
export const usePostForm = () => {
  const router = useRouter();
  const { gobi, isProfileComplete, isLoading } = useProfileData();
  const postSchema = createPostSchema(gobi ?? '');

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    mode: 'onBlur',
    defaultValues: {
      content: '',
    },
  });

  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    const formData = new FormData();
    formData.append('content', data.content);

    try {
      await createPost(formData);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error('投稿エラー:', error);
      toast.error('投稿に失敗しました。時間をおいて再実行してください。');
    }
  };

  return { form, onSubmit, isProfileComplete, isLoading };
};
