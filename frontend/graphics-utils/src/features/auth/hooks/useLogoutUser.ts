import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { AuthError } from '../types';
import { useAuth } from '@/features/auth/contexts/auth.context';

interface ApiResponse {
  result: string;
  message: string;
}

export const useLogoutUser = () => {
  const { logOut, token, isLoggedIn } = useAuth();
  const mutationFn = async () => {
    if (isLoggedIn) {
      const url = 'auth/sign-out';
      const result = await axios.post<ApiResponse>(url, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logOut();
      return result.data;
    }
    return null;
  };

  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation<any, AxiosError<AuthError>>(mutationFn);

  return { mutate, isLoading, isError, isSuccess, error, data };
};