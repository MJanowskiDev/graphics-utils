import { Footer, Navbar } from '@/features/ui';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/utils/provider';
import { AuthProvider } from '@/features/auth/contexts';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Graphics Utils - AI-Driven Image Processing Tools',
  description: 'Offering a variety of operations, from basic adjustments to advanced, AI-driven transformations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-10% from-black via-slate-900 to-purple-950 font-sans">
              <Navbar />
              <main className="flex-grow flex mx-4">{children}</main>
              <Footer />
            </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
