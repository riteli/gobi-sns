import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { profileSchema } from '@/lib/schema';
import { type Profile } from '@/types';

import { updateProfile } from '../actions';

type ProfileFormData = z.infer<typeof profileSchema>;

type UseProfileFormProps = {
  profile: Profile | null;
};

/**
 * ユーザープロフィールフォームに関するロジックをすべてカプセル化したカスタムフック
 */
export const useProfileForm = ({ profile }: UseProfileFormProps) => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: {
      user_name: profile?.user_name ?? '',
      gobi: profile?.current_gobi ?? '',
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      await updateProfile(data);
      toast.success('プロフィールを更新しました！');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('プロフィールの更新に失敗しました。');
      }
    }
  };

  return { form, onSubmit };
};
