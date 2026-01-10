import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WebMatrix - Premium Web Development Studio',
  description: 'We craft fast, beautiful web experiences. From concept to launch—3D, motion, and full-stack that converts.',
  keywords: 'web development, 3D web, motion design, full-stack, web design, React, Next.js',
  authors: [{ name: 'WebMatrix' }],
  openGraph: {
    title: 'WebMatrix - Premium Web Development Studio',
    description: 'We craft fast, beautiful web experiences. 3D, motion, and full-stack that converts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@WebMatrix',
    title: 'WebMatrix - Premium Web Development',
    description: 'Fast, beautiful web experiences with 3D and motion design.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

