import { registerAs } from '@nestjs/config';
export default registerAs('auth', () => ({
  authJwtSecret: process.env.AUTH_JWT_SECRET,
  isPublicKey: process.env.IS_PUBLIC_KEY || 'isPublic',
  passwordSaltOrRounds: 12,
  rolesKey: 'roles',
}));
