'use client';

import { useInitPasswordReset } from '../../hooks';
import { InitPasswordResetForm } from './InitPasswordResetForm';
import { FeedbackToUser } from '../FeedbackToUser';

export const InitPasswordResetView = () => {
  const { mutate, isError, isLoading, isSuccess, error } = useInitPasswordReset();

  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} />
      <InitPasswordResetForm submitAction={mutate} />
    </>
  );
};
