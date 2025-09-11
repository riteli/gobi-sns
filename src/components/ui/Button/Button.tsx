import Link from 'next/link';
import { type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';

import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'accent';
type ButtonSize = 'medium' | 'small';

/** ボタンとリンクで共通する、見た目に関する基本的なProps */
type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** <button>として扱われる場合のPropsの設計図 */
type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<'button'> & {
    href?: never;
  };

/** <Link>として扱われる場合のPropsの設計図 */
type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'type'> & {
    href: string;
  };

/** 上記2つのどちらかの型に一致することを表現するUnion型 */
type ButtonProps = ButtonAsButton | ButtonAsLink;

/** ButtonPropsがどちらの型かを判別する型ガード関数 */
function isLink(props: ButtonProps): props is ButtonAsLink {
  return 'href' in props;
}

/**
 * 再利用可能なポリモーフィックボタンコンポーネント
 * hrefプロパティの有無で<button>と<Link>を切り替える
 * primary/secondaryのバリアント、medium/smallのサイズをサポート
 */
const Button: FC<ButtonProps> = (props) => {
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

export default Button;
