'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';

import { deleteAvatar, uploadAvatar } from '../actions';

/**
 * アバターフォームに関するすべてのロジックをカプセル化したカスタムフック
 */
export const useAvatarForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ファイル選択時のプレビュー処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // リセット処理
  const handleReset = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 「画像を変更」ボタンクリック処理
  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  // アップロード処理
  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('画像ファイルが選択されていません。');
      return;
    }

    const formData = new FormData();
    formData.append('avatarFile', file);

    startTransition(async () => {
      try {
        await uploadAvatar(formData);
        toast.success('アイコンを更新しました！');
        handleReset();
        router.refresh();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    });
  };

  // 削除処理
  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteAvatar();
        toast.success('アイコンを削除しました。');
        router.refresh();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    });
  };

  return {
    fileInputRef,
    preview,
    isPending,
    handleFileChange,
    handleUpload,
    handleDelete,
    handleReset,
    handleChangeClick,
  };
};
