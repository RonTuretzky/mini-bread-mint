import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BREAD COOPERATIVE',
  description: 'The future after capital. Bake Bread - Mint and Burn BREAD on Gnosis Chain',
  icons: {
    icon: '/bread-coop-logo.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
