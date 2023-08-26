import Image from 'next/image';
import Link from 'next/link';

import author from '../../../../public/images/mjanowskidev.png';

export const Footer = () => (
  <div className="sticky top-[100vh] flex gap-2 p-4 justify-end items-center text-[#6c757dff] tracking-wide text-sm">
    <p>Created by</p>
    <Link href="https://mjanowski.dev" target="_blank" rel="noopener noreferrer">
      <div className="mt-0.35">
        <Image src={author} width={95} height={6} alt="MJanowskiDevLogo" />
      </div>
    </Link>
  </div>
);
