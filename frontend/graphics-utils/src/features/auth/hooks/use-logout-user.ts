import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/auth.context';
import { httpProvider } from '@/utils/provider';

import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';

export const useLogoutUser = () => {
  const { logOut, isLoggedIn } = useAuth();
  const router = useRouter();

  const mutationFn = async () => {
    logOut();
    router.push('/');
    enqueueSnackbar('Logged out successfully', { variant: 'success' });

    if (isLoggedIn) {
      const url = 'auth/sign-out';
      const result = await httpProvider.post(url, null);
      return result.data;
    }
  };

  const { mutate } = useMutation(mutationFn);
  return { mutate };
};
