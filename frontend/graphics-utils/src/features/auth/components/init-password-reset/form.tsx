'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InitPasswordResetData, initPasswordResetSchema } from '../../schema';

import { Input, SubmitButton } from '@/shared/ui/forms/components';
import { InitPasswordResetPayload } from '@/api/types';

interface PasswordResetFormProps {
  submitAction: ({ email }: InitPasswordResetPayload) => void;
}

export const InitPasswordResetForm = ({ submitAction }: PasswordResetFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<InitPasswordResetData>({
    resolver: yupResolver(initPasswordResetSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (isValid) {
      await submitAction({ ...data });
      reset();
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-6 gap-4">
      <Input<InitPasswordResetData>
        wrappingElementStyle="col-span-6"
        register={register}
        id={'email'}
        label="E-Mail"
        registerOptions={{ required: true }}
        type="email"
        errors={errors}
      />
      <div className="col-span-6">
        <SubmitButton>Submit</SubmitButton>
      </div>
    </form>
  );
};
