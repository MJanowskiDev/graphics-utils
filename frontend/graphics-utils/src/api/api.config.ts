export const API_ENDPOINTS = {
  AUTH: {
    ACTIVATE: 'auth/activate',
    INIT_PASSWORD_RESET: 'auth/init-password-reset',
    PASSWORD_RESET: (token: string | null) => `auth/execute-password-reset?token=${token}`,
    PASSWORD_CHANGE: 'auth/password/change',
    LOGIN: 'auth/sign-in',
    LOGOUT: 'auth/sign-out',
    REGISTER: 'auth/sign-up',
    CHECK_AUTH: '/auth/check-auth',
  },
};
