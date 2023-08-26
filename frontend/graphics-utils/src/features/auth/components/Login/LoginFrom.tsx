'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { RegisterUserMutationParams } from '../../types';
import { LoginFormData, loginFormSchema } from '../../schema';

import { Input, SubmitButton } from '@/features/ui/forms/components';

interface LoginFormProps {
  submitAction: ({ email, password }: RegisterUserMutationParams) => void;
}

export const LoginForm = ({ submitAction }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginFormSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (isValid) {
      const { email, password } = data;
      await submitAction({ email, password });
      reset();
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-6 gap-4">
      <Input<LoginFormData>
        wrappingElementStyle="col-span-6"
        register={register}
        id={'email'}
        label="E-Mail"
        registerOptions={{ required: true }}
        type="email"
        errors={errors}
      />

      <Input<LoginFormData>
        wrappingElementStyle="col-span-6"
        register={register}
        id={'password'}
        label="Password"
        registerOptions={{ required: true }}
        type="password"
        errors={errors}
      />

      <div className="col-span-6">
        <SubmitButton>Login</SubmitButton>
      </div>
    </form>
  );
};
