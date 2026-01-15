import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'node-js-backend-amber.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'vlpxvcrzraenqjppoeom.supabase.co',
      },
    ],
  },

};

export default nextConfig;

