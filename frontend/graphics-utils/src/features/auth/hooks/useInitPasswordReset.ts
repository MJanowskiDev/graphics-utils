import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { AuthError } from '../types';
import { InitPasswordResetPayload } from '../types';

interface ApiResponse {
  message: string;
}

export const useInitPasswordReset = () => {
  const mutationFn = async ({ email }: InitPasswordResetPayload) => {
    const url = `auth/init-password-reset`;
    const response = await axios.post<ApiResponse>(url, { email });
    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<ApiResponse, AxiosError<AuthError>, InitPasswordResetPayload>(
    mutationFn,
  );
  return { mutate, isLoading, isError, isSuccess, error };
};