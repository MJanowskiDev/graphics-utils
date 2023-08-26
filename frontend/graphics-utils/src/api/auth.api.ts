import { API_ENDPOINTS } from './api.config';
import { ERROR_MESSAGES } from './errors/messages';
import { ActivateUserResponse, InitPasswordResetPayload, InitPasswordResetResponse, LoginPayload, LoginResponse } from './types/auth';

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

export const loginUser = async (payload: LoginPayload) => {
  try {
    return (await httpProvider.post<LoginResponse>(AUTH.LOGIN, payload)).data;
  } catch (error) {
    console.error(ERROR_MESSAGES.LOGIN_FAILED, error);
    throw error;
  }
};
