import * as yup from 'yup';

export const passwordChangeSchema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: yup.string().required().min(8),
  confirmNewPassword: yup.string().required().min(8),
});

export type PasswordChangeData = yup.InferType<typeof passwordChangeSchema>;
