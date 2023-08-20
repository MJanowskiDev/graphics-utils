import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { RegisterUserMutationParams } from '../types';

export const useRegisterUser = () => {
  const mutationFn = ({ email, password }: RegisterUserMutationParams) => {
    const url = 'auth/sign-up';
    return axios.post(url, { email, password });
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation(mutationFn);
  return { mutate, isLoading, isError, isSuccess, error };
};
