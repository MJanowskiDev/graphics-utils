'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useLoginUser } from '../../hooks/use-login-user';
import { LoginForm } from './form';
import { FeedbackToUser } from '../feedback-to-user/view';

export const LoginView = () => {
  const { mutate, isError, isLoading, isSuccess, error } = useLoginUser();
  const router = useRouter();
  if (isSuccess) router.push('/dashboard');
  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error}>
        <div className="flex flex-col gap-4 w-[300px]">
          <LoginForm submitAction={mutate} />
          <Link className="text-xs" href="/init-password-reset">
            Forgot password?
          </Link>
        </div>
      </FeedbackToUser>
    </>
  );
};
