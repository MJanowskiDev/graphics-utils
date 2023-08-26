import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { activateUser } from '@/api/auth.api';
import { ActivateUserResponse, ApiError } from '@/api/types';

export const useActivateUser = () => {
  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation<ActivateUserResponse, AxiosError<ApiError>, string | null>(
    activateUser,
  );

  return { mutate, isLoading, isError, isSuccess, error, data };
};
