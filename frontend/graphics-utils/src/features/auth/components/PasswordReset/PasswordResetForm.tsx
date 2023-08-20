'use client';

import { useForm } from 'react-hook-form';
import { PasswordResetData, passwordResetSchema } from '../../schema';
import { PasswordResetPayload } from '../../types';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, SubmitButton } from '@/features/ui/forms/components';

interface PasswordResetFormProps {
  submitAction: ({ password }: PasswordResetPayload) => void;
}

export const PasswordResetForm = ({ submitAction }: PasswordResetFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<PasswordResetData>({
    resolver: yupResolver(passwordResetSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (isValid) {
      await submitAction({ ...data });
      reset();
    }
  });
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-6 gap-4">
      <Input<PasswordResetData>
        wrappingElementStyle="col-span-6"
        register={register}
        id={'password'}
        label="Password"
        registerOptions={{ required: true }}
        type="password"
        errors={errors}
      />

      <div className="col-span-6">
        <SubmitButton>Set</SubmitButton>
      </div>
    </form>
  );
};
