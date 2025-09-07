'use client';

import { useEffect, useState } from 'react';

import styles from './ClientFormattedTime.module.scss';

type ClientFormattedTimeProps = {
  dateString: string;
};

/**
 * サーバーとクライアントの日時フォーマットの差異による
 * Hydration Errorを防ぐためのクライアントコンポーネント
 */
export const ClientFormattedTime = ({ dateString }: ClientFormattedTimeProps) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(dateString).toLocaleString());
  }, [dateString]);

  if (!formattedDate) {
    return null;
  }

  return (
    <time dateTime={dateString} className={styles.time}>
      {formattedDate}
    </time>
  );
};
