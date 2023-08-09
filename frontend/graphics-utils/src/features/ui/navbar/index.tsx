import Image from 'next/image';
import logo from '../../../../public/images/graphics_utils.png';
import Link from 'next/link';

export const Navbar = () => (
  <div className="sticky bottom-[100vh] flex gap-2 p-4 justify-between text-[#6c757dff] tracking-wide text-sm">
    <div className="mt-0.35">
      <Link href="/">
        <Image src={logo} width={95} height={6} alt="Graphics utils logo" />
      </Link>
    </div>
  </div>
);
