import { type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';

import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'medium' | 'small';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ComponentPropsWithoutRef<'button'>;

/**
 * 再利用可能なボタンコンポーネント
 * primary/secondaryのバリアント、medium/smallのサイズをサポート
 */
const Button: FC<ButtonProps> = ({ children, variant = 'primary', size = 'medium', ...rest }) => {
  return (
    <button className={`${styles.button} ${styles[variant]} ${styles[size]}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
