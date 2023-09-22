'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRef } from 'react';

import { Input, SubmitButton } from '@/shared/ui/forms/components';
import { RegisterPayload } from '@/api/types';
import { registerSchema, RegisterSchemData } from '@/features/auth/schema';

interface RegisterFormProps {
  submitAction: ({ email, password }: RegisterPayload) => void;
}

export const RegisterForm = ({ submitAction }: RegisterFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RegisterSchemData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = handleSubmit((data) => {
    if (isValid) {
      const { email, password } = data;
      submitAction({ email, password });
      reset();
    }
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid grid-cols-6 gap-4">
      <Input<RegisterSchemData>
        wrappingElementStyle="col-span-6"
        register={register}
        id={'email'}
        label="E-Mail"
        registerOptions={{ required: true }}
        type="email"
        errors={errors}
      />

      <Input<RegisterSchemData>
        wrappingElementStyle="col-span-6"
        register={register}
        id={'password'}
        label="Password"
        registerOptions={{ required: true }}
        type="password"
        errors={errors}
      />

      <div className="col-span-6">
        <SubmitButton>Register</SubmitButton>
      </div>
    </form>
  );
};
