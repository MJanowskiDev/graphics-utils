import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const usePasswordReset = (token: string | null) => {
  const mutationFn = (password: string) => {
    const url = `auth/execute-password-reset?token=${token}`;
    return axios.post(url, { password });
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation(mutationFn);
  return { mutate, isLoading, isError, isSuccess, error };
};
