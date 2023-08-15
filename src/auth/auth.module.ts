import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UtilsService } from './utils/utils.service';
import { AuthEmailService } from '../email/auth/auth-email.service';
import { PasswordService } from './utils/password.service';
import { TokenService } from './utils/token.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('auth').authJwtSecret,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
  exports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, UtilsService, AuthEmailService, PasswordService, TokenService],
})
export class AuthModule {}
