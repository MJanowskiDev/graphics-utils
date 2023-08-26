import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PasswordResetPayload } from '../types';
import { ApiError } from '@/types';
import { httpProvider } from '@/utils/provider';

interface ApiResponse {
  message: string;
}

export const usePasswordReset = (token: string | null) => {
  const mutationFn = async ({ password }: PasswordResetPayload) => {
    const url = `auth/execute-password-reset?token=${token}`;
    const response = await httpProvider.post<ApiResponse>(url, { password });
    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation<ApiResponse, AxiosError<ApiError>, PasswordResetPayload>(
    mutationFn,
  );
  return { mutate, isLoading, isError, isSuccess, error, data };
};
