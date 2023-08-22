'use client';

import { PasswordChangeForm } from './PasswordChangeForm';
import { usePasswordChange } from '../../hooks';
import { FeedbackToUser } from '../FeedbackToUser';
import { useAuth } from '../../contexts/auth.context';

export const PasswordChangeView = () => {
  const {token} = useAuth();
  const { mutate, isError, isLoading, isSuccess, error } = usePasswordChange(token);

  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} />
      <PasswordChangeForm submitAction={mutate} />
    </>
  );
};
