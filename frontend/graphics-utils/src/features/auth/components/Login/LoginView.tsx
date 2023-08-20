'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLoginUser } from '../../hooks/useLoginUser';
import { LoginForm } from './LoginFrom';
import { FeedbackToUser } from '../FeedbackToUser';

export const LoginView = () => {
  const token = useSearchParams().get('token');
  const { mutate, isError, isLoading, isSuccess, error } = useLoginUser();
  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} />
      <LoginForm submitAction={mutate} />
      <Link href="/init-password-reset">Forgot password?</Link>
    </>
  );
};
