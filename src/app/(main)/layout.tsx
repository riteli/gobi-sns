import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* 将来的に、ヘッダーやナビゲーションバーはここに追加します */}
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
