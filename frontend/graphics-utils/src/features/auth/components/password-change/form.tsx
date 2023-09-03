'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PasswordChangeData, passwordChangeSchema } from '../../schema';

import { Input, SubmitButton } from '@/shared/ui/forms/components';
import { PasswordChangePayload } from '@/api/types';

interface PasswordChangeFormProps {
  submitAction: ({ currentPassword, newPassword, confirmNewPassword }: PasswordChangePayload) => void;
}

export const PasswordChangeForm = ({ submitAction }: PasswordChangeFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<PasswordChangeData>({
    resolver: yupResolver(passwordChangeSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (isValid) {
      await submitAction({ ...data });
      reset();
    }
  });
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-6 gap-4">
      <Input<PasswordChangeData>
        wrappingElementStyle="col-span-6"
        register={register}
        id={'currentPassword'}
        label="Current password"
        registerOptions={{ required: true }}
        type="password"
        errors={errors}
      />

      <Input<PasswordChangeData>
        wrappingElementStyle="col-span-6"
        register={register}
        id={'newPassword'}
        label="New password"
        registerOptions={{ required: true }}
        type="password"
        errors={errors}
      />

      <Input<PasswordChangeData>
        wrappingElementStyle="col-span-6"
        register={register}
        id={'confirmNewPassword'}
        label="Confirm new password"
        registerOptions={{ required: true }}
        type="password"
        errors={errors}
      />

      <div className="col-span-6">
        <SubmitButton>Change</SubmitButton>
      </div>
    </form>
  );
};
