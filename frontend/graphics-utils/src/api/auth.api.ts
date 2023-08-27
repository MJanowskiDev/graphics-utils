import { API_ENDPOINTS } from './api.config';
import { ERROR_MESSAGES } from './errors/messages';
import {
  ActivateUserResponse,
  CheckAuthResponse,
  InitPasswordResetPayload,
  InitPasswordResetResponse,
  LoginPayload,
  LoginResponse,
  PasswordChangePayload,
  PasswordChangeResponse,
  PasswordResetPayload,
  PasswordResetResponse,
  RegisterPayload,
} from './types/auth';

import { httpProvider } from '@/contexts/providers';

const { AUTH } = API_ENDPOINTS;

export const activateUser = async (activationToken: string | null): Promise<ActivateUserResponse> => {
  try {
    if (!activationToken) {
      throw new Error(ERROR_MESSAGES.MISSING_ACTIVATION_TOKEN);
    }
    return (await httpProvider.post<ActivateUserResponse>(AUTH.ACTIVATE, null, { params: { token: activationToken } })).data;
  } catch (error) {
    console.error(ERROR_MESSAGES.ACTIVATION_FAILED, error);
    throw error;
  }
};

export const initPasswordReset = async (payload: InitPasswordResetPayload) => {
  try {
    return (await httpProvider.post<InitPasswordResetResponse>(AUTH.INIT_PASSWORD_RESET, payload)).data;
  } catch (error) {
    console.error(ERROR_MESSAGES.ACTIVATION_FAILED, error);
    throw error;
  }
};

export const passwordReset = async (token: string | null, payload: PasswordResetPayload) => {
  try {
    return (await httpProvider.post<PasswordResetResponse>(AUTH.PASSWORD_RESET(token), payload)).data;
  } catch (error) {
    console.error(ERROR_MESSAGES.PASSWORD_RESET_FAILED, error);
    throw error;
  }
};

export const passwordChange = async (payload: PasswordChangePayload) => {
  try {
    return (await httpProvider.post<PasswordChangeResponse>(AUTH.PASSWORD_CHANGE, payload)).data;
  } catch (error) {
    console.error(ERROR_MESSAGES.PASSWORD_CHANGE_FAILED, error);
    throw error;
  }
};

export const registerUser = async (payload: RegisterPayload) => {
  try {
    await httpProvider.post<void>(AUTH.REGISTER, payload);
  } catch (error) {
    console.error(ERROR_MESSAGES.REGISTRATION_FAILED, error);
    throw error;
  }
};

export const loginUser = async (payload: LoginPayload) => {
  try {
    return (await httpProvider.post<LoginResponse>(AUTH.LOGIN, payload)).data;
  } catch (error) {
    console.error(ERROR_MESSAGES.LOGIN_FAILED, error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await httpProvider.post<void>(AUTH.LOGOUT);
  } catch (error) {
    console.error(ERROR_MESSAGES.LOGOUT_FAILED, error);
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    return (await httpProvider.get<CheckAuthResponse>(AUTH.CHECK_AUTH)).data;
  } catch (error) {
    console.error(ERROR_MESSAGES.AUTH_CHECK_FAILED, error);
    throw error;
  }
};
