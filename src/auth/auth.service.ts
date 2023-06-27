import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UtilsService } from './utils/utils.service';
import { SignInDto, SignUpDto } from './dto';
import { ActivateService } from 'src/email/activate/activate.service';
import { omit } from 'lodash';

const USER_NOT_FOUND = 'User not found';
const USER_ALREADY_ACTIVATED = 'User is already activated';
const USER_ACTIVATED_SUCCESSFULLY = 'User activated successfully';
const INVALID_TOKEN = 'Invalid token';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private utilsService: UtilsService,
    private readonly activateService: ActivateService,
  ) {}

  async activate(token: string): Promise<{ result: string; message: string }> {
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (e) {
      throw new BadRequestException(INVALID_TOKEN);
    }
    const { user, wasAlreadyActivated } = await this.usersService.activateById(
      decoded.id,
    );

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    if (wasAlreadyActivated) {
      return { result: 'failed', message: USER_ALREADY_ACTIVATED };
    }
    this.activateService.sendWelcomeEmail(user.email);
    return { result: 'success', message: USER_ACTIVATED_SUCCESSFULLY };
  }

  async signUp({ email, password }: SignUpDto) {
    const hashedPassword = await this.utilsService.hashPassword(password);
    const user = await this.usersService.create(email, hashedPassword);
    if (!user) {
      throw new Error();
    }
    const token = this.jwtService.sign({ id: user.id });
    this.activateService.sendActivationEmail(user.email, token);
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
