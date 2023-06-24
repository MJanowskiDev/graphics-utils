import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UtilsService } from './utils/utils.service';
import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private utilsService: UtilsService,
  ) {}

  async signUp({ email, password }: SignUpDto) {
    const hashedPassword = await this.utilsService.hashPassword(password);
    return this.usersService.create(email, hashedPassword);
  }

  async signIn({
    email,
    password,
  }: SignInDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneBy(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordMatches = this.utilsService.comparePasswords(
      password,
      user?.hashedPassword,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException();
    }
    const payload = { id: user?.id, mail: user?.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
