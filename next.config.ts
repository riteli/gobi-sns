import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  sassOptions: {
    additionalData: (
      content: string,
      loaderContext: { resourcePath: string; rootContext: string },
    ) => {
      const { resourcePath, rootContext } = loaderContext;

      const stylesPath = 'src/styles/variables';
      const absoluteCSSPath = path.join(rootContext, stylesPath);

      const relativePath = path.relative(path.dirname(resourcePath), absoluteCSSPath);

      const unixRelativePath = relativePath.replace(/\\/g, '/');

      return `@use "${unixRelativePath}" as *;\n${content}`;
    },
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
