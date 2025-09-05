import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';

import styles from './Avatar.module.scss';

type AvatarProps = {
  avatarUrl: string | null;
  size: number;
};

export const Avatar = ({ avatarUrl, size }: AvatarProps) => {
  return (
    <div className={styles.avatarWrapper} style={{ width: size, height: size }}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="アバター画像"
          width={size}
          height={size}
          className={styles.avatar}
        />
      ) : (
        <FaUserCircle size={size} className={styles.defaultAvatar} />
      )}
    </div>
  );
};
