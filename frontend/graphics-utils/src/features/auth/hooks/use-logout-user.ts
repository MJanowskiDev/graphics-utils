import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiError } from '@/types';
import { useAuth } from '@/features/auth/contexts/auth.context';
import { httpProvider } from '@/utils/provider';

interface ApiResponse {
  result: string;
  message: string;
}

export const useLogoutUser = () => {
  const { logOut, isLoggedIn } = useAuth();
  const mutationFn = async () => {
    if (isLoggedIn) {
      const url = 'auth/sign-out';
      const result = await httpProvider.post<ApiResponse>(url, null);
      logOut();
      return result.data;
    }
    return null;
  };

  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation<any, AxiosError<ApiError>>(mutationFn);
  return { mutate, isLoading, isError, isSuccess, error, data };
};
