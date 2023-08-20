import * as yup from 'yup';

export const loginFormSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
});

export type LoginFormData = yup.InferType<typeof loginFormSchema>;
