import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { omit } from 'lodash';

import { User } from '../users/entity';
import { UsersService } from '../users/users.service';
import {
  AccessTokenDto,
  ActivateDto,
  SignInDto,
  SignUpDto,
  UserDto,
} from './dto';
import { PasswordService } from './utils/password.service';
import { TokenService } from './utils/token.service';
import { ActivateService } from '../email/activate/activate.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordsService: PasswordService,
    private activateService: ActivateService,
    private tokenService: TokenService,
  ) {}

  async signUp({ email, password }: SignUpDto): Promise<UserDto> {
    const hashedPassword = await this.passwordsService.hashPassword(password);
    const user = await this.usersService.create(email, hashedPassword);
    if (!user) {
      throw new InternalServerErrorException('User could not be created.');
    }
    const activationToken = this.tokenService.signPayload({
      id: user.id,
    });

    this.activateService.sendActivationEmail(user.email, activationToken);
    return omit(user, 'hashedPassword');
  }

  async activate(token: string): Promise<ActivateDto> {
    let decoded;
    try {
      decoded = this.tokenService.decodeActivateToken(token);
    } catch (e) {
      throw new BadRequestException('Invalid token');
    }

    const { user, wasAlreadyActivated } = await this.usersService.activateById(
      decoded.id,
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (wasAlreadyActivated) {
      return { result: 'success', message: 'User is already activated' };
    }

    this.activateService.sendWelcomeEmail(user.email);
    return { result: 'success', message: 'User activated successfully' };
  }

  async signIn({ email, password }: SignInDto): Promise<AccessTokenDto> {
    const user = await this.usersService.findOneBy(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.activated) {
      throw new UnauthorizedException('Please activate your account first.');
    }

    const passwordMatches = await this.passwordsService.comparePasswords(
      password,
      user.hashedPassword,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    const tokenId = this.tokenService.generateTokenId();
    await this.usersService.updateTokenId(user.id, tokenId);

    return {
      access_token: this.tokenService.signPayload({
        id: user.id,
        role: user.role,
        tokenId,
      }),
    };
  }

  async signOut(token: string) {
    const decoded = this.tokenService.decodeUserToken(token);
    await this.usersService.updateTokenId(decoded.id, null);
    return { result: 'success', message: 'Logged out successfully' };
  }

  async refresh(token: string) {
    const decoded = this.tokenService.decodeUserToken(token);
    const user = await this.findUserAndHandleError(decoded.id);
    const tokenId = this.tokenService.generateTokenId();

    await this.usersService.updateTokenId(user.id, tokenId);
    return {
      access_token: this.tokenService.signPayload({
        id: user.id,
        role: user.role,
        tokenId,
      }),
    };
  }

  async delete(token: string) {
    const decoded = this.tokenService.decodeUserToken(token);
    const user = await this.findUserAndHandleError(decoded.id);
    const deletedEmail = `deleted_at_${Date.now()}__${user.email}`;
    await this.usersService.softDeleteAndUpdateEmail(user.id, deletedEmail);
    return { result: 'success', message: 'User deleted successfully' };
  }

  async initializePasswordReset(email: string): Promise<{ email: string }> {
    //find user by email
    //consider checking if user has already password reset token and if so, just re-send email with token form db
    //if its close to be expired consider sending email with new token
    //generate password reset token
    //create jwt with password reset token and flag: isPasswordResetToken, set expiry date to 1h
    //store password reset token in user table
    //Send email with password reset token
    return { email };
  }

  async executePasswordReset(
    passwordResetToken: string,
    newPassword: string,
  ): Promise<{ passwordResetToken: string; newPassword: string }> {
    //New pasword validation will be taken place at controller decorators level
    //decode jwt passwordResetToken
    //If token expired throw error
    //If token is not password reset token throw error
    //find user with password reset token
    //If no such token in database throw error
    //hash new password
    //update new hashed password in database
    //reset password reset token in database
    //send email to user that password has been changed - just info
    //return success message
    return { passwordResetToken, newPassword };
  }

  private async findUserAndHandleError(userId: string): Promise<User> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.deleted) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
