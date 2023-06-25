import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UtilsService } from './utils/utils.service';
import { SignInDto, SignUpDto } from './dto';
import { ActivateService } from 'src/email/activate/activate.service';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private utilsService: UtilsService,
    private readonly activateService: ActivateService,
  ) {}

  async signUp({ email, password }: SignUpDto) {
    const hashedPassword = await this.utilsService.hashPassword(password);
    const user = await this.usersService.create(email, hashedPassword);
    if (!user) {
      throw new Error();
    }
    const token = this.jwtService.sign({ id: user.id });
    this.activateService.sendActivationEmail(user, token);
    return omit(user, 'hashedPassword');
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
      user.hashedPassword,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException();
    }
    const payload = { id: user?.id, email: user?.email, role: user?.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
