import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { RegisterUserMutationParams } from '../types';

import { ApiError } from '@/api/types';
import { httpProvider } from '@/contexts/providers';

interface ApiResponse {
  activated: string;
}

export const useRegisterUser = () => {
  const mutationFn = async ({ email, password }: RegisterUserMutationParams) => {
    const url = 'auth/sign-up';
    const response = await httpProvider.post<ApiResponse>(url, { email, password });
    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<ApiResponse, AxiosError<ApiError>, RegisterUserMutationParams>(
    mutationFn,
  );
  return { mutate, isLoading, isError, isSuccess, error };
};
