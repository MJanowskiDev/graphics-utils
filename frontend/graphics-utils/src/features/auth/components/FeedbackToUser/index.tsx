'use client';

import { AxiosError } from 'axios';
import { ApiError } from '@/types';
import { Alert } from './alert';
import { enqueueSnackbar } from 'notistack';

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
    enqueueSnackbar('Unknown error occured.', { variant: 'error' });
  }

  if (isSuccess && successMessage) {
    enqueueSnackbar(successMessage, { variant: 'success' });
  }

  if (isError) {
    return (
      <div>
        <Alert title="Error" message={errorMessage?.toString() || ''} type="error" />
        {children}
      </div>
    );
  }

  if (isLoading) {
    return <div className="animation-pulse">Loading...</div>;
  }

  return <>{children}</>;
};
