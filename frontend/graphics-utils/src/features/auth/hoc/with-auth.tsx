import { ComponentType, ReactElement, FunctionComponent } from 'react';
import { useAuth } from '@/features/auth/contexts/auth.context';
import { useRouter } from 'next/navigation';

export function withAuth<P>(WrappedComponent: ComponentType<P>): ComponentType<P> {
  const WithAuthComponent: FunctionComponent<P & JSX.IntrinsicAttributes> = (props) => {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    if (!isLoggedIn) {
      return <p>Unauthorized, please log-in</p>;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent as ComponentType<P>;
}
