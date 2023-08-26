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

export interface RegisterPayload {
  email: string;
  password: string;
}
