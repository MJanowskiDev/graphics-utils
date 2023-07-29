import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Headers,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  signOut(@Headers('Authorization') authHeader: string) {
    const token = authHeader.replace('Bearer ', '');
    return this.authService.signOut(token);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh token endpoint',
  })
  refresh(@Headers('Authorization') authHeader: string) {
    const token = authHeader.replace('Bearer ', '');
    return this.authService.refresh(token);
  }

  @Delete('/user')
  @ApiOperation({
    summary: 'Soft delete of an user',
  })
  delete(@Headers('Authorization') authHeader: string) {
    const token = authHeader.replace('Bearer ', '');
    return this.authService.delete(token);
  }
}
