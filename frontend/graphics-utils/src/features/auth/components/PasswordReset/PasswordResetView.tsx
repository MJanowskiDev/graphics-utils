'use client';

import { useState } from 'react';
import { PasswordResetForm } from './PasswordResetForm';
import { useSearchParams } from 'next/navigation';
import { usePasswordReset } from '../../hooks';
import { AxiosError } from 'axios';
import { AuthError } from '../../types';

export const PasswordResetView = () => {
  const [password, setPassword] = useState('');
  const token = useSearchParams().get('token');
  const { mutate: resetPassword, isError, isLoading, isSuccess, error } = usePasswordReset(token);

  const errorMessage = isError && error ? (error as AxiosError<AuthError>).response?.data.exception.message : '';

  const onSubmit = () => {
    resetPassword(password);
  };

  if (!token) {
    return <div>Invalid token</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error {errorMessage}</div>;
  }

  if (isSuccess) {
    return <div>Success</div>;
  }

  return <PasswordResetForm password={password} setPassword={setPassword} onSubmit={onSubmit} />;
};
