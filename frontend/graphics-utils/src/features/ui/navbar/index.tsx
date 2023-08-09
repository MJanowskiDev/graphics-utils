import Image from 'next/image';
import logo from '../../../../public/images/graphics_utils_logo.svg';

export const Navbar = () => (
  <div className="sticky bottom-[100vh] flex gap-2 p-4 justify-between text-[#6c757dff] tracking-wide text-sm">
    <div className="mt-0.35">
      <Image src={logo} width={95} height={6} alt="MJanowskiDevLogo" />
    </div>
  </div>
);
