import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { omit } from 'lodash';

import { User } from '../users/entity';
import { UsersService } from '../users/users.service';
import { AccessTokenDto, ActivateDto, ChangePasswordDto, InitializePasswordResetDto, SignInDto, SignUpDto, UserDto } from './dto';
import { PasswordService } from './utils/password.service';
import { TokenService } from './utils/token.service';
import { AuthEmailService } from '../email/auth/auth-email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordsService: PasswordService,
    private authEmailService: AuthEmailService,
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

    this.authEmailService.sendActivationEmail(user.email, activationToken);
    return omit(user, 'hashedPassword', 'passwordResetToken');
  }

  async activate(token: string): Promise<ActivateDto> {
    let decoded;
    try {
      decoded = this.tokenService.decodeActivateToken(token);
    } catch (e) {
      throw new BadRequestException('Invalid token');
    }

    const { user, wasAlreadyActivated } = await this.usersService.activateById(decoded.id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (wasAlreadyActivated) {
      return { result: 'success', message: 'User is already activated' };
    }

    this.authEmailService.sendWelcomeEmail(user.email);
    return { result: 'success', message: 'User activated successfully' };
  }

  async signIn({ email, password }: SignInDto): Promise<AccessTokenDto> {
    const user = await this.usersService.findOneBy(email);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    if (!user.activated) {
      throw new UnauthorizedException('Please activate your account first.');
    }

    const passwordMatches = await this.passwordsService.comparePasswords(password, user.hashedPassword);
    if (!passwordMatches) {
      throw new UnauthorizedException('Wrong password');
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

  async initializePasswordReset(initializeDto: InitializePasswordResetDto): Promise<any> {
    const user = await this.usersService.findOneBy(initializeDto.email);
    if (!user) {
      throw new NotFoundException('User with specified email address is not existing');
    }

    const passwordResetToken = this.tokenService.generateTokenId();
    //override default config, TIME to expire?
    const passwordResetTokenJwt = this.tokenService.signPayload({ passwordResetToken });
    await this.usersService.updatePasswordResetToken(passwordResetToken, user.id);
    await this.authEmailService.sendInitPasswordReset(user.email, passwordResetTokenJwt);

    return { message: 'Password reset has been initialized successfully. Please check your email for further instructions.' };
  }

  async executePasswordReset(passwordResetToken: string, password: string): Promise<any> {
    const decodedPayload = this.tokenService.decodePasswordResetToken(passwordResetToken);
    const user = await this.usersService.findOneByPasswordResetToken(decodedPayload.passwordResetToken);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await this.passwordsService.hashPassword(password);
    await this.usersService.updateUserPassword(user.id, hashedPassword);
    await this.usersService.updatePasswordResetToken(null, user.id);
    await this.authEmailService.sendConfirmPasswordReset(user.email);

    return { message: 'Password has been reset successfully. You can now log in using your new password.' };
  }

  async changePassword(
    token: string,
    { currentPassword, newPassword, confirmNewPassword }: ChangePasswordDto,
  ): Promise<{ message: string }> {
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    if (newPassword === currentPassword) {
      throw new BadRequestException('New password and current password are the same');
    }

    let decodedToken;
    try {
      decodedToken = this.tokenService.decodeActivateToken(token);
    } catch (e) {
      throw new BadRequestException('Invalid token');
    }

    if (!decodedToken.id) {
      throw new Error('Invalid token payload');
    }

    const user = await this.findUserAndHandleError(decodedToken.id);
    const passwordMatches = await this.passwordsService.comparePasswords(currentPassword, user.hashedPassword);
    if (!passwordMatches) {
      throw new BadRequestException('Current password is not correct');
    }

    const hashedPassword = await this.passwordsService.hashPassword(newPassword);
    await this.usersService.updateUserPassword(user.id, hashedPassword);

    return { message: 'Password has been changed successfully' };
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
