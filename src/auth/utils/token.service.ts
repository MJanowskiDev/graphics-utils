import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';

import { UserTokenPayloadDto, ActivateTokenPayloadDto, PasswordResetTokenPayloadDto } from '../dto';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateTokenId(): string {
    return crypto.randomUUID();
  }

  decodeUserToken(token: string): UserTokenPayloadDto {
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (e) {
      throw new BadRequestException('Invalid token');
    }

    const { id, tokenId, role } = decoded;
    if (!id) {
      throw new BadRequestException('Invalid token payload');
    }

    const payloadDto = new UserTokenPayloadDto();
    payloadDto.id = id;
    payloadDto.tokenId = tokenId;
    payloadDto.role = role;

    return payloadDto;
  }

  decodePasswordResetToken(token: string): PasswordResetTokenPayloadDto {
    let decoded: PasswordResetTokenPayloadDto;
    try {
      decoded = this.jwtService.verify(token);
    } catch (e) {
      throw new BadRequestException('Invalid token');
    }

    const { passwordResetToken } = decoded;
    if (!passwordResetToken) {
      throw new BadRequestException('Invalid token payload');
    }

    const payloadDto = new PasswordResetTokenPayloadDto();
    payloadDto.passwordResetToken = passwordResetToken;

    return payloadDto;
  }

  decodeActivateToken(token: string): ActivateTokenPayloadDto {
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (e) {
      throw new BadRequestException('Invalid token');
    }
    if (!decoded?.id) {
      throw new BadRequestException('Invalid token payload');
    }
    const payloadDto = new ActivateTokenPayloadDto();
    payloadDto.id = decoded.id;
    return payloadDto;
  }

  signPayload(payload: object): string {
    return this.jwtService.sign(payload);
  }
}
