'use client';

import { useState } from 'react';
import { useInitPasswordReset } from '../../hooks';
import { AxiosError } from 'axios';
import { AuthError } from '../../types';
import { InitPasswordResetForm } from './InitPasswordResetForm';

export const InitPasswordResetView = () => {
  const [email, setEmail] = useState('');
  const { mutate: initPasswordReset, isError, isLoading, isSuccess, error } = useInitPasswordReset();

  const errorMessage = isError && error ? (error as AxiosError<AuthError>).response?.data.exception.message : '';

  const onSubmit = () => {
    initPasswordReset(email);
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error {errorMessage}</div>;
  }

  if (isSuccess) {
    return <div>Success</div>;
  }

  return <InitPasswordResetForm email={email} setEmail={setEmail} onSubmit={onSubmit} />;
};
