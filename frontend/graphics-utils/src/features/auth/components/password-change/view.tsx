'use client';

import { PasswordChangeForm } from './form';
import { usePasswordChange } from '../../hooks';
import { FeedbackToUser } from '../feedback-to-user/view';

export const PasswordChangeView = () => {
  const { mutate, isError, isLoading, isSuccess, error } = usePasswordChange();

  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} />
      <PasswordChangeForm submitAction={mutate} />
    </>
  );
};
