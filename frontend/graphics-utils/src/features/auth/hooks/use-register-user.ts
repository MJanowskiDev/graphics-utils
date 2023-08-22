import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { AuthError, RegisterUserMutationParams } from '../types';

interface ApiResponse {
  activated: string;
}

export const useRegisterUser = () => {
  const mutationFn = async ({ email, password }: RegisterUserMutationParams) => {
    const url = 'auth/sign-up';
    const response = await axios.post<ApiResponse>(url, { email, password });
    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<ApiResponse, AxiosError<AuthError>, RegisterUserMutationParams>(
    mutationFn,
  );
  return { mutate, isLoading, isError, isSuccess, error };
};
