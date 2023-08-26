'use client';

import { RegisterForm } from './RegisterForm';
import { useRegisterUser } from '../../hooks';
import { FeedbackToUser } from '../FeedbackToUser';

export const RegisterView = () => {
  const { mutate, isError, isLoading, isSuccess, error } = useRegisterUser();

  return (
    <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} successMessage='Please visit email to verify account'>
      <RegisterForm submitAction={mutate} />
    </FeedbackToUser>
  );
};
