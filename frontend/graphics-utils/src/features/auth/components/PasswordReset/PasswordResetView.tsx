'use client';

import { PasswordResetForm } from './PasswordResetForm';
import { useSearchParams } from 'next/navigation';
import { usePasswordReset } from '../../hooks';
import { FeedbackToUser } from '../FeedbackToUser';

export const PasswordResetView = () => {
  const token = useSearchParams().get('token');
  const { mutate, isError, isLoading, isSuccess, error } = usePasswordReset(token);

  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} />
      <PasswordResetForm submitAction={mutate} />
    </>
  );
};
