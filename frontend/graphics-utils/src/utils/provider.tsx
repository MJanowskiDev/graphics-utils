'use client';

import { PropsWithChildren, useState } from 'react';
import axios from 'axios';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarKey, SnackbarProvider, enqueueSnackbar } from 'notistack';

import { AuthProvider } from '@/features/auth/contexts';
import CloseSnackbar from '@/features/ui/notifications/CloseSnackbar';

const httpProvider = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

httpProvider.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401 && error?.response?.data?.path !== '/auth/check-auth') {
      enqueueSnackbar('Authentication error! Please login again.', { variant: 'error' });
    }
    return Promise.reject(error);
  },
);

function Providers({ children }: PropsWithChildren) {
  const [client] = useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <div>
        <SnackbarProvider
          maxSnack={3}
          preventDuplicate
          autoHideDuration={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          hideIconVariant
          action={(key: SnackbarKey) => <CloseSnackbar snackKey={key} />}
        >
          <AuthProvider>{children}</AuthProvider>
        </SnackbarProvider>
      </div>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default Providers;
export { httpProvider };
