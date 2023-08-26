import Image from 'next/image';

import logo from '../../public/images/graphics_utils.png';

export default function Home() {
  return (
    <section className="flex flex-grow  justify-center items-center">
      <div className="flex  sm:gap-12 gap-10 flex-wrap px-4 items-center justify-center ">
        <div className="w-[320px]">
          <Image src={logo} width={320} height={47} alt="Graphics Utils Logo" />
        </div>
        <div className="sm:text-left text-center">
          <h1 className="text-2xl max-w-lg font-bold sm:mb-6 mb-10 text-white tracking-tight">Image processing tools</h1>
          <p className="text-gray-300 tracking-wide">
            Offering a variety of operations, from basic adjustments to advanced,{' '}
            <span className="font-bold text-purple-500">AI-driven</span> transformations.
          </p>
          <p className=" text-gray-300 sm:mt-1 mt-4">Stay tuned for our launch!</p>
        </div>
      </div>
    </section>
  );
}
