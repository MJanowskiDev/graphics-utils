'use client';

import { FeedbackToUser } from '../FeedbackToUser';
import { useEffect } from 'react';
import { useLogoutUser } from '../../hooks/useLogoutUser';

export const LogoutView = () => {
  const { mutate, isError, isLoading, isSuccess, error } = useLogoutUser();
  useEffect(() => {
    mutate();
  }, []);
  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} />
    </>
  );
};
