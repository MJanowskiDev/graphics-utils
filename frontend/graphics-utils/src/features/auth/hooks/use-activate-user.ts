import { useMutation } from '@tanstack/react-query';

import { activateUser } from '@/api/auth.api';
import { ActivateUserResponse, ApiErrorResponse } from '@/api/types';

export const useActivateUser = () => {
  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation<ActivateUserResponse, ApiErrorResponse, string | null>(
    activateUser,
  );

  return { mutate, isLoading, isError, isSuccess, error, data };
};
