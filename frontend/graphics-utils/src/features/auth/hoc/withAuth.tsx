'use client';
import { useAuth } from '@/features/auth/contexts/auth.context';
import { useRouter } from 'next/navigation';
import { ComponentType, ReactElement, JSX } from 'react';

export function withAuth<P extends JSX.IntrinsicAttributes>(WrappedComponent: ComponentType<P>): ComponentType<P> {
  return function WithAuthComponent(props: P): ReactElement | null {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    if (!isLoggedIn) {
      router.push('/login');
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
