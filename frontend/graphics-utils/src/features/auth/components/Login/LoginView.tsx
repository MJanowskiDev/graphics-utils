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
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error}>
        <div className='flex flex-col gap-4'>
          <LoginForm submitAction={mutate} />
          <Link className='text-xs' href="/init-password-reset">Forgot password?</Link>
        </div>
      </FeedbackToUser>
    </>
  );
};
