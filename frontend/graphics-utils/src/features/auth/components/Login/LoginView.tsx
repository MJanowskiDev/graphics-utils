'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLoginUser } from '../../hooks/use-login-user';
import { LoginForm } from './LoginFrom';
import { FeedbackToUser } from '../FeedbackToUser';

export const LoginView = () => {
  const token = useSearchParams().get('token');
  const { mutate, isError, isLoading, isSuccess, error } = useLoginUser();
  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error}>
        <div className='flex flex-col gap-4 w-[300px]'>
          <LoginForm submitAction={mutate} />
          <Link className='text-xs' href="/init-password-reset">Forgot password?</Link>
        </div>
      </FeedbackToUser>
    </>
  );
};
