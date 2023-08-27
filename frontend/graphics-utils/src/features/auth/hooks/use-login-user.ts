import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { ApiErrorResponse, LoginPayload, LoginResponse } from '@/api/types';
import { useAuth } from '@/contexts/auth/auth.context';
import { loginUser } from '@/api/auth.api';

export const useLoginUser = () => {
  const { logIn } = useAuth();
  const router = useRouter();
  const mutationFn = async ({ email, password }: LoginPayload) => {
    const response = await loginUser({ email, password });
    logIn();
    router.push('/dashboard');
    return response;
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<LoginResponse, ApiErrorResponse, LoginPayload>(mutationFn);

  return { mutate, isLoading, isError, isSuccess, error };
};
