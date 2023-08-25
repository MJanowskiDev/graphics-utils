'use client';

import { PasswordChangeForm } from './PasswordChangeForm';
import { usePasswordChange } from '../../hooks';
import { FeedbackToUser } from '../FeedbackToUser';

export const PasswordChangeView = () => {
  const { mutate, isError, isLoading, isSuccess, error } = usePasswordChange();

  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} />
      <PasswordChangeForm submitAction={mutate} />
    </>
  );
};
