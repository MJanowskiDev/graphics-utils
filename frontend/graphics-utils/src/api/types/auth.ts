export interface ActivateUserResponse {
  message: string;
  result: string;
}

export interface InitPasswordResetResponse {
  message: string;
}

export interface InitPasswordResetPayload {
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
}

export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface PasswordChangeResponse {
  message: string;
}

export interface PasswordResetResponse {
  message: string;
}

export interface PasswordResetPayload {
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface CheckAuthResponse {
  isAuthenticated: boolean;
}
