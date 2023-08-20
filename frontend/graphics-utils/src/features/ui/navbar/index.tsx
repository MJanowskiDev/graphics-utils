'use client';
import Image from 'next/image';
import logo from '../../../../public/images/graphics_utils.png';
import Link from 'next/link';
import { useAuth } from '@/features/auth/contexts/auth.context';
import { NavbarLink } from './NavbarLink';

export const Navbar = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="sticky bottom-[100vh] flex gap-2 p-4 justify-between text-[#6c757dff] tracking-wide text-sm">
      <div className="mt-0.35">
        <Link href="/">
          <Image src={logo} width={95} height={6} alt="Graphics utils logo" />
        </Link>
      </div>
      {isLoggedIn ? (
        <div className="flex gap-6">
          <Link href="/logout">Log out</Link>
          <Link href="/sse">SSE</Link>
        </div>
      ) : (
        <div className="flex gap-6">
          <NavbarLink href="/">Home</NavbarLink>
          <div className="flex gap-6">
            <NavbarLink href="/login">Login</NavbarLink>
            <NavbarLink href="/register">Register</NavbarLink>
          </div>
        </div>
      )}
    </div>
  );
};
