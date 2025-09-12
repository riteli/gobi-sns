import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src')],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oupsczyuzosdtoilsmbc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatars/**',
      },
    ],
  },
};

export default nextConfig;
