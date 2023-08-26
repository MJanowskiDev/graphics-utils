import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiError, InitPasswordResetResponse, InitPasswordResetPayload } from '@/api/types';
import { initPasswordReset } from '@/api/auth.api';

export const useInitPasswordReset = () => {
  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation<
    InitPasswordResetResponse,
    AxiosError<ApiError>,
    InitPasswordResetPayload
  >(initPasswordReset);

  return { mutate, isLoading, isError, isSuccess, error, data };
};
