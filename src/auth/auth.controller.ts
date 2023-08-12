import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BearerTokenHeader } from '../core/decorator/bearer-token-header.decorator';
import { AuthService } from './auth.service';
import { Public } from '../core/decorator/public.decorator';
import { SignInDto, SignUpDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login endpoint. Returns JWT token.',
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  @Public()
  @ApiOperation({
    summary: 'Register endpoint.',
  })
  register(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('activate')
  @Public()
  @ApiOperation({
    summary: 'Account activation endpoint.',
  })
  activate(@Query('token') token: string) {
    return this.authService.activate(token);
  }

  @Post('sign-out')
  @ApiOperation({
    summary: 'User logout endpoint',
  })
  signOut(@BearerTokenHeader() token: string) {
    return this.authService.signOut(token);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh token endpoint',
  })
  refresh(@BearerTokenHeader() token: string) {
    return this.authService.refresh(token);
  }

  @Delete('/user')
  @ApiOperation({
    summary: 'Soft delete of a user',
  })
  delete(@BearerTokenHeader() token: string) {
    return this.authService.delete(token);
  }

  @Public()
  @Post('/init-password-reset')
  @ApiOperation({ summary: 'Initiate password reset process' })
  initializePasswordReset(@Body() email: string) {
    return this.authService.initializePasswordReset(email);
  }

  @Public()
  @Post('/execute-password-reset')
  @ApiOperation({ summary: 'Execute password reset operation' })
  executePasswortReset(
    @Query('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.executePasswordReset(token, password);
  }
}
