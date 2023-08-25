'use client';
import Image from 'next/image';
import logo from '../../../../public/images/graphics_utils.png';
import Link from 'next/link';
import { useAuth } from '@/features/auth/contexts/auth.context';
import { NavbarLink } from './NavbarLink';

export const Navbar = () => {
  const { isLoggedIn, isLoading } = useAuth();
  return (
    <div className="sticky bottom-[100vh] flex gap-2 p-4 justify-between text-[#6c757dff] tracking-wide text-sm">
      <div className="mt-0.35">
        <Link href="/">
          <Image src={logo} width={95} height={6} alt="Graphics utils logo" />
        </Link>
      </div>
      {isLoading ? (
        <p className='animate-pulse'>Loading... </p>
      ) : isLoggedIn ? (
        <div className="flex gap-6">
          <NavbarLink href="/logout">Log out</NavbarLink>
          <NavbarLink href="/sse">SSE</NavbarLink>
          <NavbarLink href="/grayscale">To grayscale</NavbarLink>
          <NavbarLink href="/user">User profile</NavbarLink>
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
