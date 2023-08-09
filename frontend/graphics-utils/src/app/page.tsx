import Image from 'next/image';
import logo from '../../public/images/graphics_utils_logo.svg';
import { Footer } from '@/features/ui';

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
      <Footer />
    </main>
  );
}
