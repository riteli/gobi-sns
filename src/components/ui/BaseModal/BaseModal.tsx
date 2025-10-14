'use client';

import { type FC, type ReactNode, useEffect, useRef } from 'react';

import styles from './BaseModal.module.scss';

type BaseModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * HTMLの<dialog>要素をラップした、汎用的なモーダルコンポーネント。
 * 親から渡される`isOpen`の状態に応じて、`.showModal()`と`.close()`を副作用として実行する。
 */
const BaseModal: FC<BaseModalProps> = ({ children, isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} onClose={onClose} className={styles.dialog}>
      {children}
    </dialog>
  );
};

export default BaseModal;
