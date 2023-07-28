import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';

import { User } from '../../users/entity';
import { Role } from '../../core/enums/role.enum';

type TokenPayload = Pick<User, 'id' | 'tokenId' | 'role'>;

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateTokenId(): string {
    return crypto.randomUUID();
  }

  decodeToken(token: string): TokenPayload {
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (e) {
      throw new BadRequestException('Invalid token');
    }
    return decoded;
  }

  generatePayload(id: string, role: Role, tokenId: string): TokenPayload {
    return {
      id,
      role,
      tokenId,
    };
  }

  signPayload(payload: { id: string }): string {
    return this.jwtService.sign(payload);
  }
}
