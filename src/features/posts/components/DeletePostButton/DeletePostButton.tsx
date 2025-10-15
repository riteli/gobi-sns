'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import AppButton from '@/components/ui/AppButton/AppButton';
import ConfirmModal from '@/components/ui/ConfirmModal/ConfirmModal';
import { deletePost } from '@/features/posts/actions';

type DeletePostButtonProps = {
  postId: number;
};

export const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  const router = useRouter();
  // モーダルの開閉状態の判定
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 投稿の削除処理
  const handleDeleteConfirm = async () => {
    try {
      await deletePost(postId);
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error('エラーが発生しました。時間をおいて再度お試しください。');
      }
    }
  };

  return (
    <>
      <AppButton
        type="button"
        variant="secondary"
        size="small"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        削除
      </AppButton>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onConfirm={handleDeleteConfirm}
        title="投稿を削除"
      >
        <p>この操作は取り消せません。本当にこの投稿を削除しますか？</p>
      </ConfirmModal>
    </>
  );
};
