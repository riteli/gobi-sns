import Link from 'next/link';
import { type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';

import styles from './AppButton.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'accent';
type ButtonSize = 'medium' | 'small';

/** ボタンとリンクで共通する、見た目に関する基本的なProps */
type AppBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** <button>として扱われる場合のPropsの設計図 */
type AppButtonAsButton = AppBaseProps &
  ComponentPropsWithoutRef<'button'> & {
    href?: never;
  };

/** <Link>として扱われる場合のPropsの設計図 */
type AppButtonAsLink = AppBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'type'> & {
    href: string;
  };

/** 上記2つのどちらかの型に一致することを表現するUnion型 */
type AppButtonProps = AppButtonAsButton | AppButtonAsLink;

/** ButtonPropsがどちらの型かを判別する型ガード関数 */
function isLink(props: AppButtonProps): props is AppButtonAsLink {
  return 'href' in props;
}

/**
 * 再利用可能なポリモーフィックボタンコンポーネント
 * hrefプロパティの有無で<button>と<Link>を切り替える
 * primary/secondaryのバリアント、medium/smallのサイズをサポート
 */
const AppButton: FC<AppButtonProps> = (props) => {
  const classNames = `${styles.button} ${styles[props.variant ?? 'primary']} ${styles[props.size ?? 'medium']}`;

  if (isLink(props)) {
    const { children, ...rest } = props;
    return (
      <Link {...rest} className={classNames}>
        {children}
      </Link>
    );
  }

  const { children, ...rest } = props;
  return (
    <button {...rest} className={classNames}>
      {children}
    </button>
  );
};

export default AppButton;
