import { useState } from 'react';

import Button from '@/components/ui/Button/Button';
import ConfirmModal from '@/components/ui/ConfirmModal/ConfirmModal';
import { deletePost } from '@/lib/actions';

type DeletePostButtonProps = {
  postId: number;
};

export const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  // モーダルの開閉状態の判定
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 投稿の削除処理
  const handleDeleteConfirm = async () => {
    await deletePost(postId);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        削除
      </Button>

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
