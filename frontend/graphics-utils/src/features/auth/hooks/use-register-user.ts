import { useMutation } from '@tanstack/react-query';

import { ApiErrorResponse, RegisterPayload } from '@/api/types';
import { registerUser } from '@/api/auth.api';

export const useRegisterUser = () => {
  const { mutate, isLoading, isError, isSuccess, error } = useMutation<void, ApiErrorResponse, RegisterPayload>(registerUser);
  return { mutate, isLoading, isError, isSuccess, error };
};
