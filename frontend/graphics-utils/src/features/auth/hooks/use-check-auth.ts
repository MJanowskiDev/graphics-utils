import { useQuery } from '@tanstack/react-query';

import { checkAuth } from '@/api/auth.api';

interface ApiResponse {
  isAuthenticated: boolean;
}

export const useCheckAuth = (onSuccess?: (isAuthenticated: boolean) => void) => {
  const queryInfo = useQuery<ApiResponse, Error>(['check-auth'], checkAuth, {
    retry: false,
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data.isAuthenticated);
      }
    },
  });

  return {
    isAuthenticated: queryInfo.data?.isAuthenticated || false,
    isLoading: queryInfo.isLoading,
    error: queryInfo.error,
  };
};
