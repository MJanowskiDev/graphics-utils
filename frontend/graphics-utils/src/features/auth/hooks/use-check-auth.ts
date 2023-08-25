import { useState, useEffect } from 'react';
import { httpProvider } from '@/utils/provider';

interface ApiResponse {
  isAuthenticated: boolean;
}

interface UseCheckAuth {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: any;
}

export const useCheckAuth = (onSuccess?: (isAuthenticated: boolean) => void): UseCheckAuth => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    httpProvider
      .get<ApiResponse>('/auth/check-auth')
      .then((response) => {
        setData(response.data);
        onSuccess && onSuccess(response.data.isAuthenticated);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [onSuccess]);

  return {
    isAuthenticated: data?.isAuthenticated || false,
    isLoading,
    error,
  };
};
