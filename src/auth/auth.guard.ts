import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

import { Role } from '../core/enums/role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { authJwtSecret, isPublicKey, rolesKey } = this.configService.get('auth');
    const isPublic = this.reflector.getAllAndOverride<boolean>(isPublicKey, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }
    const requiredRole = this.reflector.getAllAndOverride<Role>(rolesKey, [context.getHandler(), context.getClass()]);

    const request = context.switchToHttp().getRequest();

    const token = process.env.NODE_ENV === 'production' ? this.extractTokenFromCookie(request) : this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: authJwtSecret,
      });

      const user = await this.usersService.findOneById(payload.id);

      if (!user || user.tokenId !== payload.tokenId || !user.tokenId) {
        throw new UnauthorizedException();
      }

      return payload?.role ? payload.role === requiredRole : true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies['auth_token'];
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
