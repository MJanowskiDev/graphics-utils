'use client';

import { FeedbackToUser } from '../FeedbackToUser';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useActivateUser } from '../../hooks';
import Link from 'next/link';

export const ActivateView = () => {
  const token = useSearchParams().get('token');
  const { mutate, isError, isLoading, isSuccess, error, data } = useActivateUser();

  useEffect(() => {
    mutate(token);
  }, []);

  return (
    <>
      <FeedbackToUser
        isLoading={isLoading}
        isError={isError}
        isSuccess={isSuccess}
        error={error}
        successMessage={data?.message}
      ></FeedbackToUser>
      <Link className="mt-2 rounded-lg bg-purple-600 text-white text-center text-md p-2.5" href="/login">
        Go to Login
      </Link>
    </>
  );
};
