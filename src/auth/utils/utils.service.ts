import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {
  constructor(private configService: ConfigService) {}

  async hashPassword(password: string) {
    const { passwordSaltOrRounds } = this.configService.get('auth');
    return await bcrypt.hash(password, passwordSaltOrRounds);
  }

  comparePasswords(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
