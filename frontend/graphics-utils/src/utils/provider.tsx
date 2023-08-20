'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';
import { AuthProvider } from '@/features/auth/contexts';

function Providers({ children }: PropsWithChildren) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          queryFn: async ({ queryKey: [url] }) => {
            if (typeof url === 'string') {
              const { data } = await axios.get(`/${url.toLowerCase()}`);
              return data;
            }
            throw new Error('Invalid QueryKey');
          },
        },
      },
    }),
  );

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
