import React from 'react';
// './globals.scss' を './globals.scss' に修正
import './globals.scss';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
