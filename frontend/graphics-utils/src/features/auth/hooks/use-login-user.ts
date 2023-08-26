import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiError, LoginPayload, LoginResponse } from '@/api/types';
import { useAuth } from '@/contexts/auth/auth.context';
import { loginUser } from '@/api/auth.api';

export const useLoginUser = () => {
  const { logIn } = useAuth();
  const mutationFn = async ({ email, password }: LoginPayload) => {
    const response = await loginUser({ email, password });
    logIn();
    return response;
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<LoginResponse, AxiosError<ApiError>, LoginPayload>(mutationFn);

  return { mutate, isLoading, isError, isSuccess, error };
};
