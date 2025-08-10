import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { signup } from '@/lib/actions';
import { signupSchema } from '@/lib/schema';

type SignUpFormData = z.infer<typeof signupSchema>;

/**
 * 新規登録フォームに関するロジックをすべてカプセル化したカスタムフック
 */
export const useSignUpForm = () => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      password_confirm: '',
    },
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      await signup(data);
      toast.success('確認メールを送信しました。メールボックスを確認してください。');
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('アカウント登録に失敗しました。');
      }
    }
  };

  return { form, onSubmit };
};
