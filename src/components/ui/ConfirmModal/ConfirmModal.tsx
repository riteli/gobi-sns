'use client';

import { type FC, type ReactNode } from 'react';

import AppButton from '@/components/ui/AppButton/AppButton';
import BaseModal from '@/components/ui/BaseModal/BaseModal';

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
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.message}>{children}</div>
        <div className={styles.actions}>
          <AppButton type="button" variant="secondary" onClick={onClose}>
            キャンセル
          </AppButton>
          <AppButton type="button" variant="danger" onClick={onConfirm}>
            OK
          </AppButton>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
