import React from 'react';

import Header from '@/components/layout/Header/Header';

import styles from './layout.module.scss';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <main className={styles.container}>{children}</main>
    </div>
  );
};

export default MainLayout;
