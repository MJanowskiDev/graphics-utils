import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { RegisterUserMutationParams } from '../types';

import { ApiError } from '@/types';
import { useAuth } from '@/contexts/auth/auth.context';
import { httpProvider } from '@/contexts/providers';

interface ApiResponse {
  access_token: string;
}

export const useLoginUser = () => {
  const { logIn } = useAuth();
  const mutationFn = async ({ email, password }: RegisterUserMutationParams) => {
    const url = 'auth/sign-in';
    const response = await httpProvider.post<ApiResponse>(url, { email, password });
    logIn();
    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<ApiResponse, AxiosError<ApiError>, RegisterUserMutationParams>(
    mutationFn,
  );

  return { mutate, isLoading, isError, isSuccess, error };
};
