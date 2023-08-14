import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useInitPasswordReset = () => {
  const mutationFn = (email: string) => {
    const url = `auth/init-password-reset`;
    return axios.post(url, { email });
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation(mutationFn);
  return { mutate, isLoading, isError, isSuccess, error };
};
