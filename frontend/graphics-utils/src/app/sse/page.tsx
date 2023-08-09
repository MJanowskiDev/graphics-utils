import Image from 'next/image';
import Link from 'next/link';

import logo from '../../../public/images/graphics_utils_logo.svg';
import author from '../../../public/images/mjanowskidev.png';
import SSE from '../../features/sse';
import { Footer, Navbar } from '@/features/ui';

export default function SSEPage() {
  return (
    <main className="flex flex-col items-stretch  min-h-screen bg-gradient-to-b from-10% from-black via-slate-900 to-purple-950 font-sans">
      <Navbar />
      <SSE />
      <Footer />
    </main>
  );
}
