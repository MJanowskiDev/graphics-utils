'use client';

import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';

import { ApiError } from '@/api/types';

interface FeedbackToUserProps {
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  error?: AxiosError<ApiError> | null;
  successMessage?: string;
  children?: React.ReactNode;
}

export const FeedbackToUser = ({ isLoading, isError, isSuccess, error, successMessage, children }: FeedbackToUserProps) => {
  const errorMessage = isError && error ? (error as AxiosError<ApiError>).response?.data.exception.message : '';
  if (isError && errorMessage) {
    enqueueSnackbar(errorMessage, { variant: 'error' });
  }

  if (isError && !errorMessage) {
    enqueueSnackbar('Unknown error occurred.', { variant: 'error' });
  }

  if (isSuccess && successMessage) {
    enqueueSnackbar(successMessage, { variant: 'success' });
  }

  if (isLoading) {
    return <div className="animation-pulse">Loading...</div>;
  }

  return <>{children}</>;
};
