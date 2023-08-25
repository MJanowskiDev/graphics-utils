import { Body, Controller, Post, HttpCode, HttpStatus, Get, Query, Delete, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BearerTokenHeader } from '../core/decorator/bearer-token-header.decorator';
import { AuthService } from './auth.service';
import { Public } from '../core/decorator/public.decorator';
import {
  ChangePasswordDto,
  ExecutePasswordResetDto,
  ExecutePasswordResetQueryDto,
  InitializePasswordResetDto,
  SignInDto,
  SignUpDto,
} from './dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login endpoint. Returns JWT token.' })
  async signIn(@Body() signInDto: SignInDto, @Res() response?: Response) {
    const token = await this.authService.signIn(signInDto);
    const prod = process.env.NODE_ENV === 'production';

    if (prod) {
      response?.cookie('auth_token', token.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',  
        expires: new Date(Date.now() + 1000 * 3600),
      });
      response?.send({ success: true });
    } else {
      response?.send(token);
      return token;
    }
  }

  @Post('sign-up')
  @Public()
  @ApiOperation({ summary: 'Register endpoint.' })
  register(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('activate')
  @Public()
  @ApiOperation({ summary: 'Account activation endpoint.' })
  activate(@Query('token') token: string) {
    return this.authService.activate(token);
  }

  @Post('sign-out')
  @ApiOperation({ summary: 'User logout endpoint' })
  signOut(@BearerTokenHeader() token: string) {
    return this.authService.signOut(token);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token endpoint' })
  refresh(@BearerTokenHeader() token: string) {
    return this.authService.refresh(token);
  }

  @Get('check-auth')
  @ApiOperation({ summary: 'Check user authentication status.' })
  checkAuthentication() {
    //Auth guard will throw exception if user is not authenticated
    return { isAuthenticated: true };
  }

  @Delete('/user')
  @ApiOperation({ summary: 'Soft delete of a user' })
  delete(@BearerTokenHeader() token: string) {
    return this.authService.delete(token);
  }

  @Public()
  @Post('/init-password-reset')
  @ApiOperation({ summary: 'Initiate password reset process' })
  initializePasswordReset(@Body() initializeDto: InitializePasswordResetDto) {
    return this.authService.initializePasswordReset(initializeDto);
  }

  @Public()
  @Post('/execute-password-reset')
  @ApiOperation({ summary: 'Execute password reset operation' })
  executePasswortReset(@Query() queryDto: ExecutePasswordResetQueryDto, @Body() passwortResetDto: ExecutePasswordResetDto) {
    return this.authService.executePasswordReset(queryDto.token, passwortResetDto.password);
  }

  @Post('/password/change')
  @ApiOperation({ summary: 'Password change operation' })
  changePassword(@BearerTokenHeader() token: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(token, changePasswordDto);
  }
}
