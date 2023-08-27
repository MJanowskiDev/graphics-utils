import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiError, PasswordResetPayload, PasswordResetResponse } from '@/api/types';
import { passwordReset } from '@/api/auth.api';

export const usePasswordReset = (token: string | null) => {
  const mutationFn = async ({ password }: PasswordResetPayload) => {
    return await passwordReset(token, { password });
  };

  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation<
    PasswordResetResponse,
    AxiosError<ApiError>,
    PasswordResetPayload
  >(mutationFn);
  return { mutate, isLoading, isError, isSuccess, error, data };
};
