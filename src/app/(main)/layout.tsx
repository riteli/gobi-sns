import React from 'react';

import GlobalHeader from '@/components/layout/GlobalHeader/GlobalHeader';

import styles from './layout.module.scss';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <GlobalHeader />
      <main className={styles.container}>{children}</main>
    </div>
  );
};

export default MainLayout;
