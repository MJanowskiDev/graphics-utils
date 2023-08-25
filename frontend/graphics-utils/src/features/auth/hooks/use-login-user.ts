import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AuthError, RegisterUserMutationParams } from '../types';
import { useAuth } from '@/features/auth/contexts/auth.context';
import { httpProvider } from '@/utils/provider';

interface ApiResponse{
  access_token: string;
}

export const useLoginUser = () => {
  const {logIn} = useAuth();
  const mutationFn = async ({ email, password }: RegisterUserMutationParams) => {
    const url = 'auth/sign-in';
    const response = await httpProvider.post<ApiResponse>(url, { email, password });
    logIn();
    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<
    ApiResponse,
    AxiosError<AuthError>,
    RegisterUserMutationParams
  >(mutationFn);

  return { mutate, isLoading, isError, isSuccess, error };
};
