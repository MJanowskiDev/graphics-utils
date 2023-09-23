import * as yup from 'yup';

import { passwordValidationRule } from '@/features/auth/shared/validations';

export const passwordChangeSchema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: passwordValidationRule,
  confirmNewPassword: passwordValidationRule,
});

export type PasswordChangeData = yup.InferType<typeof passwordChangeSchema>;
