import * as yup from 'yup';

export const passwordResetSchema = yup.object({
  password: yup.string().required().min(8),
});

export type PasswordResetData = yup.InferType<typeof passwordResetSchema>;
