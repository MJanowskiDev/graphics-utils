'use client';

import { useSearchParams } from 'next/navigation';

import { PasswordResetForm } from './PasswordResetForm';
import { usePasswordReset } from '../../hooks';
import { FeedbackToUser } from '../FeedbackToUser';

export const PasswordResetView = () => {
  const token = useSearchParams().get('token');
  const { mutate, isError, isLoading, isSuccess, error, data } = usePasswordReset(token);

  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} successMessage={data?.message} />
      <PasswordResetForm submitAction={mutate} />
    </>
  );
};
