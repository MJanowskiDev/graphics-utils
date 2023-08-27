import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/auth/auth.context';
import { logoutUser } from '@/api/auth.api';
import { ApiErrorResponse } from '@/api/types';

export const useLogoutUser = () => {
  const { logOut, isLoggedIn } = useAuth();
  const router = useRouter();

  const mutationFn = async () => {
    logOut();
    router.push('/');
    enqueueSnackbar('Logged out successfully', { variant: 'success' });

    if (isLoggedIn) {
      logoutUser();
    }
  };

  const { mutate } = useMutation<void, ApiErrorResponse, void>(mutationFn);
  return { mutate };
};
