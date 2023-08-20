import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { AuthError, RegisterUserMutationParams } from '../types';
import { useAuth } from '@/features/auth/contexts/auth.context';

interface ApiResponse{
  access_token: string;
}

export const useLoginUser = () => {
  const {setToken} = useAuth();
  const mutationFn = async ({ email, password }: RegisterUserMutationParams) => {
    const url = 'auth/sign-in';
    const response = await axios.post<ApiResponse>(url, { email, password });
    setToken(response.data.access_token);
    return response.data;
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<
    any,
    AxiosError<AuthError>,
    RegisterUserMutationParams
  >(mutationFn);

  return { mutate, isLoading, isError, isSuccess, error };
};
