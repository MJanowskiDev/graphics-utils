'use client';

import Image from 'next/image';
import Link from 'next/link';

import logo from '../../../../public/images/graphics_utils.png';
import { NavbarLink } from './navbar-link';
import { Button } from '../button';

import { useAuth } from '@/contexts/auth/auth.context';
import { useLogoutUser } from '@/features/auth/hooks';

export const Navbar = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const { mutate: logout } = useLogoutUser();

  return (
    <div
      className="sticky bottom-[100vh] flex flex-col md:flex-row gap-y-4 
md:gap-y-0 md:gap-x-6 p-4 justify-between items-center text-[#6c757dff] tracking-wide text-sm"
    >
      <Link href="/">
        <Image src={logo} width={95} height={6} alt="Graphics utils logo" />
      </Link>

      <div>
        {isLoading ? (
          <p className="animate-pulse">Loading... </p>
        ) : isLoggedIn ? (
          <div className="flex gap-2 md:gap-6 flex-wrap">
            <NavbarLink href="/dashboard">Dashboard</NavbarLink>
            <NavbarLink href="/user">Settings</NavbarLink>
            <Button variant="tertiary" size="small" onClick={() => logout()}>
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 md:gap-6">
            <NavbarLink href="/">Home</NavbarLink>
            <div className="flex gap-2 md:gap-6">
              <NavbarLink href="/login">Login</NavbarLink>
              <NavbarLink href="/register">Register</NavbarLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
