import * as yup from 'yup';

import { passwordValidationRule } from '@/features/auth/shared/validations';

export const passwordResetSchema = yup.object({
  password: passwordValidationRule,
});

export type PasswordResetData = yup.InferType<typeof passwordResetSchema>;
