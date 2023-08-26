import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';
import { httpProvider } from '@/utils/provider';

interface ApiResponse {
  message: string;
  result: string;
}

export const useActivateUser = () => {
  const mutationFn = async (activationToken: string | null) => {
    if (!activationToken) throw new Error('No activation token provided');

    const url = `auth/activate`;
    const response = await httpProvider.post<ApiResponse>(url, null, { params: { token: activationToken } });

    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation<ApiResponse, AxiosError<ApiError>, string | null>(mutationFn);

  return { mutate, isLoading, isError, isSuccess, error, data };
};
