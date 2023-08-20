'use client';

import { RegisterForm } from './RegisterForm';
import { useSearchParams } from 'next/navigation';
import { useRegisterUser } from '../../hooks';
import { FeedbackToUser } from '../FeedbackToUser';

export const RegisterView = () => {
  const token = useSearchParams().get('token');
  const { mutate, isError, isLoading, isSuccess, error } = useRegisterUser();

  return (
    <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error}>
      <RegisterForm submitAction={mutate} />
    </FeedbackToUser>
  );
};
