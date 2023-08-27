import { useMutation } from '@tanstack/react-query';

import { ApiErrorResponse, PasswordChangePayload, PasswordChangeResponse } from '@/api/types';
import { passwordChange } from '@/api/auth.api';

export const usePasswordChange = () => {
  const { mutate, isLoading, isError, isSuccess, error } = useMutation<PasswordChangeResponse, ApiErrorResponse, PasswordChangePayload>(
    passwordChange,
  );

  return { mutate, isLoading, isError, isSuccess, error };
};
