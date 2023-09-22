import * as yup from 'yup';

import { passwordValidationRule } from '@/features/auth/shared/validations';

export const registerSchema = yup.object({
  email: yup.string().required().email(),
  password: passwordValidationRule,
});

export type RegisterSchemData = yup.InferType<typeof registerSchema>;
