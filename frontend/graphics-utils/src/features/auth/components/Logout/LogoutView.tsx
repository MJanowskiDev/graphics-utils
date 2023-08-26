'use client';

import { FeedbackToUser } from '../FeedbackToUser';
import { useEffect } from 'react';
import { useLogoutUser } from '../../hooks/use-logout-user';
import { useAuth } from '../../contexts/auth.context';

export const LogoutView = () => {
  const { mutate, isError, isLoading, isSuccess, error } = useLogoutUser();
  const {logOut} = useAuth();
  useEffect(() => {
    mutate();
    logOut();
  }, []);
  return (
    <>
      <FeedbackToUser isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} successMessage='Logged out' />
    </>
  );
};
