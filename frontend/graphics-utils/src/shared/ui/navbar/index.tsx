'use client';

import { Nav } from './nav';

import { useAuth } from '@/contexts/auth/auth.context';
import { useLogoutUser } from '@/features/auth/hooks';

export const Navbar = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const { mutate: logout } = useLogoutUser();

  return <Nav isLoggedIn={isLoggedIn} isLoading={isLoading} logout={logout} />;
};
