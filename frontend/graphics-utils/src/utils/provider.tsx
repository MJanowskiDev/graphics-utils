'use client';

import { PropsWithChildren, useState } from 'react';
import axios from 'axios';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/features/auth/contexts';

const httpProvider = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

function Providers({ children }: PropsWithChildren) {
  const [client] = useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default Providers;
export { httpProvider };
