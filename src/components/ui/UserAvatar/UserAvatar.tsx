import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';

import styles from './UserAvatar.module.scss';

type UserAvatarProps = {
  avatarUrl: string | null;
  size: number;
};

export const UserAvatar = ({ avatarUrl, size }: UserAvatarProps) => {
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
