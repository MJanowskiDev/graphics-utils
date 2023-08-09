import Image from 'next/image';
import Link from 'next/link';
import author from '../../../../public/images/mjanowskidev.png';

export const Footer = () => (
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
);
