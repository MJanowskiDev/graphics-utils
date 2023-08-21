'use client';

import { AxiosError } from 'axios';
import { AuthError } from '../../types';
import { Alert } from './alert';

interface FeedbackToUserProps {
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  error?: AxiosError<AuthError> | null;
  children?: React.ReactNode;
}

export const FeedbackToUser = ({ isLoading, isError, isSuccess, error, children }: FeedbackToUserProps) => {
  const errorMessage = isError && error ? (error as AxiosError<AuthError>).response?.data.exception.message : '';

  if (isError) {
    return (
      <div>
        <Alert title="Error" message={errorMessage?.toString() || ''} type="error" />
        {children}
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isSuccess) {
    return <Alert title="Success" type="success" />;
  }

  return <>{children}</>;
};
