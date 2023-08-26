import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';
import { InitPasswordResetPayload } from '../types';
import { httpProvider } from '@/utils/provider';

interface ApiResponse {
  message: string;
}

export const useInitPasswordReset = () => {
  const mutationFn = async ({ email }: InitPasswordResetPayload) => {
    const url = `auth/init-password-reset`;
    const response = await httpProvider.post<ApiResponse>(url, { email });
    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<ApiResponse, AxiosError<ApiError>, InitPasswordResetPayload>(
    mutationFn,
  );
  return { mutate, isLoading, isError, isSuccess, error };
};