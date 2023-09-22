import * as yup from 'yup';

export const passwordValidationRule = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters long')
  .matches(/[A-Za-z]/, 'Password must contain at least one letter')
  .matches(/\d/, 'Password must contain at least one number')
  .matches(/[@$!%*#?&]/, 'Password must contain at least one special character')
  .max(50, 'Password cannot exceed 50 characters');
