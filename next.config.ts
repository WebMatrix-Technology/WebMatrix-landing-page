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
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://node-js-backend-amber.vercel.app/api/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;

