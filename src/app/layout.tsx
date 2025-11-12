'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '@/components/providers/supabase-provider';
import { Web3Provider } from '@/context/Web3Context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Decentralized Land Registry',
  description: 'A blockchain-based land registry system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
