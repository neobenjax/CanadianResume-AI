import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MapleLeaf Resume - Canadian Resume Builder',
  description: 'Privacy-focused, local-first resume builder tailored for the Canadian job market.',
};

import { AuthProvider } from '@/components/providers/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(jakarta.variable, inter.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased relative">
        <AuthProvider>
          {/* Background Mesh Gradient */}
          <div className="fixed inset-0 z-[-1] bg-subtle-mesh pointer-events-none" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
