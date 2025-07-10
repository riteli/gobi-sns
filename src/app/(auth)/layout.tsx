import React from 'react';

import styles from './layout.module.scss';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.container}>{children}</div>;
};

export default AuthLayout;
