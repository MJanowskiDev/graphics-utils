'use client';

import { useSearchParams } from 'next/navigation';
import { FeedbackToUser } from '../FeedbackToUser';
import { useEffect } from 'react';
import { useLogoutUser } from '../../hooks/useLogoutUser';

export const LogoutView = () => {
  const token = useSearchParams().get('token');
  const { mutate, isError, isLoading, isSuccess, error, data } = useLogoutUser();
  useEffect(() => {
    mutate();
  }, []);
  return (
    <>
      <p>{data?.message}</p>
      <FeedbackToUser isLoading={isLoading} isError={isError} error={error} />
    </>
  );
};
