'use client';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRef } from 'react';

import { Input, SubmitButton } from '@/shared/ui/forms/components';
import { RegisterPayload } from '@/api/types';

interface RegisterFormProps {
  submitAction: ({ email, password }: RegisterPayload) => void;
}

const registerFormSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
});
export type CheckoutFormData = yup.InferType<typeof registerFormSchema>;

export const RegisterForm = ({ submitAction }: RegisterFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(registerFormSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (isValid) {
      const { email, password } = data;
      await submitAction({ email, password });
      reset();
    }
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid grid-cols-6 gap-4">
      <Input<CheckoutFormData>
        wrappingElementStyle="col-span-6"
        register={register}
        id={'email'}
        label="E-Mail"
        registerOptions={{ required: true }}
        type="email"
        errors={errors}
      />

      <Input<CheckoutFormData>
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
