import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // The default bottom-left spot covers the profile button in the workspace sidebar.
  devIndicators: { position: 'bottom-right' },
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
