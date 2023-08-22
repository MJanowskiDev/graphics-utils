import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { AuthError } from '../types';
import { PasswordChangePayload } from '../types/password-change';

interface ApiResponse {
  message: string;
}

export const usePasswordChange = (token: string | null) => {
  const mutationFn = async ({ currentPassword, newPassword, confirmNewPassword }: PasswordChangePayload) => {
    const url = 'auth/password/change';
    const response = await axios.post<ApiResponse>(
      url,
      { currentPassword, newPassword, confirmNewPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<ApiResponse, AxiosError<AuthError>, PasswordChangePayload>(
    mutationFn,
  );

  return { mutate, isLoading, isError, isSuccess, error };
};
