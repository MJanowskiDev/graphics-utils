import Image from 'next/image';
import Link from 'next/link';

import logo from '../../public/images/graphics_utils_logo.svg';
import author from '../../public/images/mjanowskidev.png';
import SSE from './features/sse';

export default function Home() {
  return (
    <main className="flex flex-col items-stretch justify-center min-h-screen bg-gradient-to-b from-10% from-black via-slate-900 to-purple-950 font-sans">
      <section className="flex flex-row flex-wrap sm:gap-12 gap-10 justify-center items-center ">
        <div className="w-[320px]">
          <Image src={logo} width={320} height={47} alt="Graphics Utils Logo" />
        </div>
        <div className="sm:text-left text-center">
          <h1 className="text-2xl max-w-lg font-bold sm:mb-6 mb-10 text-white tracking-tight">
            Image processing tools
          </h1>
          <p className="text-gray-300 tracking-wide">
            Offering a variety of operations, from basic adjustments to
            advanced,{' '}
            <span className="font-bold text-purple-500">AI-driven</span>{' '}
            transformations.
          </p>
          <p className=" text-gray-300 sm:mt-1 mt-4">
            Stay tuned for our launch!
          </p>
        </div>
      </section>
      <SSE />
      <div className="sticky top-[100vh] flex gap-2 p-4 justify-between text-[#6c757dff] tracking-wide text-sm">
        <div className="flex items-center gap-2">
          <p>Created by</p>
          <div className="mt-0.35">
            <Image src={author} width={95} height={6} alt="MJanowskiDevLogo" />
          </div>
        </div>

        <Link
          href="https://mjanowski.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Homepage
        </Link>
      </div>
    </main>
  );
}
