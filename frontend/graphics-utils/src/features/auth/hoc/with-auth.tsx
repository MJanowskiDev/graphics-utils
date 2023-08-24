import { ComponentType, ReactElement, FunctionComponent } from 'react';
import { useAuth } from '@/features/auth/contexts/auth.context';
import { useRouter } from 'next/navigation';

export function withAuth<P>(WrappedComponent: ComponentType<P>): ComponentType<P> {
  const WithAuthComponent: FunctionComponent<P & JSX.IntrinsicAttributes> = (props) => {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    if (!isLoggedIn) {
      if (typeof window !== 'undefined') {
        router.push('/login');
        return null;
      } else {
        return <p>Unauthorized</p>;
      }
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent as ComponentType<P>;
}
