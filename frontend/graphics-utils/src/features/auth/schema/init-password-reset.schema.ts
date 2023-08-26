import * as yup from 'yup';

export const initPasswordResetSchema = yup.object({
  email: yup.string().required().email(),
});

export type InitPasswordResetData = yup.InferType<typeof initPasswordResetSchema>;
