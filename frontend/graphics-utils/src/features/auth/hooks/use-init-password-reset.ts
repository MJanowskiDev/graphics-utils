import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { InitPasswordResetPayload } from '../types';

import { ApiError } from '@/types';
import { httpProvider } from '@/contexts/providers';

interface ApiResponse {
  message: string;
}

export const useInitPasswordReset = () => {
  const mutationFn = async ({ email }: InitPasswordResetPayload) => {
    const url = `auth/init-password-reset`;
    const response = await httpProvider.post<ApiResponse>(url, { email });
    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation<ApiResponse, AxiosError<ApiError>, InitPasswordResetPayload>(
    mutationFn,
  );
  return { mutate, isLoading, isError, isSuccess, error, data };
};
