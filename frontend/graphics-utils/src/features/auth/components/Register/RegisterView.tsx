'use client';

import { useState } from 'react';
import { RegisterForm } from './RegisterForm';
import { useSearchParams } from 'next/navigation';
import { useRegisterUser } from '../../hooks';
import { AxiosError } from 'axios';
import { AuthError } from '../../types';

export const RegisterView = () => {
  const token = useSearchParams().get('token');
  const { mutate, isError, isLoading, isSuccess, error } = useRegisterUser();

  const errorMessage = isError && error ? (error as AxiosError<AuthError>).response?.data.exception.message : '';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error {errorMessage}</div>;
  }

  if (isSuccess) {
    return <div>Success</div>;
  }

  return <RegisterForm submitAction={mutate} />;
};
