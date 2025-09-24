import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { deleteAccount } from '@/features/auth/actions';
import { deleteAccountSchema } from '@/lib/schema';

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

/**
 * アカウント削除フォームのロジックをカプセル化したカスタムフック
 */
export const useDeleteAccountForm = () => {
  const form = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    mode: 'onBlur',
    defaultValues: {
      password: '',
      confirm: false,
    },
  });

  /**
   * フォーム送信時にアカウント削除のサーバーアクションを呼び出す
   */
  const onSubmit: SubmitHandler<DeleteAccountFormData> = async (data) => {
    try {
      await deleteAccount(data.password);
    } catch (error) {
      if (error instanceof Error) {
        if (!error.message.includes('NEXT_REDIRECT')) {
          toast.error(error.message);
        }
      } else {
        toast.error('アカウントの削除に失敗しました。');
      }
    }
  };
  return { form, onSubmit };
};
