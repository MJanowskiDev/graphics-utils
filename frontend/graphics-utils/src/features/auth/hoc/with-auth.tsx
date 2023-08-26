import { ComponentType, FunctionComponent } from 'react';

import { useAuth } from '@/contexts/auth/auth.context';

export function withAuth<P>(WrappedComponent: ComponentType<P>): ComponentType<P> {
  const WithAuthComponent: FunctionComponent<P & JSX.IntrinsicAttributes> = (props) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
      return <p>Unauthorized, please log-in</p>;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent as ComponentType<P>;
}
