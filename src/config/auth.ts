import { registerAs } from '@nestjs/config';
export default registerAs('auth', () => ({
  authJwtSecret: process.env.AUTH_JWT_SECRET,
}));
