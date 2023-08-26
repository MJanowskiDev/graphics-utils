'use client';

import { useInitPasswordReset } from '../../hooks';
import { InitPasswordResetForm } from './form';
import { FeedbackToUser } from '../feedback-to-user/view';

export const InitPasswordResetView = () => {
  const { mutate, isError, isLoading, isSuccess, error, data } = useInitPasswordReset();

  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} successMessage={data?.message} />
      <InitPasswordResetForm submitAction={mutate} />
    </>
  );
};
