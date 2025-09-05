'use client';

import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';

import Button from '@/components/ui/Button/Button';
import { useAvatarForm } from '@/hooks/useAvatarForm';

import styles from './AvatarForm.module.scss';

type AvatarFormProps = {
  /** 現在のアバター画像のURL */
  avatarUrl: string | null;
};

/**
 * プロフィール設定ページでユーザーアイコン画像を管理するためのUIコンポーネント
 */
export const AvatarForm = ({ avatarUrl }: AvatarFormProps) => {
  const {
    fileInputRef,
    preview,
    isPending,
    handleFileChange,
    handleUpload,
    handleDelete,
    handleReset,
    handleChangeClick,
  } = useAvatarForm();

  // プレビュー画像があればそれを優先的に表示する
  const currentAvatarSrc = preview ?? avatarUrl;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className={styles.container}
    >
      <div className={styles.avatarWrapper}>
        {currentAvatarSrc ? (
          <Image
            src={currentAvatarSrc}
            alt="ユーザーアイコン画像"
            width={128}
            height={128}
            className={styles.avatar}
          />
        ) : (
          <FaUserCircle size={128} className={styles.defaultAvatar} />
        )}
      </div>

      {/* 見た目上は隠されているファイル選択input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
        className={styles.fileInput}
        aria-label="ユーザーアイコン画像を選択"
      />

      <div className={styles.actions}>
        {preview ? (
          <>
            <Button type="button" variant="secondary" onClick={handleReset} disabled={isPending}>
              キャンセル
            </Button>
            <Button type="button" variant="primary" onClick={handleUpload} disabled={isPending}>
              {isPending ? 'アップロード中' : 'この画像に決定'}
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={handleChangeClick}
              disabled={isPending}
            >
              画像を変更
            </Button>
            {avatarUrl && (
              <Button type="button" variant="danger" onClick={handleDelete} disabled={isPending}>
                {isPending ? '削除中...' : '画像を削除'}
              </Button>
            )}
          </>
        )}
      </div>
    </form>
  );
};
