import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { login } from '@/lib/actions';
import { loginSchema } from '@/lib/schema';

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * ログインフォームに関するロジックをすべてカプセル化したカスタムフック
 */
export const useLoginForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await login(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('ログインに失敗しました。');
      }
    }
  };

  return { form, onSubmit };
};
