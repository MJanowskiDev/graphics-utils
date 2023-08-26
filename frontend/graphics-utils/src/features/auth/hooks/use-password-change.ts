import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { PasswordChangePayload } from '../types/password-change';

import { ApiError } from '@/types';
import { httpProvider } from '@/utils/provider';

interface ApiResponse {
  message: string;
}

export const usePasswordChange = () => {
  const mutationFn = async ({ currentPassword, newPassword, confirmNewPassword }: PasswordChangePayload) => {
    const url = 'auth/password/change';
    const response = await httpProvider.post<ApiResponse>(url, { currentPassword, newPassword, confirmNewPassword });
    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<ApiResponse, AxiosError<ApiError>, PasswordChangePayload>(
    mutationFn,
  );

  return { mutate, isLoading, isError, isSuccess, error };
};
