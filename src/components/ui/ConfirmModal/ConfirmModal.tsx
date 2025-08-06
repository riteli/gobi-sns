'use client';

import { type FC, type ReactNode } from 'react';

import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal/Modal';

import styles from './ConfirmModal.module.scss';

type ConfirmModalProps = {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルが閉じる時に呼ばれる関数 */
  onClose: () => void;
  /** OKボタンが押された時に呼ばれる関数 */
  onConfirm: () => void;
  /** ダイアログのタイトル */
  title: string;
  /** 確認メッセージなどの本文 */
  children: ReactNode;
};

/**
 * 汎用的な<Modal>を使い、「OK」「キャンセル」の選択肢を持つ確認ダイアログを構築するコンポーネント
 */
const ConfirmModal: FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.message}>{children}</div>
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
