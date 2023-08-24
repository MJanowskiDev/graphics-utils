'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import axios from 'axios';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuth } from '@/features/auth/contexts/auth.context';
import { IN_PRODUCTION_MODE } from '@/constants';

const httpProvider = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

function Providers({ children }: PropsWithChildren) {
  const { token } = useAuth();
  useEffect(() => {
    const interceptor = httpProvider.interceptors.request.use(
      (config) => {
        if (!IN_PRODUCTION_MODE) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      },
    );

    return () => {
      httpProvider.interceptors.request.eject(interceptor);
    };
  }, [token]);

  const [client] = useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
export { httpProvider };
