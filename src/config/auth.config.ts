import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { registerAs } from '@nestjs/config';

export class AuthConfigSchema {
  @IsNotEmpty()
  @IsString()
  authJwtSecret: string;

  @IsOptional()
  @IsString()
  isPublicKey: string;

  @IsNotEmpty()
  @IsNumber()
  passwordSaltOrRounds: number;

  @IsNotEmpty()
  @IsString()
  rolesKey: string;

  constructor() {
    this.authJwtSecret = process.env.AUTH_JWT_SECRET as string;
    this.isPublicKey = process.env.IS_PUBLIC_KEY || 'isPublic';
    this.passwordSaltOrRounds = 12;
    this.rolesKey = 'roles';
  }
}

export const authConfig = registerAs('auth', () => new AuthConfigSchema());
