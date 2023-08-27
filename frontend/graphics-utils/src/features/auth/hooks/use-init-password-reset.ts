import { useMutation } from '@tanstack/react-query';

import { InitPasswordResetResponse, InitPasswordResetPayload, ApiErrorResponse } from '@/api/types';
import { initPasswordReset } from '@/api/auth.api';

export const useInitPasswordReset = () => {
  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation<
    InitPasswordResetResponse,
    ApiErrorResponse,
    InitPasswordResetPayload
  >(initPasswordReset);

  return { mutate, isLoading, isError, isSuccess, error, data };
};
