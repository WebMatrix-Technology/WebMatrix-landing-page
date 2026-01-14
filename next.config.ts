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
        hostname: 'web-matrix-backend.vercel.app',
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
        destination: 'https://web-matrix-backend.vercel.app/api/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;

