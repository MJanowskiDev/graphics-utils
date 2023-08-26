import './globals.css';
import { Inter } from 'next/font/google';

import { Footer, Navbar } from '@/features/ui';
import Providers from '@/utils/provider';
import { DefaultMetatags } from '@/features/metatags';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DefaultMetatags />
        <Providers>
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-10% from-black via-slate-900 to-purple-950 font-sans">
            <Navbar />
            <main className="flex-grow flex mx-4">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
