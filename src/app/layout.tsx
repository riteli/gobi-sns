import React from 'react';
import { Toaster } from 'react-hot-toast';
import './globals.scss';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
