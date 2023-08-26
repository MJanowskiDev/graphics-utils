'use client';

import { RegisterForm } from './form';
import { useRegisterUser } from '../../hooks';
import { FeedbackToUser } from '../feedback-to-user/view';

export const RegisterView = () => {
  const { mutate, isError, isLoading, isSuccess, error } = useRegisterUser();

  return (
    <FeedbackToUser
      isLoading={isLoading}
      isError={isError}
      isSuccess={isSuccess}
      error={error}
      successMessage="Please visit email to verify account"
    >
      <RegisterForm submitAction={mutate} />
    </FeedbackToUser>
  );
};
